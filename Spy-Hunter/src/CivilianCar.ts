import Game from "./Game";
import Vehicle from "./Vehicle";

export default class CivilianCar extends Vehicle {
  constructor(game: Game) {
    super(40, 80, game);
    this.maxSpeed = 20;
    this.create();
  }

  create = () => {
    this.speed = this.game.player.speed;

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
    if (this.position.y < this.game.gameHeight - 100) {
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

    this.position.x += this.game.collision.checkIsColorCollison(
      this.collisionPoints,
      this.game.context
    );
  };

  draw = (context: CanvasRenderingContext2D) => {
    this.collisionPoints = this.game.collision.checkCollision(
      this,
      this.collisionPoints,
      context,
      this.position,
      this.size,
      this.size.y / 2
    );

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
