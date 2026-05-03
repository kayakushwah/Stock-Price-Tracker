/**
 * Utility function to merge class names (like clsx + tailwind-merge).
 * Filters falsy values and joins with a space.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
