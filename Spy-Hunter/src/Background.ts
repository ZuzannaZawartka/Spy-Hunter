import { coords, color } from "./interfaces";
import paths from "../json/path.json";
import Game from "./Game";
import { collisionColors } from "./config";
export default class Background {
  game: Game;
  position: coords;
  image: CanvasImageSource;
  scale: number;
  background:
    | {
        level: number;
        image: string;
        directionLeft: number;
        directionRight: number;
        collisionColors: never[];
        roadsideColors: never[];
        width: number;
        height: number;
      }
    | undefined;

  constructor(game: Game) {
    this.game = game;
    this.background = undefined;
    this.position = { x: 0, y: 0 };
    this.scale = 0;

    this.image = document.getElementById(
      "backgroundImage"
    ) as CanvasImageSource;

    this.init();
  }

  init = () => {
    this.refreshBackgroundData();
  };

  checkPixelStrike = (pointsArray: Uint8ClampedArray[], color: color) => {
    let counter = 0;

    pointsArray.forEach((point) => {
      if (
        point[0] == color.RED &&
        point[1] == color.GREEN &&
        point[2] == color.BLUE
      )
        counter++;
    });

    return counter;
  };

  getRoadStartEndPoints = (cordY: number) => {
    let startPoint = undefined;
    let endPoint = undefined;
    let pointsArray = [];
    let color = collisionColors.find((color) => color.ground == "road");
    for (let pixel = 0; pixel < this.game.gameWidth; pixel++) {
      let data = this.game.context.getImageData(pixel, cordY, 3, 1).data;

      pointsArray.push(data);

      if (pointsArray.length >= 3 * this.game.player.maxVibrations) {
        if (
          this.checkPixelStrike(pointsArray, color!) >=
            2 * this.game.player.maxVibrations &&
          startPoint == undefined &&
          this.game.player.position.x - pixel <
            this.game.player.playerEnvironment
        ) {
          startPoint = pixel;
          pointsArray = [];
        } else if (startPoint != undefined) {
          if (
            this.checkPixelStrike(pointsArray, color!) <
              2 * this.game.player.maxVibrations &&
            endPoint == undefined
          ) {
            endPoint = pixel;
          }
        }
        pointsArray = [];
      }
    }
    console.log(startPoint, endPoint);
    return { startPoint, endPoint };
  };

  refreshBackgroundData = () => {
    this.background = paths.find((e) => e.level == this.game.level);
    this.scale = this.game.gameWidth / this.background!.width;
    this.background!.width *= this.scale;
    this.background!.height *= this.scale;
    this.position = {
      x: 0,
      y: -this.background!.height + this.game.gameHeight,
    };
  };

  draw = (context: CanvasRenderingContext2D) => {
    context.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.background!.width,
      this.background!.height
    );
  };

  setNewBackground = () => {
    document.getElementById("backgroundImage")!.src =
      "./graphics/" + this.background?.image;
  };

  checkDirection = () => {
    if (this.game.player.position.x < this.background!.width / 2) {
      this.game.level = this.background!.directionLeft;
    } else {
      this.game.level = this.background!.directionRight;
    }
    this.refreshBackgroundData();
    this.setNewBackground();
  };

  update = () => {
    this.position.y += this.game.player.speed;
    if (this.position.y >= 0) {
      this.checkDirection();
    }
  };
}
