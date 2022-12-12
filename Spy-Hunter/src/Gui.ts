import { enemies } from "./config";
import Game from "./Game";

export default class Gui {
  game: Game;
  menu: HTMLElement | null;
  lifeContainer: string;
  constructor(game: Game) {
    this.game = game;
    this.menu = document.getElementById("menu");
    this.lifeContainer = "life-container";
    this.init();
  }

  init = () => {
    document.getElementById("root-container")!.style.width =
      this.game.gameWidth * 1.5 + "px";

    document.getElementById("root-container")!.style.height =
      this.game.gameWidth * 1.15 + "px";
  };

  refreshLife = (amount: number) => {
    document.getElementById(this.lifeContainer)!.innerHTML = "";
    if (amount >= 3) {
      amount = 3;
      this.game.player.life = 3;
    }
    for (let i = 0; i < amount; i++) {
      let life = document.createElement("img");
      let config = enemies.find((element) => element.id == 1)!;
      life.src = config.imgSrc;
      life.width = config.width;
      life.height = config.height;
      document.getElementById(this.lifeContainer)?.appendChild(life);
    }
  };

  refreshGui = () => {
    document.getElementById(
      "timer"
    )!.innerHTML = `<h1>${this.game.timeNoDeath}</h1>`;

    document.getElementById(
      "points"
    )!.innerHTML = `<h1>${this.game.points}</h1>`;

    if (this.game.isBlockedCountingPoints) {
      document.getElementById(
        "timer"
      )!.innerHTML = `<h1 style="color:rgb(200, 109, 57);  transform: scale(1.1, 0.6);font-size:40px">NO POINTS</h1>`;
      document.getElementById("points")!.innerHTML = ``;
    }
  };

  hideMenu = () => {
    document.getElementById("menu")!.style.display = "none";
    this.game.init();
  };

  showMenu = () => {
    document.getElementById("menu")!.style.display = "block";
    document.getElementById("menu")!.style.zIndex = "5";
  };
}
