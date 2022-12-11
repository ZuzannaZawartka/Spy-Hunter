import { fires, vehicles } from "./config";
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
  type: undefined | string;
  isCollison: boolean;
  isEnemy: boolean | undefined;
  isAttacking: boolean | undefined;
  lastTouch: undefined | string;
  timeToRemberLastTouch: number;
  currentTime: number;
  isDeath: boolean;
  frameX: number;

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
    this.collisionDifferenceLimit = 10;
    this.isCivilian = false;
    this.type = undefined;
    this.isCollison = true;
    this.isAttacking = false;
    this.lastTouch = undefined;
    this.timeToRemberLastTouch = 70;
    this.currentTime = 0;
    this.isDeath = false;
    this.frameX = 0;
  }

  createPlayer = () => {
    let number = Math.floor(Math.random() * vehicles.length);
    let vehicle = vehicles.find((vehicle) => vehicle.id == number);
    this.createVehicle(vehicle!);
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
    this.type = vehicle.type;
    this.isCollison = vehicle!.collision;
    this.isEnemy = vehicle!.isEnemy;
  };

  death = () => {
    //animacje dorobimy ze tak buch robi
    this.isActive = false;
    // this.game.vehicles.vehicles = this.game.vehicles.vehicles.filter(
    //   (vehicle) => vehicle != this
    // );

    if (this.lastTouch != undefined) {
      if (this.isCivilian && !this.isEnemy) this.game.player.killedCivile();
    }

    this.setFire(1);
  };

  deleteFromScreen = () => {
    this.game.vehicles.vehicles = this.game.vehicles.vehicles.filter(
      (vehicle) => vehicle != this
    );
  };

  setFire = (number: number) => {
    let fire = fires.find((elem) => elem.id == number)!;
    this.img!.src = fire.imgSrc;
    this.size.x = fire.width;
    this.size.y = fire.height;
    if (!this.isDeath) this.game.sound.death();
    this.isDeath = true;
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

  setLastTouchAsAPlayer = () => {
    this.currentTime = this.game.gameFrame;
    this.lastTouch = "player";
  };

  checkTimeForLastTouch = () => {
    if (this.game.gameFrame - this.currentTime >= this.timeToRemberLastTouch) {
      this.lastTouch = undefined;
    }
  };

  skid = (element: Obstacle) => {
    let posX = Math.floor(
      Math.random() * (this.speed / 5 + this.maxVibrations / 2) +
        this.maxVibrations / 2
    );
    this.isActive = false;
    for (let i = 0; i < this.speed / 3; i++) {
      setTimeout(() => {
        if (element.sign < 0) this.position.x += posX / (this.speed / 3);
        else this.position.x -= posX / this.speed;
      }, 10);
    }
    this.isActive = true;
  };

  refreshPosition = () => {
    if (!this.isDeath) {
      if (this.position.y < this.game.gameHeight - 300) {
        if (
          this.game.player.moves.has("UP") ||
          this.game.player.speed >= this.game.player.maxSpeed
        ) {
          this.speed -= 0.25;
        } else if (
          this.game.player.moves.has("DOWN") ||
          this.game.player.speed <= this.game.player.maxSpeed / 4
        ) {
          this.speed += 0.25;
        }
      } else {
        if (this.game.player.speed >= this.game.player.maxSpeed) {
          this.speed -= 0.2;
        } else {
          this.speed += 0.4;
        }
      }
      this.position.y -= this.speed / 2;
      this.position.x -= this.game.collision.checkIsColorCollison(
        this.collisionPoints,
        this.game.context
      );
      if (this.speed >= this.maxSpeed) this.speed = this.maxSpeed;
    }
  };

  moveAfterHit = (
    vehicle: Vehicle,
    opponent: Vehicle,
    direction: { x: number; y: number }
  ) => {
    if (vehicle.isCivilian && !opponent.isCivilian) {
      //vehicle.position.x += vehicle.vehicleHitAction[directionIndex].x;
      if (direction.x > 0) vehicle.position.x -= direction.x;
      else vehicle.position.x += direction.x;

      if (vehicle.isEnemy && vehicle.isAttacking) {
        this.game.player.enemyLives--;
        this.game.player.resetLife();
        if (this.game.player.enemyLives <= 0) {
          this.game.player.death();
        }
      }
      vehicle.setLastTouchAsAPlayer();
    } else if (!vehicle.isCivilian && opponent.isCivilian) {
      opponent.position.x += direction.x;
      if (opponent.isEnemy && opponent.isAttacking) {
        this.game.player.enemyLives--;
        this.game.player.resetLife();
        if (this.game.player.enemyLives <= 0) {
          this.game.player.death();
        }
      }
      vehicle.setLastTouchAsAPlayer();
    } else {
      opponent.position.x += direction.x / 2;
      vehicle.position.x -= direction.x / 2;
    }
  };

  draw = (context: CanvasRenderingContext2D) => {
    if (!this.isDeath) {
      this.collisionPoints = this.game.collision.checkCollision(
        this,
        this.collisionPoints,
        context,
        this.position,
        this.size,
        this.collisionDifferenceLimit //      this.collisionDifferenceLimit
      );
    }

    this.vehicleHitAction = this.game.collision.refreshBounceAction(this);

    this.refreshPosition();

    if (this.game.gameFrame % this.game.staggerFrames == 0 && this.isDeath) {
      if (this.frameX < fires.find((el) => el.id == 1)!.amountOfGraphic - 1)
        this.frameX++; // to 1 because we have 2 images to display
      else this.deleteFromScreen();
    }

    context.drawImage(
      this.img!,
      this.frameX * this.size.x,
      0,
      this.size.x,
      this.size.y,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  };
}
