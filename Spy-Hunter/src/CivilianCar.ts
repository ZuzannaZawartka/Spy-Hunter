import Game from "./Game";
import Vehicle from "./Vehicle";

export default class CivilianCar extends Vehicle {
  constructor(game: Game) {
    super(40, 80, game);
    this.maxSpeed = 40;
    this.isCivilian = true;
    this.create();
  }

  create = () => {
    this.createPlayer();
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
}
