import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ZodError } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//conversion JSON to plain text
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.slice(0, 2).padEnd(2, '0')}` : `${int}.00`;
}

// Format Errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any): string {
  if (error instanceof ZodError) {
    const fieldErrors = error.issues.map((issue) => {
      const field = issue.path.join('.');
      return `${field}: ${issue.message}`;
    });

    return fieldErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    // Handle Prisma error
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    // Handle other errors
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
}

// Round number to 2 decimal places
export function round2  (value: number | string) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100; // avoid rounding errors
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Value is not a number nor a string');
  }
};

//Currency format
// Helper
export const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
// Function using helper
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'NaN';
  }
}
