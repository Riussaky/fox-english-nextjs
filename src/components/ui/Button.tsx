import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-kid-teal text-white hover:bg-kid-teal/90",
  secondary: "bg-kid-purple text-white hover:bg-kid-purple/90",
  ghost: "bg-white text-kid-ink border-2 border-kid-ink/10 hover:border-kid-ink/20",
};

export function KidButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`rounded-full px-6 py-3 text-lg font-semibold shadow-[0_4px_0_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-none transition disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
