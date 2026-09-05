import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return <IconBase {...props}><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></IconBase>;
}

export function ArrowLeft(props: IconProps) {
  return <IconBase {...props}><path d="M19 12H5m5 5-5-5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></IconBase>;
}

export function BookOpen(props: IconProps) {
  return <IconBase {...props}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Zm16 0A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function Check(props: IconProps) {
  return <IconBase {...props}><path d="m5 12.5 4.2 4L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></IconBase>;
}

export function Clock(props: IconProps) {
  return <IconBase {...props}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" /><path d="M12 7.5V12l3 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function Code(props: IconProps) {
  return <IconBase {...props}><path d="m8.5 7-5 5 5 5m7-10 5 5-5 5M14 4l-4 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function Compass(props: IconProps) {
  return <IconBase {...props}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" /></IconBase>;
}

export function ExternalLink(props: IconProps) {
  return <IconBase {...props}><path d="M14 5h5v5m0-5-8 8M10 7H6.5A1.5 1.5 0 0 0 5 8.5v9A1.5 1.5 0 0 0 6.5 19h9a1.5 1.5 0 0 0 1.5-1.5V14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function Folder(props: IconProps) {
  return <IconBase {...props}><path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h5l2 2h7A1.5 1.5 0 0 1 20.5 9.5v8A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5v-10Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function GitBranch(props: IconProps) {
  return <IconBase {...props}><circle cx="6" cy="5" r="2" stroke="currentColor" strokeWidth="1.7" /><circle cx="18" cy="7" r="2" stroke="currentColor" strokeWidth="1.7" /><circle cx="6" cy="19" r="2" stroke="currentColor" strokeWidth="1.7" /><path d="M6 7v10m2-5h3a7 7 0 0 0 7-3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></IconBase>;
}

export function Grid(props: IconProps) {
  return <IconBase {...props}><rect height="6" rx="1" stroke="currentColor" strokeWidth="1.6" width="6" x="3.5" y="3.5" /><rect height="6" rx="1" stroke="currentColor" strokeWidth="1.6" width="6" x="14.5" y="3.5" /><rect height="6" rx="1" stroke="currentColor" strokeWidth="1.6" width="6" x="3.5" y="14.5" /><rect height="6" rx="1" stroke="currentColor" strokeWidth="1.6" width="6" x="14.5" y="14.5" /></IconBase>;
}

export function Heart(props: IconProps) {
  return <IconBase {...props}><path d="M12 20s-8-4.7-8-10.5C4 6.5 6 5 8.2 5c1.7 0 3.1 1 3.8 2.2C12.7 6 14.1 5 15.8 5 18 5 20 6.5 20 9.5 20 15.3 12 20 12 20Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function Home(props: IconProps) {
  return <IconBase {...props}><path d="m3.5 11 8.5-7 8.5 7M5.5 9.5V20h13V9.5M9.5 20v-6h5v6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function Lightbulb(props: IconProps) {
  return <IconBase {...props}><path d="M8.3 15.2A7 7 0 1 1 15.7 15c-1 .7-1.2 1.4-1.2 2.5h-5c0-1.1-.3-1.7-1.2-2.3ZM9.5 21h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function Message(props: IconProps) {
  return <IconBase {...props}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-5.5 4v-4.8A2.5 2.5 0 0 1 4 13.5v-8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function People(props: IconProps) {
  return <IconBase {...props}><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" /><path d="M3.5 19c.4-3.3 2.2-5 5.5-5s5.1 1.7 5.5 5M15 5.4c2.4.2 3.5 1.4 3.5 3.1 0 1.6-.9 2.7-2.7 3.1M16 14c2.8.2 4.2 1.8 4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></IconBase>;
}

export function Send(props: IconProps) {
  return <IconBase {...props}><path d="m21 3-8 18-2.5-7.5L3 11l18-8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /><path d="m10.5 13.5 5-5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></IconBase>;
}

export function Shield(props: IconProps) {
  return <IconBase {...props}><path d="M12 3 5 6v5c0 4.6 2.6 8.1 7 10 4.4-1.9 7-5.4 7-10V6l-7-3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /><path d="m9 12 2 2 4-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></IconBase>;
}

export function Spark(props: IconProps) {
  return <IconBase {...props}><path d="M12 3c.7 4.6 2.4 6.3 7 7-4.6.7-6.3 2.4-7 7-.7-4.6-2.4-6.3-7-7 4.6-.7 6.3-2.4 7-7Zm6 13c.3 2 1 2.7 3 3-2 .3-2.7 1-3 3-.3-2-1-2.7-3-3 2-.3 2.7-1 3-3Z" fill="currentColor" /></IconBase>;
}

export function User(props: IconProps) {
  return <IconBase {...props}><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.7" /><path d="M4.5 21c.5-4.4 3-6.5 7.5-6.5s7 2.1 7.5 6.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></IconBase>;
}

export function Warning(props: IconProps) {
  return <IconBase {...props}><path d="M12 3 2.8 20h18.4L12 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /><path d="M12 9v5m0 3v.1" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /></IconBase>;
}
