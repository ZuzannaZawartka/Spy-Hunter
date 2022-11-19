import Game from "./Game";

export default class Gui {
  game: Game;
  constructor(game: Game) {
    this.game = game;
  }

  hideMenu = () => {
    document.getElementById("menu")!.style.display = "none";
  };
}
