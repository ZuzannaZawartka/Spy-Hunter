import { fires, guns, trucks } from "./config";
import Game from "./Game";
import Vehicle from "./Vehicle";

export default class Truck extends Vehicle {
  isReady: boolean;
  afterCar: boolean;
  isWaitingForPlayer: boolean;
  frameX: number;
  isAwayCar: boolean;
  isUsed: boolean;
  commodity: string | undefined;

  constructor(game: Game, number: number) {
    super(40, 80, game);
    this.frameX = 0; //frame x to spirte
    this.isReady = false; // czy jest gotowy do cofania zeby wyrzucic
    this.isWaitingForPlayer = false;
    this.afterCar = false; // czy car zostal wyrzucony
    this.isAwayCar = false;
    this.isUsed = false;
    this.create();
    this.createVehicle(trucks.find((el) => el.id == number)!);
    this.generateCommodity(number);
  }

  generateCommodity = (number: number) => {
    if (number == 2) {
      this.commodity = guns.find((el) => el.id == 1)!.type;
    } else if (number == 1) {
      this.commodity = "life";
    }
  };

  resetSetOfTruck = () => {
    this.isReady = false;
    this.afterCar = false;
    this.isWaitingForPlayer = false;
    this.game.isPackingCar = false;
    this.isUsed = true;
    this.speed = this.maxSpeed / 3;
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
    if (!this.isDeath) {
      if (!this.isUsed) {
        if (this.game.isRecovery == false && this.game.isPackingCar == false) {
          //if (!this.game.isPackingCar) {
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

          if (this.speed >= this.maxSpeed) this.speed = this.maxSpeed;

          if (this.isWaitingForPlayer) {
            if (
              this.game.player.position.x + this.game.player.size.x / 2 >
                this.position.x -
                  this.game.collision.collisionDifferenceLimit * 3 &&
              this.game.player.position.x + this.game.player.size.x / 2 <
                this.position.x +
                  this.size.x +
                  this.game.collision.collisionDifferenceLimit * 3 &&
              this.position.y + this.size.y - this.game.player.position.y > 0 &&
              this.position.y + this.size.y - this.game.player.position.y <
                this.game.collision.collisionDifferenceLimit * 100
            ) {
              this.game.player.isActive = false;
              this.game.isRecovery = true;
              this.game.isPackingCar = true;
            }
          }
        } else {
          if (!this.game.isPackingCar) this.recoveryMode();
          else {
            this.game.player.position.x -=
              this.game.collision.checkIsColorCollison(
                this.collisionPoints,
                this.game.context
              );
            if (
              this.game.player.position.y >
              this.position.y + this.size.y / 2
            ) {
              if (!this.afterCar) {
                this.game.player.position.y--;
              }

              this.game.player.position.x +=
                this.position.x +
                this.game.player.size.x / 2 -
                this.game.player.position.x;
            } else {
              this.game.player.speed = 0;
              this.game.isRecovery = true;
              this.setTruckOnARoadSide();
            }
          }
          if (
            this.position.y + this.size.y * 1.5 > this.game.player.position.y &&
            this.afterCar &&
            this.game.isPackingCar
          ) {
            this.game.player.position.y++; //wyjazd autka // ewentualne zycia albo achivmenty
            this.game.startDrive();
            this.game.getGift(this.commodity!);
            setTimeout(() => {
              this.resetSetOfTruck();
            }, 2000);
          }
        }
      } else {
        this.position.y -= Math.abs(this.speed);
      }
      this.position.x -= this.game.collision.checkIsColorCollison(
        this.collisionPoints,
        this.game.context
      );
    }
  };

  setTruckOnARoadSide = () => {
    let startEndPoints = this.game.background.getRoadStartEndPoints(
      this.game.gameHeight - 100
    );
    if (this.position.x <= startEndPoints.endPoint! - (3 / 2) * this.size.x) {
      this.position.x += Math.abs(this.speed);
      this.game.player.position.x += Math.abs(this.speed);
      this.isReady = true;
    } else if (this.isReady) {
      if (
        this.position.y <=
        this.game.gameHeight - 5 * this.game.playerHeight
      ) {
        this.position.y += Math.abs(this.speed);
        this.game.player.position.y += Math.abs(this.speed);
      } else {
        this.afterCar = true;
      }
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

    if (!this.isWaitingForPlayer)
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
    if (!this.game.player.isDeath && !this.game.player.beforeMove)
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

    if (this.game.gameFrame % this.game.staggerFrames == 0 && !this.isDeath) {
      if (this.frameX < 1)
        this.frameX++; // to 1 because we have 2 images to display
      else this.frameX = 0;
    } else {
      if (this.game.gameFrame % this.game.staggerFrames == 0 && this.isDeath) {
        if (this.frameX < fires.find((el) => el.id == 1)!.amountOfGraphic - 1)
          this.frameX++; // to 1 because we have 2 images to display
        else this.deleteFromScreen();
      }
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
