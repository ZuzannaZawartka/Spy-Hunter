import { coords } from "./interfaces";
import paths from "../json/path.json";
import Game from "./Game";
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

  refreshBackgroundData = () => {
    this.background = paths.find((e) => e.level == this.game.level);
    console.log("ODSWIEZENIE BAC KGROUNDU NA LVL" + this.game.level);
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

    console.log(this.background?.image);
  };

  checkDirection = () => {
    console.log(this.position.x);
    if (this.game.player.position.x < this.background!.width / 2) {
      this.game.level = this.background!.directionLeft;
    } else {
      this.game.level = this.background!.directionRight;
    }

    this.refreshBackgroundData();
    this.setNewBackground();
    console.log("LEVEL " + this.game.level);
    console.log(this.background);

    //  if(this.position.x < this.background!.width/2)
  };

  update = () => {
    this.position.y += this.game.player.speed;
    if (this.position.y >= 0) {
      this.checkDirection();

      console.log("LEVBE; " + this.game.level);
      console.log("GRATUL;ACJE NOWY LVL");
    }

    console.log("LEVBE; " + this.game.level);
    // this.image = document.getElementById("backgroundImage") ;
  };
}
