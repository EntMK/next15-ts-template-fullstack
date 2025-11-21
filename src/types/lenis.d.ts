declare module "lenis" {
  export interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    direction?: "vertical" | "horizontal";
    gestureDirection?: "vertical" | "horizontal" | "both";
    smooth?: boolean;
    mouseMultiplier?: number;
    smoothTouch?: boolean;
    touchMultiplier?: number;
    infinite?: boolean;
  }

  export default class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    scrollTo(
      target: number | string | HTMLElement,
      options?: {
        offset?: number;
        immediate?: boolean;
        duration?: number;
        easing?: (t: number) => number;
        onComplete?: () => void;
      }
    ): void;
    on(event: string, callback: (e: any) => void): void;
    off(event: string, callback: (e: any) => void): void;
    destroy(): void;
    stop(): void;
    start(): void;
  }
}
