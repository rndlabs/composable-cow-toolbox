declare module 'jazzicon' {
    import { HTMLCanvasElement } from 'canvas';
  
    export function createIcon(diameter: number, seed: number): HTMLCanvasElement;
    export function createCanvas(diameter: number, seed: number): HTMLCanvasElement;
  }
  