import { keymap, keymapAction } from "./config";
import Game from "./Game";

export default class Control {
  result: String | undefined;
  game: Game;

  constructor(game: Game) {
    this.game = game;
    this.handleEvents();
  }

  findKey = (event: KeyboardEvent) => {
    let action = undefined;
    keymap.forEach((key) => {
      if (key.keys.includes(event.key)) {
        action = key.action;
      }
    });
    return action;
  };

  findAction = (event: KeyboardEvent) => {
    let action = undefined;
    keymapAction.forEach((key) => {
      if (key.keys.includes(event.key)) {
        action = key.action;
      }
    });
    return action;
  };

  handleEvents = () => {
    //if buttons are pressed
    window.addEventListener("keydown", (event) => {
      let move: string | undefined = this.findKey(event); //player movement
      let action: string | undefined = this.findAction(event); //pause and start game
      if (
        move != undefined &&
        this.game.isGameplay &&
        this.game.player.isActive
      ) {
        //if game was started
        this.game.player.addMove(move);
      } else if (action != undefined) {
        if (action == "START" && this.game.isGameplay == false)
          this.game.start();
        if (action == "PAUSE") this.game.pause();
      }
    });

    //if buttons are released
    window.addEventListener("keyup", (event) => {
      let move: string | undefined = this.findKey(event);
      move != undefined
        ? this.game.player.removeMove(move)
        : console.log("NIE MA RUCHU");
    });
  };
}
