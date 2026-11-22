import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {
  const classNames = cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
      "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-soft hover:shadow-elevated": variant === "primary",
      "bg-white text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] hover:bg-gray-50/50 shadow-sm": variant === "secondary",
      "hover:bg-[var(--color-soft-green)] text-[var(--color-text-primary)] hover:text-[var(--color-primary)]": variant === "ghost",
      "bg-[var(--color-danger)] text-white hover:bg-red-700 shadow-soft": variant === "danger",
    },
    {
      "h-10 px-5 py-2": size === "default",
      "h-8 rounded-md px-3 text-xs": size === "sm",
      "h-12 rounded-xl px-8 text-base": size === "lg",
      "h-10 w-10": size === "icon",
    },
    className
  );

  if (asChild && React.isValidElement(props.children)) {
    const child = React.Children.only(props.children);
    
    // We need to omit children from props so we don't pass it down incorrectly if it's already in the element
    const { children, ...restProps } = props;
    
    return React.cloneElement(child, {
      ...restProps,
      ...child.props, // child props take precedence
      ref,
      className: cn(classNames, child.props.className),
      // merge onClick if both exist
      onClick: (e) => {
        if (props.onClick) props.onClick(e);
        if (child.props.onClick) child.props.onClick(e);
      }
    });
  }

  return (
    <button
      ref={ref}
      className={classNames}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }