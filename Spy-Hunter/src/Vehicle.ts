import { civilian } from "./config";
import Game from "./Game";
import { coords } from "./interfaces";
import Obstacle from "./Obstacle";

export default class Vehicle {
  size: coords;
  position: coords;
  maxSpeed: number;
  environment: number; // Player environment for obstacles, range of objects
  maxVibrations: number;
  game: Game;
  collisionDifferenceLimit: number;

  lastSignVibration: number;
  speed: number;
  collisionPoints: { x: number; y: number }[];
  isActive: boolean;
  moves: Set<String>;
  img: HTMLImageElement | undefined | CanvasImageSource;

  constructor(width: number, height: number, game: Game) {
    (this.size = { x: width, y: height }), (this.game = game);
    (this.position = { x: 200, y: this.game.minPlayerArea - this.size.y }),
      (this.moves = new Set());
    this.collisionPoints = [];
    this.speed = 5;
    this.maxSpeed = 40;
    this.maxVibrations = 8;
    this.lastSignVibration = 1;
    this.isActive = true;
    this.environment = 150;
    this.collisionDifferenceLimit = 15;

    this.createPlayer();
  }

  createPlayer = () => {
    this.img = new Image();
    this.img.src = civilian.find((el) => el.id == 0)!.imgSrc;
    this.img.width = this.size.x;
    this.img.height = this.size.y;
  };

  death = () => {
    //animacje dorobimy ze tak buch robi
    this.isActive = false;
    this.game.vehicles.vehicles = this.game.vehicles.vehicles.filter(
      (vehicle) => vehicle != this
    );

    //this.game.isGameplay = false;
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
    this.collisionPoints = this.game.collision.checkCollision(
      this,
      this.collisionPoints,
      context,
      this.position,
      this.size,
      this.collisionDifferenceLimit
    );

    context.drawImage(
      this.img!,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  };
}
