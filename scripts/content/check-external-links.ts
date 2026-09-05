import { assertValidCurriculum } from "../../src/modules/curriculum/loader";

const urls = [
  ...new Set(
    assertValidCurriculum().flatMap((document) => [
      document.provenance.upstreamRepository,
      ...document.provenance.externalResources.map((resource) => resource.url),
    ]),
  ),
].sort();

async function main() {
  const failures: string[] = [];
  for (const url of urls) {
    try {
      const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
      headers: { "user-agent": "AI-Builders-Curriculum-Link-Check/1.0" },
    });
    // Some documentation hosts reject automated HEAD requests while serving a valid GET.
      const status = response.status === 405 ? (await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(10_000),
        headers: { "user-agent": "AI-Builders-Curriculum-Link-Check/1.0", range: "bytes=0-0" },
      })).status : response.status;
      if (status === 404 || status === 410 || status >= 500) failures.push(`${status} ${url}`);
      else console.log(`${status} ${url}`);
    } catch (error) {
      failures.push(`${url}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`External curriculum link check failed:\n${failures.join("\n")}`);
  }

  console.log(`Checked ${urls.length} unique external curriculum URLs.`);
}

void main();
