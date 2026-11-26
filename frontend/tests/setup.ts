import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Removes what each test rendered, so the next test starts with an empty page.
afterEach(() => {
  cleanup();
});

// jsdom has no window.matchMedia, and Mantine calls it for the color scheme and the responsive props.
// This stub answers that no media query matches.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
