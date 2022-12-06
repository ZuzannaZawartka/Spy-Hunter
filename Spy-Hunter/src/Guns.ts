import Game from "./Game";
import { guns } from "./config";

export default class Guns {
  game: Game;
  gunsContainer: string;

  constructor(game: Game) {
    this.game = game;
    this.gunsContainer = "guns-container";
    this.addGun(guns.find((element) => element.id == 0)!.type);
  }

  addGun = (type: string) => {
    let gun = document.createElement("img");
    let config = guns.find((element) => element.type == type)!;
    gun.src = config.imgSrc;
    gun.width = config.width;
    gun.height = config.height;
    document.getElementById(this.gunsContainer)?.appendChild(gun);
  };
}
