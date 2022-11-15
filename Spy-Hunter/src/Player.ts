import Game from "./Game";
import Collision from "./Collision";
import { coords } from "./interfaces";

export default class Player {
  size: coords;
  position: coords;
  speed: number;
  maxSpeed: number;
  playerEnvironment: number;
  maxVibrations: number;
  lastSignVibration: number;
  isActive: boolean;
  moves: Set<String>;
  game: Game;
  collision: Collision;
  constructor(width: number, height: number, game: Game) {
    (this.size = { x: width, y: height }), (this.game = game);
    (this.position = { x: 200, y: this.game.minPlayerArea - this.size.y }),
      (this.moves = new Set());
    this.collision = new Collision(this);
    this.speed = 5;
    this.maxSpeed = 80;
    this.maxVibrations = 8;
    this.lastSignVibration = 1;
    this.isActive = true;
    this.playerEnvironment = 150;
    this.resizePLayer();
  }

  resizePLayer = () => {
    let player = document.getElementById("playerImage");
    player!.style.width = this.size.x + "px";
    player!.style.height = this.size.y + "px";
  };

  death = () => {
    //animacje dorobimy ze tak buch robi
    this.isActive = false;
    this.game.isGameplay = false;
  };

  addMove(action: string) {
    this.moves.add(action);
  }
  removeMove(action: string) {
    this.moves.delete(action);
  }

  simulateVibrations = () => {
    if (this.lastSignVibration > 0) this.position.x += -this.maxVibrations;
    else this.position.x += this.maxVibrations;
    this.lastSignVibration = -this.lastSignVibration;
  };

  draw = (context: CanvasRenderingContext2D) => {
    this.collision.checkCollision(context);
    context.drawImage(
      document.getElementById("playerImage") as CanvasImageSource,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  };

  update = () => {
    if (this.isActive) {
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
        console.log(this.position);
        this.game.background.getRoadStartEndPoints(0);
        this.position.x -= turn;
      }
      if (
        this.moves.has("RIGHT") &&
        this.speed > 0 &&
        this.position.x < this.game.gameWidth - this.game.playerWidth * 1.5
      ) {
        this.position.x += turn;
      }
    }
  };
}
