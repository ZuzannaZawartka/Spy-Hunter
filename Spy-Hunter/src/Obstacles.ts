import Game from "./Game";
import Obstacle from "./Obstacle";
import { obstacles } from "./config";
import { coords } from "./interfaces";

export default class Obstacles {
  game: Game;
  obstacles: Obstacle[];
  position: number;

  constructor(game: Game) {
    this.game = game;
    this.obstacles = [];
    this.position = 0;
  }

  reset = () => {
    this.obstacles = [];
    this.position = 0;
  };

  generatePuddle = () => {
    let roadsPoints = this.game.background.getRoadStartEndPoints(this.position);
    let paddle = obstacles.find((obstacle) => obstacle.type == "paddle");

    //generate Sign of paddle
    if (roadsPoints && paddle) {
      this.obstacles.push(
        new Obstacle(
          this.game,
          paddle.type,
          {
            x: Math.floor(
              Math.random() *
                (roadsPoints.endPoint! -
                  paddle.width -
                  roadsPoints.startPoint! +
                  1) +
                roadsPoints.startPoint!
            ),
            y: this.position - 100,
          },
          { x: paddle.width, y: paddle.height },
          paddle.imgSrc,
          paddle.afterCollisionImgSrc
        )
      );
    }
  };

  generateGranade = (position: coords) => {
    let granade = obstacles.find((obstacle) => obstacle.type == "granade");

    if (granade) {
      this.obstacles.push(
        new Obstacle(
          this.game,
          granade.type,
          {
            x: position.x,
            y: position.y,
          },
          { x: granade.width, y: granade.height },
          granade.imgSrc,
          granade.afterCollisionImgSrc
        )
      );
    }
  };

  draw = () => {};

  update = () => {
    this.obstacles.forEach((element) => {
      if (element.position.y > this.game.gameHeight)
        this.obstacles = this.obstacles.filter((el) => el != element);
      else {
        element.draw();
        element.update();
      }
    });
  };
}
