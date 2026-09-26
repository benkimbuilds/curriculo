import Image from "next/image";
import type { MediaItem } from "@/content/types";
import { cn } from "@/lib/cn";
import { Frame } from "./frame";

const ratios: Record<MediaItem["ratio"], string> = {
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "16/9": "aspect-video",
  "3/2": "aspect-[3/2]",
};

type MediaSlotProps = {
  item: MediaItem;
  sizes: string;
  /** Carga inmediata: solo para medios del primer viewport. */
  eager?: boolean;
  className?: string;
};

/**
 * Figura editorial. Con imagen: tratamiento monocromo que recupera color en hover/foco (estético,
 * nunca informativo). Sin imagen: espacio reservado que conserva la proporción (sin salto de layout).
 */
export function MediaSlot({ item, sizes, eager, className }: MediaSlotProps) {
  return (
    <figure className={cn("group/media", className)}>
      {item.image ? (
        <div className={cn("relative overflow-hidden bg-bg-raised", ratios[item.ratio])}>
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            className="object-cover grayscale-[0.85] contrast-[1.05] transition-[filter,scale] duration-(--iq-duration-slow) ease-out group-hover/media:grayscale-0 motion-safe:group-hover/media:scale-[1.02]"
            data-reveal="media"
          />
        </div>
      ) : (
        <Frame className={cn("overflow-hidden bg-bg-raised", ratios[item.ratio])}>
          <div
            role="img"
            aria-label={`Imagen pendiente: ${item.caption}`}
            className="grid-lines absolute inset-0 grid place-items-center"
          >
            <span className="type-meta text-fg-subtle">
              Imagen pendiente · {item.ratio.replace("/", ":")}
            </span>
          </div>
        </Frame>
      )}
      <figcaption className="mt-3 flex items-center justify-between gap-4">
        <span className="type-meta text-fg-muted">{item.caption}</span>
      </figcaption>
    </figure>
  );
}
