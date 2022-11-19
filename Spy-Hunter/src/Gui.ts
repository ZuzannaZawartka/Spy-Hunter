import Game from "./Game";

export default class Gui {
  game: Game;
  menu: HTMLElement | null;
  constructor(game: Game) {
    this.game = game;
    this.menu = document.getElementById("menu");
    this.init();
  }

  init = () => {
    document.getElementById("root-container")!.style.width =
      this.game.gameWidth * 1.5 + "px";

    document.getElementById("root-container")!.style.height =
      this.game.gameWidth * 1.15 + "px";
  };

  refreshGui = () => {
    document.getElementById(
      "timer"
    )!.innerHTML = `<h1>${this.game.timeNoDeath}</h1>`;

    document.getElementById(
      "points"
    )!.innerHTML = `<h1>${this.game.points}</h1>`;
  };

  hideMenu = () => {
    document.getElementById("menu")!.style.display = "none";
    this.game.init();
  };

  showMenu = () => {
    console.log("SHOW MENU");
    document.getElementById("menu")!.style.display = "block";
    document.getElementById("menu")!.style.zIndex = "5";
  };
}
