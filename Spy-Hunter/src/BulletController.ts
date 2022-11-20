import Bullet from "./Bullet";
import Game from "./Game";
import { coords } from "./interfaces";

export default class BulletController {
  bullets: Bullet[];
  timeTillNextBullet: number;
  game: Game;
  bulletSize: coords;
  bulletDelay: number;

  constructor(game: Game) {
    this.game = game;
    this.bullets = [];
    this.bulletDelay = 6;
    this.timeTillNextBullet = 0;
    this.bulletSize = { x: 5, y: 30 };
  }

  shoot(position: coords, position2: coords, speed: number) {
    if (this.timeTillNextBullet <= 0) {
      let bullet1 = new Bullet(position, speed);
      let bullet2 = new Bullet(position2, speed);
      this.bullets.push(bullet1);
      this.bullets.push(bullet2);
      this.game;
      this.timeTillNextBullet = this.bulletDelay;
    }

    this.timeTillNextBullet--;
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.bullets.length > 0)
      this.bullets.forEach((bullet) => {
        bullet.draw(context);
        if (
          bullet.position.y <
          this.game.player.position.y - 5 * this.game.player.size.y
        )
          this.bullets = this.bullets.filter((el) => el != bullet);
      });

    this.game.player.shoot();
  }
}
