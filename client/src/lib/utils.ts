import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn<T extends string>(...inputs: T[]): string {
  return twMerge(clsx(inputs));
}
