import Game from "./Game";
import playerImageUrl from "../graphics/car.png";
import { coords } from "./interfaces";

export default class Player {
  size: coords;
  position: coords;
  speed: number;
  moves: Set<String>;
  game: Game;
  constructor(width: number, height: number, game: Game) {
    (this.size = { x: width, y: height }), (this.game = game);
    (this.position = { x: 0, y: this.game.gameHeight - this.size.y }),
      (this.moves = new Set());
    this.speed = 5;
    this.resizePLayer();
  }

  resizePLayer = () => {
    let player = document.getElementById("playerImage");
    player!.style.width = this.size.x + "px";
    player!.style.height = this.size.y + "px";
  };

  //context: CanvasRenderingContext2D
  draw = (context: CanvasRenderingContext2D) => {
    context.fillStyle = "black";
    context.fillRect(
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
    context.drawImage(
      document.getElementById("playerImage") as CanvasImageSource,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  };

  update = () => {
    this.position.x++;
    // console.log(this.position);
  };

  addMove(action: string) {
    this.moves.add(action);
  }
  removeMove(action: string) {
    this.moves.delete(action);
  }
}
