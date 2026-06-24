import Link from "next/link";
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  children,
  id,
  muted = false,
  className = "",
}: {
  children: ReactNode;
  id?: string;
  muted?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 py-20 sm:py-24 ${
        muted ? "bg-muted" : "bg-background"
      } ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      }
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "filled" | "outlined" | "ghost" | "inverted";
  size?: "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

const buttonBase =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-md)] transition-all focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 active:scale-[0.98]";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  filled:
    "bg-primary text-primary-foreground shadow-sm hover:brightness-110",
  outlined: "border border-border text-foreground hover:bg-muted",
  ghost: "text-primary hover:bg-primary/10",
  inverted: "bg-background text-foreground shadow-sm hover:bg-muted",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-7 py-3 text-base",
};

export function Button({
  children,
  href,
  variant = "filled",
  size = "md",
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const cls = `${buttonBase} ${variants[variant]} ${sizes[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "primary",
  className = "",
}: {
  children: ReactNode;
  tone?: "primary" | "accent" | "muted" | "success" | "warning";
  className?: string;
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    muted: "bg-muted text-muted-foreground",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-border bg-card p-6 ${
        hover
          ? "transition-all hover:-translate-y-0.5 hover:shadow-md"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
