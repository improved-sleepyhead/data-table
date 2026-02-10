export const Button = ({
  className = "",
  variant = "primary",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center h-10 px-4 py-2 rounded-md text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    primary: "bg-green-primary text-white hover:opacity-90 shadow-sm",
    secondary: "bg-neutral-200 text-gray-900 hover:bg-neutral-300",
    outline: "border border-neutral-300 bg-white hover:bg-neutral-300",
    ghost: "bg-transparent hover:bg-neutral-200"
  }

  const variantStyles = variants[variant] || variants.primary

  const finalClass = `${baseStyles} ${variantStyles} ${className}`

  return (
    <button className={finalClass} {...props}>
      {children}
    </button>
  )
}
