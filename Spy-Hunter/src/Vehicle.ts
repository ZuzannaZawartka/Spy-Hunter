import { vehicles } from "./config";
import Game from "./Game";
import { coords, gameObjects } from "./interfaces";
import Obstacle from "./Obstacle";

export default class Vehicle {
  size: coords;
  position: coords;
  maxSpeed: number;
  environment: number; // Player environment for obstacles, range of objects
  maxVibrations: number;
  game: Game;
  collisionDifferenceLimit: number;
  isCivilian: boolean;
  bouncePower: number;

  lastSignVibration: number;
  speed: number;
  collisionPoints: { x: number; y: number }[];
  vehicleHitAction: { x: number; y: number }[];
  isActive: boolean;
  moves: Set<String>;
  img: HTMLImageElement | undefined | CanvasImageSource;

  constructor(width: number, height: number, game: Game) {
    (this.size = { x: width, y: height }), (this.game = game);
    (this.position = { x: 200, y: this.game.minPlayerArea - this.size.y }),
      (this.moves = new Set());
    this.collisionPoints = [];
    this.vehicleHitAction = [];
    this.speed = 5;
    this.maxSpeed = 40;
    this.maxVibrations = 8;
    this.bouncePower = 20;
    this.lastSignVibration = 1;
    this.isActive = true;
    this.environment = 150;
    this.collisionDifferenceLimit = 15;
    this.isCivilian = false;
  }

  createPlayer = () => {
    let number = Math.floor(Math.random() * vehicles.length);
    let vehicle = vehicles.find((vehicle) => vehicle.id == number);
    this.isCivilian = vehicle!.isCivilian;
    this.maxSpeed = vehicle!.maxSpeed;
    this.img = new Image();
    this.img.src = vehicle!.imgSrc;
    this.img.width = vehicle!.width;
    this.img.height = vehicle!.height;
    this.size = { x: vehicle!.width, y: vehicle!.height };
  };

  createVehicle = (config: gameObjects) => {
    let vehicle = config;
    this.isCivilian = vehicle!.isCivilian;
    this.maxSpeed = vehicle!.maxSpeed;
    this.img = new Image();
    this.img.src = vehicle!.imgSrc;
    this.img.width = vehicle!.width;
    this.img.height = vehicle!.height;
    this.size = { x: vehicle!.width, y: vehicle!.height };
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

  refreshPosition = () => {
    if (this.position.y < this.game.gameHeight - 200) {
      if (
        this.game.player.moves.has("UP") ||
        this.game.player.speed >= this.game.player.maxSpeed
      ) {
        this.speed--;
      } else if (
        this.game.player.moves.has("DOWN") ||
        this.game.player.speed <= this.game.player.maxSpeed / 3
      ) {
        this.speed++;
      }
    } else {
      this.speed++;
    }
    this.position.y -= (this.speed / this.maxSpeed) * 2;

    this.position.x -= this.game.collision.checkIsColorCollison(
      this,
      this.collisionPoints,
      this.game.context
    );

    if (this.speed >= this.maxSpeed) this.speed = this.maxSpeed;
  };

  moveAfterHit = (
    vehicle: Vehicle,
    opponent: Vehicle,
    directionIndex: number
  ) => {
    if (vehicle.isCivilian && !opponent.isCivilian) {
      //vehicle.position.x += vehicle.vehicleHitAction[directionIndex].x;
      if (vehicle.vehicleHitAction[directionIndex].x > 0)
        vehicle.position.x -=
          vehicle.vehicleHitAction[directionIndex].x / (this.bouncePower / 4);
      else
        vehicle.position.x +=
          vehicle.vehicleHitAction[directionIndex].x / (this.bouncePower / 4);

      console.log(vehicle.vehicleHitAction[directionIndex].x);
    } else if (!vehicle.isCivilian && opponent.isCivilian) {
      opponent.position.x +=
        vehicle.vehicleHitAction[directionIndex].x / (this.bouncePower / 4);
    } else {
      opponent.position.x +=
        vehicle.vehicleHitAction[directionIndex].x / (this.bouncePower / 6);
    }
  };

  draw = (context: CanvasRenderingContext2D) => {
    this.collisionPoints = this.game.collision.checkCollision(
      this,
      this.collisionPoints,
      context,
      this.position,
      this.size,
      this.collisionDifferenceLimit * (3 / 2) //      this.collisionDifferenceLimit
    );

    this.vehicleHitAction = this.game.collision.refreshBounceAction(this);

    this.refreshPosition();

    context.drawImage(
      this.img!,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  };
}
