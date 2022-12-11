import { helicopter } from "./config";
import Game from "./Game";
import Vehicle from "./Vehicle";

export default class Helicopter extends Vehicle {
  frameY: number;
  frameX: number;
  time: number;
  currentTime: number;
  currentTimeBomb: number;
  isStartedCountingTimeToFlies: boolean;
  isFliesAway: boolean;
  timeToBomb: number;
  isStartedCountingTimeToSetBomb: boolean;

  constructor(game: Game) {
    super(40, 80, game);
    this.speed = 6;
    this.type = "helicopter";
    this.frameY = 0;
    this.frameX = 0;
    this.time = 300;

    this.currentTime = 0;
    this.isStartedCountingTimeToFlies = false;
    this.isFliesAway = false;

    this.currentTimeBomb = 0;
    this.timeToBomb = 200;
    this.isStartedCountingTimeToSetBomb = false;

    this.create();
    this.createVehicle(helicopter.find((el) => el.id == 0)!);
  }

  create = () => {
    this.createPlayer();
    this.position = {
      x: Math.floor(Math.random() * this.game.gameWidth),
      y: this.game.gameHeight,
    };
  };

  resetTimerOfFliesAway = () => {
    this.isStartedCountingTimeToFlies = false;
    this.currentTime = 0;
    this.frameY = 0;
  };

  setTimerToFliesAway = () => {
    if (!this.isStartedCountingTimeToFlies) {
      this.isStartedCountingTimeToFlies = true;
      this.currentTime = this.game.gameFrame;
    }

    if (this.game.gameFrame - this.currentTime >= this.time) {
      this.isFliesAway = true;
      // set img without bomb
    }

    if (this.game.gameFrame - this.currentTimeBomb >= this.timeToBomb) {
      this.game.obstacles.generateGranade(this.position);

      this.setTimerToSetBomb();
    } else if (
      this.game.gameFrame - this.currentTimeBomb >=
      this.timeToBomb / 2
    ) {
      this.frameY = 1;
    }
  };

  setTimerToSetBomb = () => {
    this.isStartedCountingTimeToSetBomb = false;
    this.frameY = 0;
    if (!this.isStartedCountingTimeToSetBomb) {
      this.isStartedCountingTimeToSetBomb = true;
      this.currentTimeBomb = this.game.gameFrame;
    }
  };

  resetTimerToSetBomb = () => {
    this.currentTimeBomb = 0;
  };

  refreshPosition = () => {
    if (!this.game.isRecovery) {
      if (!this.isFliesAway) {
        if (this.position.y > this.game.player.size.y) {
          // if helicopter is under top line but more than size y of one car
          this.position.y -= this.speed / 2;
        } else {
          this.setTimerToFliesAway();
        }

        if (this.position.y < this.game.player.position.y) {
          if (
            Math.abs(
              this.position.x +
                this.size.x / 2 -
                (this.game.player.position.x + this.game.player.size.x / 2)
            ) >
            this.game.player.size.x + this.game.player.size.x / 4
          ) {
            let sign = Math.sign(
              this.game.player.position.x +
                this.game.player.size.x / 2 -
                (this.position.x + this.size.x / 2)
            );

            this.position.x += sign * 4;
            this.setTimerToSetBomb();
          }
        } else {
          if (this.position.x <= this.game.gameWidth / 2) {
            this.position.x++;
          } else {
            this.position.x--;
          }
        }
      } else {
        this.resetTimerOfFliesAway();
        this.position.y -= this.speed / 2;
      }
    } else {
      this.resetTimerOfFliesAway();
      this.position.y -= this.speed / 2;
    }
  };

  draw = (context: CanvasRenderingContext2D) => {
    this.refreshPosition();

    if (this.game.gameFrame % this.game.staggerFrames == 0) {
      if (this.frameX < 3) this.frameX++;
      else this.frameX = 0;
      this.game.sound.helicopter();
    }

    context.drawImage(
      this.img!,
      this.frameX * this.size.x,
      this.frameY * this.size.y,
      this.size.x,
      this.size.y,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  };
}
