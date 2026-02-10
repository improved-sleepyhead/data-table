import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const parseCurrency = value => {
  if (typeof value === "number") return value
  if (!value) return 0
  const cleanString = value.toString().replace(/[^0-9.-]+/g, "")
  return parseFloat(cleanString)
}
