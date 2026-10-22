import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400",
      danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm",
      outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-blue-500",
      ghost: "text-slate-600 hover:bg-slate-100 focus:ring-slate-400",
    };

    const sizes = {
      sm: "text-xs px-2.5 py-1.5 h-8 gap-1.5",
      md: "text-sm px-4 py-2 h-10 gap-2",
      lg: "text-base px-5 py-2.5 h-12 gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={twMerge(clsx(base, variants[variant], sizes[size], className))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
