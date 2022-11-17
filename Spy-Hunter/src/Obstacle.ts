import Game from "./Game";
import { coords } from "./interfaces";

export default class Obstacle {
  game: Game;
  position: coords;
  size: coords;
  img: HTMLImageElement;
  imgSrc: string;
  constructor(game: Game, position: coords, size: coords, imgSrc: string) {
    this.game = game;
    this.position = position;
    this.size = size;
    this.imgSrc = imgSrc;
    this.img = new Image();
    this.img.src = imgSrc;
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

  update = () => {
    this.position.y += this.game.player.speed;
  };
}
