import Game from "./Game";
import { coords } from "./interfaces";
import Obstacle from "./Obstacle";

export default class Obstacles {
  game: Game;
  obstacles: Obstacle[];
  position: number;

  constructor(game: Game) {
    this.game = game;
    this.obstacles = [];
    this.position = 0;
  }

  generatePuddle = (size: coords) => {
    let roadsPoints = this.game.background.getRoadStartEndPoints(this.position);
    if (roadsPoints) {
      this.obstacles.push(
        new Obstacle(
          this.game,
          {
            x: Math.floor(
              Math.random() *
                (roadsPoints.endPoint! - size.x - roadsPoints.startPoint! + 1) +
                roadsPoints.startPoint!
            ),
            y: this.position - 100,
          },
          { x: size.x, y: size.y },
          "./graphics/puddle.png"
        )
      );
      console.log(this.obstacles);
    }
  };

  draw = () => {};

  update = () => {
    this.obstacles.forEach((element) => {
      if (element.position.y > 1000)
        this.obstacles = this.obstacles.filter((el) => el != element);
      else {
        element.draw();
        element.update();
      }
    });
  };
}
