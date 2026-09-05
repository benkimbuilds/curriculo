import { lookup } from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import { isIP } from "node:net";

export interface ResolvedAddress {
  readonly address: string;
  readonly family: 4 | 6;
}

export interface HostResolver {
  resolve(hostname: string): Promise<readonly ResolvedAddress[]>;
}

export interface HttpResponseSnapshot {
  readonly status: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: string;
}

export interface PinnedHttpTransport {
  get(
    url: URL,
    addresses: readonly ResolvedAddress[],
    limits: { readonly timeoutMs: number; readonly maxResponseBytes: number },
  ): Promise<HttpResponseSnapshot>;
}

export interface PublicHttpPolicy {
  readonly timeoutMs: number;
  readonly maxResponseBytes: number;
  readonly maxRedirects: number;
}

export interface PublicHttpDependencies {
  readonly resolver?: HostResolver;
  readonly transport?: PinnedHttpTransport;
  readonly now?: () => number;
}

export class PublicHttpSafetyError extends Error {
  constructor(readonly code: string) {
    super(code);
    this.name = "PublicHttpSafetyError";
  }
}

export const DEFAULT_PUBLIC_HTTP_POLICY: PublicHttpPolicy = Object.freeze({
  timeoutMs: 5_000,
  maxResponseBytes: 512 * 1024,
  maxRedirects: 4,
});

const defaultResolver: HostResolver = {
  async resolve(hostname) {
    const records = await lookup(hostname, { all: true, verbatim: true });
    return records
      .filter((record): record is { address: string; family: 4 | 6 } =>
        record.family === 4 || record.family === 6,
      )
      .map((record) => ({ address: record.address, family: record.family }));
  },
};

function headerValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value.join(", ") : (value ?? "");
}

export const nodePinnedHttpTransport: PinnedHttpTransport = {
  get(url, addresses, limits) {
    const selected = addresses[0];
    if (!selected) throw new PublicHttpSafetyError("dns_no_addresses");
    const client = url.protocol === "https:" ? https : http;
    const hostname = unbracket(url.hostname);

    return new Promise<HttpResponseSnapshot>((resolve, reject) => {
      let settled = false;
      const resolveOnce = (response: HttpResponseSnapshot) => {
        if (settled) return;
        settled = true;
        resolve(response);
      };
      const rejectOnce = (error: Error) => {
        if (settled) return;
        settled = true;
        reject(error);
      };
      const request = client.request(
        {
          protocol: url.protocol,
          hostname: selected.address,
          family: selected.family,
          port: url.port || (url.protocol === "https:" ? 443 : 80),
          method: "GET",
          path: `${url.pathname}${url.search}`,
          servername: url.protocol === "https:" ? hostname : undefined,
          headers: {
            Host: url.host,
            Accept: "text/html,application/xhtml+xml",
            "Accept-Encoding": "identity",
            "User-Agent": "Curriculo-Week1-Evaluator/1.0",
          },
        },
        (response) => {
          const chunks: Buffer[] = [];
          let bytes = 0;
          response.on("data", (chunk: Buffer | string) => {
            const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            bytes += buffer.byteLength;
            if (bytes > limits.maxResponseBytes) {
              const error = new PublicHttpSafetyError("response_too_large");
              rejectOnce(error);
              response.destroy();
              request.destroy();
              return;
            }
            chunks.push(buffer);
          });
          response.once("error", rejectOnce);
          response.on("end", () => {
            const headers: Record<string, string> = {};
            for (const [name, value] of Object.entries(response.headers)) {
              headers[name.toLowerCase()] = headerValue(value);
            }
            resolveOnce({
              status: response.statusCode ?? 0,
              headers: Object.freeze(headers),
              body: Buffer.concat(chunks).toString("utf8"),
            });
          });
        },
      );

      request.setTimeout(limits.timeoutMs, () => {
        request.destroy(new PublicHttpSafetyError("request_timeout"));
      });
      request.once("error", rejectOnce);
      request.end();
    });
  },
};

function unbracket(hostname: string): string {
  return hostname.startsWith("[") && hostname.endsWith("]")
    ? hostname.slice(1, -1)
    : hostname;
}

function ipv4Number(address: string): number | null {
  if (isIP(address) !== 4) return null;
  const parts = address.split(".").map(Number);
  return (((parts[0] * 256 + parts[1]) * 256 + parts[2]) * 256 + parts[3]) >>> 0;
}

function inIpv4Cidr(value: number, base: number, bits: number): boolean {
  if (bits === 0) return true;
  const mask = (0xffff_ffff << (32 - bits)) >>> 0;
  return (value & mask) === (base & mask);
}

function parseIpv6(address: string): readonly number[] | null {
  if (isIP(address) !== 6) return null;
  const withoutZone = address.split("%")[0].toLowerCase();
  const [leftPart, rightPart = ""] = withoutZone.split("::");
  if (withoutZone.split("::").length > 2) return null;

  const expandSide = (side: string): number[] => {
    if (!side) return [];
    return side.split(":").flatMap((piece) => {
      if (!piece.includes(".")) return [Number.parseInt(piece, 16)];
      const ipv4 = ipv4Number(piece);
      return ipv4 === null ? [Number.NaN] : [(ipv4 >>> 16) & 0xffff, ipv4 & 0xffff];
    });
  };

  const left = expandSide(leftPart);
  const right = expandSide(rightPart);
  const missing = 8 - left.length - right.length;
  if ((withoutZone.includes("::") && missing < 1) || (!withoutZone.includes("::") && missing !== 0)) {
    return null;
  }
  const pieces = [...left, ...Array.from({ length: missing }, () => 0), ...right];
  if (pieces.length !== 8 || pieces.some((piece) => !Number.isInteger(piece) || piece < 0 || piece > 0xffff)) {
    return null;
  }
  return pieces;
}

function inIpv6Cidr(value: readonly number[], baseAddress: string, bits: number): boolean {
  const base = parseIpv6(baseAddress);
  if (!base) return false;
  const completeGroups = Math.floor(bits / 16);
  for (let index = 0; index < completeGroups; index += 1) {
    if (value[index] !== base[index]) return false;
  }
  const remainingBits = bits % 16;
  if (remainingBits === 0) return true;
  const mask = (0xffff << (16 - remainingBits)) & 0xffff;
  return (value[completeGroups] & mask) === (base[completeGroups] & mask);
}

export function isPublicIpAddress(address: string): boolean {
  const ipv4 = ipv4Number(address);
  if (ipv4 !== null) {
    const blocked: readonly [number, number][] = [
      [0x0000_0000, 8],
      [0x0a00_0000, 8],
      [0x6440_0000, 10],
      [0x7f00_0000, 8],
      [0xa9fe_0000, 16],
      [0xac10_0000, 12],
      [0xc000_0000, 24],
      [0xc000_0200, 24],
      [0xc0a8_0000, 16],
      [0xc612_0000, 15],
      [0xc633_6400, 24],
      [0xcb00_7100, 24],
      [0xe000_0000, 4],
      [0xf000_0000, 4],
    ];
    return !blocked.some(([base, bits]) => inIpv4Cidr(ipv4, base, bits));
  }

  const ipv6 = parseIpv6(address);
  if (ipv6 === null) return false;
  if (inIpv6Cidr(ipv6, "::ffff:0:0", 96)) {
    const ipv4 = ipv6[6] * 65_536 + ipv6[7];
    return isPublicIpAddress(
      `${(ipv4 >>> 24) & 255}.${(ipv4 >>> 16) & 255}.${(ipv4 >>> 8) & 255}.${ipv4 & 255}`,
    );
  }

  const blockedV6: readonly [string, number][] = [
    ["::", 128],
    ["::1", 128],
    ["100::", 64],
    ["2001:db8::", 32],
    ["fc00::", 7],
    ["fe80::", 10],
    ["fec0::", 10],
    ["ff00::", 8],
  ];
  return !blockedV6.some(([base, bits]) => inIpv6Cidr(ipv6, base, bits));
}

export function validatePublicHttpUrl(value: string): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new PublicHttpSafetyError("invalid_url");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new PublicHttpSafetyError("unsupported_protocol");
  }
  if (url.username || url.password) throw new PublicHttpSafetyError("credentials_not_allowed");
  if (
    url.port &&
    !((url.protocol === "http:" && url.port === "80") ||
      (url.protocol === "https:" && url.port === "443"))
  ) {
    throw new PublicHttpSafetyError("port_not_allowed");
  }
  return url;
}

async function resolveAndValidate(
  url: URL,
  resolver: HostResolver,
): Promise<readonly ResolvedAddress[]> {
  const hostname = unbracket(url.hostname);
  const literalFamily = isIP(hostname);
  const addresses: readonly ResolvedAddress[] = literalFamily
    ? [{ address: hostname, family: literalFamily as 4 | 6 }]
    : await resolver.resolve(hostname);
  if (addresses.length === 0) throw new PublicHttpSafetyError("dns_no_addresses");
  if (addresses.some(({ address, family }) => isIP(address) !== family)) {
    throw new PublicHttpSafetyError("dns_invalid_address");
  }
  if (addresses.some(({ address }) => !isPublicIpAddress(address))) {
    throw new PublicHttpSafetyError("non_public_address");
  }
  return addresses;
}

async function withinDeadline<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  if (timeoutMs <= 0) throw new PublicHttpSafetyError("request_timeout");
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new PublicHttpSafetyError("request_timeout")), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function fetchPublicHtml(
  value: string,
  policy: PublicHttpPolicy = DEFAULT_PUBLIC_HTTP_POLICY,
  dependencies: PublicHttpDependencies = {},
): Promise<HttpResponseSnapshot & { readonly finalUrl: string }> {
  const resolver = dependencies.resolver ?? defaultResolver;
  const transport = dependencies.transport ?? nodePinnedHttpTransport;
  const now = dependencies.now ?? Date.now;
  const deadline = now() + policy.timeoutMs;
  const visited = new Set<string>();
  let url = validatePublicHttpUrl(value);

  for (let redirects = 0; redirects <= policy.maxRedirects; redirects += 1) {
    if (visited.has(url.href)) throw new PublicHttpSafetyError("redirect_loop");
    visited.add(url.href);

    const remainingForDns = deadline - now();
    const addresses = await withinDeadline(resolveAndValidate(url, resolver), remainingForDns);
    const remainingForRequest = deadline - now();
    const response = await withinDeadline(
      transport.get(url, addresses, {
        timeoutMs: remainingForRequest,
        maxResponseBytes: policy.maxResponseBytes,
      }),
      remainingForRequest,
    );

    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return Object.freeze({ ...response, finalUrl: url.href });
    }
    const location = response.headers.location;
    if (!location) throw new PublicHttpSafetyError("redirect_without_location");
    if (redirects === policy.maxRedirects) {
      throw new PublicHttpSafetyError("too_many_redirects");
    }
    try {
      url = validatePublicHttpUrl(new URL(location, url).href);
    } catch (error) {
      if (error instanceof PublicHttpSafetyError) throw error;
      throw new PublicHttpSafetyError("invalid_redirect");
    }
  }

  throw new PublicHttpSafetyError("too_many_redirects");
}
