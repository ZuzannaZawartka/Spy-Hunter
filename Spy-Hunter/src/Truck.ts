import { truck } from "./config";
import Game from "./Game";
import Vehicle from "./Vehicle";

export default class Truck extends Vehicle {
  type: string;
  isReady: boolean;
  afterCar: boolean;
  isWaitingForPlayer: boolean;
  frameX: number;

  constructor(game: Game, number: number) {
    super(40, 80, game);
    this.maxSpeed = 5;
    this.isCivilian = true;
    this.type = "truck";
    this.speed = 4;
    this.frameX = 0; //frame x to spirte
    this.isReady = false; // czy jest gotowy do cofania zeby wyrzucic
    this.isWaitingForPlayer = false;
    this.afterCar = false; // czy car zostal wyrzucony

    this.create();
    this.createVehicle(truck.find((el) => el.id == number)!);
  }

  resetSetOfTruck = () => {
    this.isReady = false;
    this.afterCar = false;
    this.isWaitingForPlayer = false;
  };

  create = () => {
    let startEndPoints = this.game.background.getRoadStartEndPoints(
      this.game.gameHeight - 100
    );
    this.position = {
      x: startEndPoints.startPoint!,

      y: this.game.gameHeight,
    };
  };

  createOnTop = () => {
    let startEndPoints = this.game.background.getRoadStartEndPoints(
      this.game.gameHeight - 100
    );
    this.position = {
      x: startEndPoints.startPoint!,

      y: -50,
    };
  };

  refreshPosition = () => {
    if (!this.game.isRecovery) {
      if (this.position.y < this.game.gameHeight - 300) {
        if (
          this.game.player.moves.has("UP") ||
          this.game.player.speed >= this.game.player.maxSpeed / 1.5
        ) {
          this.speed -= 0.15;
        } else if (
          this.game.player.moves.has("DOWN") ||
          this.game.player.speed <= this.game.player.maxSpeed / 2
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

      // if (this.isWaitingForPlayer) {
      //   if (
      //     this.game.player.position.x + this.game.player.size.x / 2 >
      //       this.position.x -
      //         this.game.collision.collisionDifferenceLimit * 3 &&
      //     this.game.player.position.x + this.game.player.size.x / 2 <
      //       this.position.x +
      //         this.size.x +
      //         this.game.collision.collisionDifferenceLimit * 3 &&
      //     this.position.y + this.size.y - this.game.player.position.y > 0 &&
      //     this.position.y + this.size.y - this.game.player.position.y <
      //       this.game.collision.collisionDifferenceLimit * 100
      //   )
      //   {
      //     console.log("WJAZD KURWAAA");
      //     this.game.player.isActive = false;
      //     this.game.player.isCollisionTurnOn = false;
      //     //this.game.isRecovery = true;
      //     if (this.game.player.position.y < this.position.y - 20) {
      //       this.game.player.position.y++;
      //     }
      //   }
      // }
    } else {
      this.recoveryMode();
    }
  };

  recoveryMode = () => {
    this.game.player.beforeMove = true;
    //animation of the truck
    let startEndPoints = this.game.background.getRoadStartEndPoints(
      this.game.gameHeight - 100
    );
    if (
      this.position.y >= this.game.gameHeight - 8 * this.game.playerHeight &&
      !this.isReady
    ) {
      this.position.y -= this.speed;
    }

    if (this.position.y < this.game.gameHeight - 6 * this.game.playerHeight) {
      this.isReady = true;
    }

    if (this.isReady) {
      if (
        this.position.y <
        this.game.minPlayerArea -
          (this.game.player.speed / this.game.player.maxSpeed) *
            this.game.maxPlayerArea +
          -this.game.player.size.y -
          this.size.y
      ) {
        this.position.y += this.speed;
      } else if (!this.afterCar) {
        this.throwCarAway();
      } else if (this.afterCar) {
        this.game.player.getOutFromTruck();
        setTimeout(() => {
          this.resetSetOfTruck();
        }, 4000);
      }
    }

    if (this.position.x <= startEndPoints.endPoint! - (3 / 2) * this.size.x) {
      this.position.x += this.speed;
    }
  };

  throwCarAway = () => {
    this.game.vehicles.addPlayerOnPosition({
      x: this.position.x + this.size.x / 3,
      y: this.position.y + this.size.y / 2,
    });
    this.afterCar = true;
  };

  draw = (context: CanvasRenderingContext2D) => {
    if (this.game.player.isAlive && !this.game.player.beforeMove)
      this.collisionPoints = this.game.collision.checkCollision(
        this,
        this.collisionPoints,
        context,
        this.position,
        this.size,
        this.collisionDifferenceLimit //      this.collisionDifferenceLimit
      );

    this.vehicleHitAction = this.game.collision.refreshBounceAction(this);

    this.refreshPosition();

    if (this.game.gameFrame % this.game.staggerFrames == 0) {
      if (this.frameX < 1)
        this.frameX++; // to 1 because we have 2 images to display
      else this.frameX = 0;
    }
    console.log(this.frameX);

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
