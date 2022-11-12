import Game from "./Game";
import { coords } from "./interfaces";

export default class Player {
  size: coords;
  position: coords;
  speed: number;
  maxSpeed: number;
  moves: Set<String>;
  game: Game;
  constructor(width: number, height: number, game: Game) {
    (this.size = { x: width, y: height }), (this.game = game);
    (this.position = { x: 0, y: this.game.minPlayerArea - this.size.y }),
      (this.moves = new Set());
    this.speed = 5;
    this.maxSpeed = 30;
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
    //horizontal movemnet
    if (this.moves.has("UP") || this.moves.has("DOWN")) {
      this.position.y =
        this.game.minPlayerArea -
        (this.speed / this.maxSpeed) * this.game.maxPlayerArea;
      if (this.moves.has("UP"))
        if (this.speed < this.maxSpeed) this.speed += 0.25;
      if (this.moves.has("DOWN")) if (this.speed > 0) this.speed -= 0.25;
    }

    //vertical movement
    let turn =
      ((this.speed / this.maxSpeed) * (this.game.gameWidth / this.size.x)) /
      1.5;

    if (this.moves.has("LEFT") && this.speed > 0 && this.position.x > 0) {
      this.position.x -= turn;
    }
    if (
      this.moves.has("RIGHT") &&
      this.speed > 0 &&
      this.position.x < this.game.gameWidth - this.game.playerWidth * 1.5
    ) {
      this.position.x += turn;
    }
  };

  addMove(action: string) {
    this.moves.add(action);
  }
  removeMove(action: string) {
    this.moves.delete(action);
  }
}
