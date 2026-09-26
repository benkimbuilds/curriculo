import type { SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children">;

/** Iconos lineales 24×24, trazo 1.5, heredan color. Siempre decorativos: el texto da el nombre. */
function Icon({ paths, ...props }: IconProps & { paths: string | string[] }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {(Array.isArray(paths) ? paths : [paths]).map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

export const ArrowRight = (props: IconProps) => <Icon paths="M4 12h15M13 6l6 6-6 6" {...props} />;
export const ArrowUpRight = (props: IconProps) => <Icon paths="M7 17 17 7M8 7h9v9" {...props} />;
export const ArrowUp = (props: IconProps) => <Icon paths="M12 20V5M6 11l6-6 6 6" {...props} />;
export const Plus = (props: IconProps) => <Icon paths="M12 5v14M5 12h14" {...props} />;
export const Menu = (props: IconProps) => <Icon paths="M3 8h18M3 16h18" {...props} />;
export const Close = (props: IconProps) => <Icon paths="m6 6 12 12M18 6 6 18" {...props} />;
export const Mail = (props: IconProps) => <Icon paths={["M3.5 6.5h17v11h-17z", "m4 7 8 6 8-6"]} {...props} />;
export const Instagram = (props: IconProps) => (
  <Icon
    paths={["M4.5 4.5h15v15h-15z", "M12 8.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5z", "M16.6 7.4h.01"]}
    {...props}
  />
);
export const Facebook = (props: IconProps) => (
  <Icon paths={["M14.5 4.5h-2a3 3 0 0 0-3 3V20", "M7 11h7"]} {...props} />
);
