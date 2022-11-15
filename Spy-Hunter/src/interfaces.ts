interface size {
  width?: number;
  height?: number;
}

interface color {
  id: number;
  ground: string;
  RED: number;
  GREEN: number;
  BLUE: number;
}

interface coords {
  x: number;
  y: number;
}

export type { size, coords, color };
