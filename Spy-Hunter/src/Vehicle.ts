import Game from "./Game";
import { coords } from "./interfaces";
import Obstacle from "./Obstacle";

export default class Vehicle {
  size: coords;
  position: coords;
  maxSpeed: number;
  playerEnvironment: number; // Player environment for obstacles, range of objects
  maxVibrations: number;
  game: Game;

  lastSignVibration: number;
  speed: number;
  playerCollisionPoints: { x: number; y: number }[];
  isActive: boolean;
  moves: Set<String>;

  constructor(width: number, height: number, game: Game) {
    (this.size = { x: width, y: height }), (this.game = game);
    (this.position = { x: 200, y: this.game.minPlayerArea - this.size.y }),
      (this.moves = new Set());
    this.playerCollisionPoints = [];
    this.speed = 5;
    this.maxSpeed = 40;
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

  checkTypeOfGroundUnderPlayer = () => {
    const data = this.game.context.getImageData(
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    ).data;

    return this.game.collision.checkTypeOfCollision(data);
  };

  vibrations = () => {
    if (this.lastSignVibration > 0) this.position.x += -this.maxVibrations;
    else this.position.x += this.maxVibrations;
    this.lastSignVibration = -this.lastSignVibration;
  };

  skid = (element: Obstacle) => {
    let posX = Math.floor(
      Math.random() * (this.speed / 10 + this.maxVibrations / 2) +
        this.maxVibrations / 2
    );
    this.isActive = false;
    for (let i = 0; i < this.speed; i++) {
      setTimeout(() => {
        if (element.sign < 0) this.position.x += posX / this.speed;
        else this.position.x -= posX / this.speed;
      }, 10);
    }
    this.isActive = true;
  };

  draw = (context: CanvasRenderingContext2D) => {
    this.playerCollisionPoints = this.game.collision.checkCollision(
      this.playerCollisionPoints,
      context,
      this.position,
      this.size
    );

    context.drawImage(
      document.getElementById("playerImage") as CanvasImageSource,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  };
}
