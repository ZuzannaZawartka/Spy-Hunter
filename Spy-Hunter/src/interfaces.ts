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

interface gameObjects {
  id: number;
  type: string;
  imgSrc: string;
  afterCollisionImgSrc: string;
  width: number;
  height: number;
  maxSpeed: number;
  isCivilian: boolean;
}

export type { size, coords, color, gameObjects };
