import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const preloadImages = (srcs: string[], onProgress?: (progress: number) => void) => {
  let loadedCount = 0;
  const total = srcs.length;

  const promises = srcs.map((src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (onProgress) {
          onProgress(Math.round((loadedCount / total) * 100));
        }
        resolve(src);
      };
      img.onerror = () => {
        // Even if it fails, we count it as "processed" so loading doesn't hang
        loadedCount++;
        if (onProgress) {
          onProgress(Math.round((loadedCount / total) * 100));
        }
        resolve(src); 
      };
    });
  });
  return Promise.all(promises);
};
