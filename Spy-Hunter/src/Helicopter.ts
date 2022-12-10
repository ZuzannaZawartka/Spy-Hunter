import { helicopter } from "./config";
import Game from "./Game";
import Vehicle from "./Vehicle";

export default class Helicopter extends Vehicle {
  frameY: number;
  frameX: number;
  constructor(game: Game) {
    super(40, 80, game);
    this.speed = 6;
    this.type = "helicopter";
    this.frameY = 0;
    this.frameX = 0;
    this.create();
    this.createVehicle(helicopter.find((el) => el.id == 0)!);
  }

  create = () => {
    this.createPlayer();
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

  refreshPosition = () => {
    // if (!this.game.isRecovery) {
    //   if (this.position.y < this.game.gameHeight - 300) {
    //     if (
    //       this.game.player.moves.has("UP") ||
    //       this.game.player.speed >= this.game.player.maxSpeed / 1.5
    //     ) {
    //       this.speed -= 0.15;
    //     } else if (
    //       this.game.player.moves.has("DOWN") ||
    //       this.game.player.speed <= this.game.player.maxSpeed / 2
    //     ) {
    //       this.speed += 0.25;
    //     }
    //   } else {
    //     if (this.game.player.speed >= this.game.player.maxSpeed) {
    //       this.speed -= 0.2;
    //     } else {
    //       this.speed += 0.4;
    //     }
    //   }
    this.position.y -= this.speed / 2;

    //if (this.speed >= this.maxSpeed) this.speed = this.maxSpeed;
    //  }
  };

  draw = (context: CanvasRenderingContext2D) => {
    this.refreshPosition();

    if (this.game.gameFrame % this.game.staggerFrames == 0) {
      if (this.frameX < 3) this.frameX++;
      else this.frameX = 0;
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
