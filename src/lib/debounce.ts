// utils/debounce.ts
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
    let timeout: NodeJS.Timeout | null = null;
    return function(this: any, ...args: Parameters<T>) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  