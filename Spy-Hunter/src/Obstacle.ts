import Game from "./Game";
import { coords } from "./interfaces";

export default class Obstacle {
  game: Game;
  type: string;
  position: coords;
  size: coords;
  img: HTMLImageElement;
  used: boolean;
  afterCollisionImgSrc: string;
  sign: number;
  constructor(
    game: Game,
    type: string,
    position: coords,
    size: coords,
    imgSrc: string,
    afterCollisionImgSrc: string
  ) {
    this.game = game;
    this.type = type;
    this.position = position;
    this.size = size;
    this.img = new Image();
    this.img.src = imgSrc;
    this.used = false;
    this.afterCollisionImgSrc = afterCollisionImgSrc;
    this.sign = Math.random() < 0.5 ? -1 : 1;
  }

  draw = () => {
    this.game.context.drawImage(
      this.img,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  };

  useObstacle = () => {
    this.img.src = this.afterCollisionImgSrc;
    setTimeout(() => {
      this.used = true;
    }, 40);
  };

  changeImg = () => {
    this.img.src = this.afterCollisionImgSrc;
  };

  update = () => {
    if (
      !this.game.player.isActive &&
      this.game.isGameplay &&
      !this.game.isPackingCar
    ) {
      if (this.game.player.position.y < this.game.gameHeight) {
        this.position.y += this.game.recoverySpeed;
      }
    } else {
      this.position.y += this.game.player.speed;
    }
  };
}
