// Performance Monitoring Utilities
// This file provides utilities for monitoring and measuring performance
"use client";

// Measure function execution time
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  if (typeof window === "undefined") {
    return fn(); // Skip on server
  }

  const start = performance.now();
  const result = fn();
  const end = performance.now();
  const duration = end - start;

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }

  return result;
}

// Measure async function execution time
export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  if (typeof window === "undefined") {
    return fn(); // Skip on server
  }

  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }

  return result;
}

// Measure component render time
export function measureComponentRender(
  componentName: string,
  renderFn: () => void
): void {
  if (typeof window === "undefined") {
    renderFn();
    return;
  }

  measurePerformance(`Component Render: ${componentName}`, renderFn);
}

// Get page load time
export function getPageLoadTime(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;
  return navigation.loadEventEnd - navigation.fetchStart;
}

// Get time to first byte (TTFB)
export function getTTFB(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;
  return navigation.responseStart - navigation.fetchStart;
}

// Get DOM content loaded time
export function getDOMContentLoadedTime(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;
  return navigation.domContentLoadedEventEnd - navigation.fetchStart;
}

// Get first contentful paint (FCP)
export function getFCP(): number | null {
  if (typeof window === "undefined") {
    return null;
  }

  const paintEntries = performance.getEntriesByType("paint");
  const fcpEntry = paintEntries.find(
    (entry) => entry.name === "first-contentful-paint"
  );
  return fcpEntry ? fcpEntry.startTime : null;
}

// Get largest contentful paint (LCP)
export async function getLCP(): Promise<number | null> {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      return (lastEntry as any).renderTime || (lastEntry as any).loadTime;
    });

    observer.observe({ entryTypes: ["largest-contentful-paint"] });

    // Return LCP after a delay (LCP is measured over time)
    return new Promise((resolve) => {
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, 5000);
    });
  } catch {
    return null;
  }
}

// Log performance metrics
export function logPerformanceMetrics(): void {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development") {
    return;
  }

  const metrics = {
    pageLoadTime: getPageLoadTime(),
    ttfb: getTTFB(),
    domContentLoaded: getDOMContentLoadedTime(),
    fcp: getFCP(),
  };

  console.log("[Performance Metrics]", metrics);
}

// Monitor component mount time
export function usePerformanceMonitor(componentName: string) {
  if (typeof window === "undefined") {
    return;
  }

  const start = performance.now();

  // Log when component unmounts
  return () => {
    const end = performance.now();
    const duration = end - start;

    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${componentName} mounted: ${duration.toFixed(2)}ms`);
    }
  };
}

