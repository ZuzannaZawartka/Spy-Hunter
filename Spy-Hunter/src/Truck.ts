import { truck } from "./config";
import Game from "./Game";
import Vehicle from "./Vehicle";

export default class Truck extends Vehicle {
  type: string;
  isReady: boolean;
  afterCar: boolean;
  constructor(game: Game, number: number) {
    super(40, 80, game);
    this.maxSpeed = 40;
    this.isCivilian = true;
    this.type = "truck";
    this.speed = 4;
    this.isReady = false; // czy jest gotowy do cofania zeby wyrzucic
    this.afterCar = false; // czy car zostal wyrzucony
    this.create();
    this.createVehicle(truck.find((el) => el.id == number)!);
  }

  resetSetOfTruck = () => {
    this.isReady = false;
    this.afterCar = false;
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
      console.log("NORMALNA JAZDA");

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
      this.position.y -= this.speed / this.maxSpeed;
      this.position.x -= this.game.collision.checkIsColorCollison(
        this.collisionPoints,
        this.game.context
      );
      if (this.speed >= this.maxSpeed) this.speed = this.maxSpeed;
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

    context.drawImage(
      this.img!,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  };
}
