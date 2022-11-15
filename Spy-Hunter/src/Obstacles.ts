import Game from "./Game";
import Obstacle from "./Obstacle";

export default class Obstacles {
  game: Game;
  obstacles: Obstacle[];

  constructor(game: Game) {
    this.game = game;
    this.obstacles = [];
  }

  getCoordsOnRoad = () => {
    let x = Math.floor(Math.random() * this.game.gameWidth);
    let y = this.game.player.position.y - 1000;
    let data = this.game.context.getImageData(x, y, 2, 2).data;
    do {
      x = Math.floor(Math.random() * this.game.gameWidth);
      y = this.game.player.position.y - 1000;
      data = this.game.context.getImageData(x, y, 2, 2).data;
    } while (data[0] != 116 && data[1] != 116 && data[2] != 116);
  };

  generatePuddle = () => {
    // this.getCoordsOnRoad();

    this.obstacles.push(
      new Obstacle(
        this.game,
        {
          x: this.game.player.position.x,
          y: this.game.player.position.y - 1000,
        },
        { x: 100, y: 60 },
        "./graphics/puddle.png"
      )
    );
  };

  draw = () => {};

  update = () => {
    this.obstacles.forEach((element) => {
      element.draw();
      element.update();
    });
  };
}
