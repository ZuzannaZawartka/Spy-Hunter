import Game from "./Game";
import Vehicle from "./Vehicle";

export default class CivilianCar extends Vehicle {
  constructor(game: Game) {
    super(40, 80, game);
    this.maxSpeed = 20;
    console.log("HEJ JESTEM CYWILEM");
    this.create();
  }

  create = () => {
    this.speed = this.game.player.speed;

    let startEndPoints = this.game.background.getRoadStartEndPoints(
      this.game.gameHeight - 100
    );

    console.log(startEndPoints);
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

  draw = (context: CanvasRenderingContext2D) => {
    this.collisionPoints = this.game.collision.checkCollision(
      this,
      this.collisionPoints,
      context,
      this.position,
      this.size
    );

    this.position.y -= this.speed / this.maxSpeed;

    if (this.game.player.speed < 10) this.speed++;
    if (Math.abs(this.game.player.speed - this.game.player.maxSpeed) < 7)
      this.speed--;

    context.drawImage(
      this.img!,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  };
}
