import { keymap } from "./config";
import Game from "./Game";

export default class Control {
  result: String | undefined;
  game: Game;

  constructor(game: Game) {
    this.game = game;
    this.handleEvents();
  }

  findAction = (event: KeyboardEvent) => {
    let action = undefined;
    keymap.forEach((key) => {
      if (key.keys.includes(event.key)) {
        action = key.action;
      }
    });
    return action;
  };

  handleEvents = () => {
    //if buttons are pressed
    window.addEventListener("keydown", (event) => {
      let move: string | undefined = this.findAction(event);
      move != undefined
        ? this.game.player.addMove(move)
        : console.log("Brak ruchu");

      console.log(this.game.player.moves);
    });

    //if buttons are released
    window.addEventListener("keyup", (event) => {
      let move: string | undefined = this.findAction(event);
      move != undefined
        ? this.game.player.removeMove(move)
        : console.log("NIE MA RUCHU");
    });
  };
}
