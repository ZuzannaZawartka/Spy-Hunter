import { coords } from "./interfaces";

export default class Bullet {
  position: coords;
  speed: number;
  size: coords;
  color: string;

  constructor(position: coords, speed: number) {
    this.position = position;
    this.speed = speed;
    this.size = { x: 5, y: 30 };
    this.color = "orange";
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = this.color;
    this.position.y -= this.speed;
    context.fillRect(
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  }
}
