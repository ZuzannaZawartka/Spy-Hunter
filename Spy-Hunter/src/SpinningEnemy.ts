import { enemies, fires } from "./config";
import Game from "./Game";
import Vehicle from "./Vehicle";

export default class SpinningEnemy extends Vehicle {
  frameX: number;
  isDriveAway: boolean;
  currentTime: number;
  isAbleToSetCenter: boolean;
  isStartedCountingTimeToDrive: boolean;
  timeToDrive: number;
  isAttacking: boolean;
  isWating: boolean;
  constructor(game: Game) {
    super(40, 80, game);
    this.frameX = 0;
    this.isDriveAway = false;
    this.isAbleToSetCenter = false;
    this.isStartedCountingTimeToDrive = false;
    this.currentTime = 0;
    this.timeToDrive = 200;
    this.isAttacking = false;
    this.isWating = false;
    this.create();
    this.createVehicle(enemies.find((el) => el.id == 0)!);
  }

  create = () => {
    let startEndPoints = this.game.background.getRoadStartEndPoints(
      this.game.gameHeight - 100
    );
    this.position = {
      x: Math.floor(
        Math.random() *
          (startEndPoints.endPoint! -
            this.size.x -
            startEndPoints.startPoint! +
            1) +
          startEndPoints.startPoint!
      ),
      y: this.game.gameHeight + this.game.player.environment,
    };
  };

  resetTimer = () => {
    this.isStartedCountingTimeToDrive = false;
    this.currentTime = 0;
    this.isAttacking = false;
    this.isWating = false;
    // this.isDriveAway = false
  };

  setTimerToSetCenter = () => {
    if (!this.isStartedCountingTimeToDrive) {
      this.isStartedCountingTimeToDrive = true;
      this.currentTime = this.game.gameFrame;
    }

    console.log(this.game.gameFrame - this.currentTime);
    if (this.game.gameFrame - this.currentTime >= this.timeToDrive) {
      this.isDriveAway = true;
      this.frameX = 0;
      // set img without bomb
    }

    if (this.game.gameFrame - this.currentTime >= this.timeToDrive / 5) {
      this.isAbleToSetCenter = true;
      this.frameX = 0;
      // set img without bomb
    }
  };

  refreshPosition = () => {
    if (!this.isDeath) {
      if (!this.game.isRecovery) {
        if (!this.isDriveAway) {
          if (this.position.y > 3.5 * this.game.player.size.y) {
            // jezeli enemy jest na koncu to przyspiesza
            if (
              this.position.y >
              this.game.player.position.y + this.game.player.size.y
            ) {
              // jesli enemy jest z tylu za playerem
              this.position.y -= this.speed;
              if (
                Math.abs(
                  this.position.y + this.size.y - this.game.player.position.y
                ) <=
                2 * this.game.player.size.y
              ) {
                this.position.y -= this.speed;
              }
            } else if (
              this.position.y + this.size.y <
              this.game.player.position.y
            ) {
              //jesli enemy jest z przodu
              if (
                Math.abs(
                  this.position.y + this.size.y - this.game.player.position.y
                ) <= this.game.player.size.y
              ) {
                this.position.y += this.speed / 2;
              } else if (
                this.game.player.speed <
                this.game.player.maxSpeed / 3
              ) {
                this.position.y -= this.speed;
              }
            } else if (this.isAbleToSetCenter) {
              if (this.position.y >= this.game.player.position.y) {
                this.position.y -= this.speed;
                this.isAbleToSetCenter = false;
              }
            } else {
              this.setTimerToSetCenter();
              this.attack();
            }
            if (this.speed >= this.maxSpeed) this.speed = this.maxSpeed;
          } else {
            this.resetTimer();
            this.position.y -= this.speed;
          }
        } else {
          this.resetTimer();

          this.position.y -= this.speed;
        }
      } else {
        this.resetTimer();

        this.position.y -= this.speed;
      }

      this.position.x -= this.game.collision.checkIsColorCollison(
        this.collisionPoints,
        this.game.context
      );
    }
  };

  attack = () => {
    // this.isWating = true;
    if (
      Math.abs(
        this.position.x +
          this.size.x / 2 -
          (this.game.player.position.x + this.game.player.size.x / 2)
      ) <
        2.5 * this.game.player.size.x &&
      Math.abs(
        this.position.x +
          this.size.x / 2 -
          (this.game.player.position.x + this.game.player.size.x / 2)
      ) > 0
    ) {
      this.setTimerToSetCenter();
      let sign = Math.sign(
        this.game.player.position.x +
          this.game.player.size.x / 2 -
          (this.position.x + this.size.x / 2)
      );

      console.log("JESTESMY NIE DALECKO");
      console.log(sign * 4);

      this.position.x += sign * 6;

      if (
        Math.abs(this.position.y - this.game.player.position.y) <
        this.game.player.size.y
      ) {
        //this.isStartedCountingTimeToDrive = false;
        this.isAttacking = true;
      }
    } else {
      this.isAttacking = false;
    }
  };

  draw = (context: CanvasRenderingContext2D) => {
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
    if (
      ((2 * this.game.gameFrame) % this.game.staggerFrames == 0 &&
        this.isAttacking) ||
      ((2 * this.game.gameFrame) % this.game.staggerFrames == 0 &&
        this.isWating &&
        !this.isDeath)
    ) {
      if (this.frameX < 2)
        this.frameX++; // to 1 because we have 2 images to display
      else this.frameX = 1;
    } else if (!this.isAttacking && !this.isWating && !this.isDeath) {
      this.frameX = 0;
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
