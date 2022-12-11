import Game from "./Game";
import { guns } from "./config";

export default class Guns {
  game: Game;
  gunsContainer: string;
  gunsArray: string[];

  constructor(game: Game) {
    this.game = game;
    this.gunsContainer = "guns-container";
    this.gunsArray = [];
    this.refreshGuns();
  }

  addGun = (type: string) => {
    if (!this.gunsArray.find((el) => el == type)) {
      this.gunsArray.push(type);
      let gun = document.createElement("img");
      let config = guns.find((element) => element.type == type)!;
      gun.src = config.imgSrc;
      gun.width = config.width;
      gun.height = config.height;
      document.getElementById(this.gunsContainer)?.appendChild(gun);
    }
  };

  refreshGuns = () => {
    this.gunsArray = [];
    this.addGun(guns.find((element) => element.id == 0)!.type);
  };
}
