import { enemies, fires } from "./config";
import Game from "./Game";
import Vehicle from "./Vehicle";

export default class Player extends Vehicle {
  maxSpeed: number;
  maxVibrations: number;
  acceleration: number;
  turnDelay: number;
  lastSignVibration: number;
  speed: number;
  bulletSpeed: number;
  isActive: boolean;
  moves: Set<String>;
  collisionDifferenceLimit: number;
  beforeMove: boolean;
  isDeath: boolean;
  life: number;
  enemyLives: number;
  afterFire: boolean = false;
  public didYouGetALife: boolean = false;

  constructor(width: number, height: number, game: Game) {
    super(width, height, game);

    this.img = document.getElementById("playerImage") as CanvasImageSource;
    this.moves = new Set();
    this.speed = 5;
    this.maxSpeed = 25;
    this.maxVibrations = 8;
    this.lastSignVibration = 1;
    this.isActive = true; // czy możemy sterować
    this.acceleration = 0.4;
    this.turnDelay = 50;
    this.bulletSpeed = this.speed + 10;
    this.collisionDifferenceLimit = 5;
    this.isCivilian = false;
    this.beforeMove = true; // czy wykonał pierwszy ruch
    this.isDeath = false; // czy umarł
    this.life = 1; // number of live
    this.enemyLives = 30; // attack times
    this.isEnemy = false;
    this.resizePLayer();
  }

  reset = () => {
    this.position = {
      x: 300,
      y: this.game.gameHeight,
    };
    this.speed = 0;
    this.life = 0;
    this.isActive = true;
    this.beforeMove = true;
    this.previousImage();
  };

  resizePLayer = () => {
    let player = document.getElementById("playerImage");
    player!.style.width = this.size.x + "px";
    player!.style.height = this.size.y + "px";
  };

  previousImage = () => {
    let player = enemies.find((el) => el.id == 1)!;
    this.frameX = 0;
    this.img!.src = player!.imgSrc;
    this.size.x = player.width;
    this.size.y = player.height;
    this.isDeath = false;
    this.afterFire = false;
  };

  death = () => {
    if (this.game.player.life <= 2 && !this.didYouGetALife) {
      this.didYouGetALife = true;
      if (this.game.timeNoDeath <= 0) {
        console.log(this.life + "ŻYCIA");
        this.life--;
      }
    }

    this.game.sound.death();
    this.game.gui.refreshLife(this.life);

    setTimeout(() => {
      this.didYouGetALife = false;
    }, 10 * this.game.timeNoDeath);
    this.game.sound.stopMusic("soundtrack");

    this.isActive = false;
    this.isDeath = true;
    this.speed = 0;
    this.setFire(0);
    this.resetLife();
    if (this.game.timeNoDeath <= 0) {
      if (this.life < 0) {
        this.game.stop();
      }
    }
  };

  resetLife = () => {
    let inte = setTimeout(() => {
      this.enemyLives++;
      if (this.enemyLives >= 30) {
        clearInterval(inte);
      }
    }, 500);
  };

  shoot = () => {
    if (this.game.player.moves.has("SHOOT1")) {
      this.game.bulletController.shoot(
        {
          x: this.position.x,
          y: this.position.y - this.size.x,
        },
        {
          x:
            this.position.x +
            this.size.x -
            this.game.bulletController.bulletSize.x,
          y: this.position.y - this.size.x,
        },
        this.bulletSpeed
      );
    }
  };

  addMove(action: string) {
    this.moves.add(action);
  }
  removeMove(action: string) {
    this.moves.delete(action);
  }

  update = () => {
    if (this.beforeMove && this.moves.size > 0) this.beforeMove = false;
    if (this.isActive && !this.game.isRecovery) {
      //horizontal movemnet
      if (this.moves.has("UP") || this.moves.has("DOWN")) {
        this.position.y =
          this.game.minPlayerArea -
          (this.speed / this.maxSpeed) * this.game.maxPlayerArea;
        if (this.moves.has("UP"))
          if (this.speed < this.maxSpeed) this.speed += this.acceleration;
        if (this.moves.has("DOWN"))
          if (this.speed > 0) this.speed -= this.acceleration;
          else this.speed = 0;
      }

      //vertical movement
      let turn =
        ((this.speed / this.maxSpeed) * (this.game.gameWidth / this.size.x)) /
        3.5;

      if (this.moves.has("LEFT") && this.speed > 0 && this.position.x > 0) {
        setTimeout(() => {
          this.position.x -= turn;
        }, this.turnDelay);
      }
      if (
        this.moves.has("RIGHT") &&
        this.speed > 0 &&
        this.position.x < this.game.gameWidth - this.game.playerWidth * 1.5
      ) {
        setTimeout(() => {
          this.position.x += turn;
        }, this.turnDelay);
      }

      if (!this.game.isBlockedCountingPoints) this.game.distance += this.speed; // distance counting to points if player killed civile block earning points
      this.game.addPoints();
    } else if (
      !this.isActive &&
      this.game.isGameplay &&
      !this.game.isPackingCar
    ) {
      if (this.position.y < this.game.gameHeight) {
        this.position.y += this.game.recoverySpeed;
      }
    }
  };

  killedCivile = () => {
    this.game.isBlockedCountingPoints = true;

    setTimeout(() => {
      this.game.isBlockedCountingPoints = false;
    }, 3000);
  };

  addLife = () => {
    this.life++;
    console.log(this.life + "life");
    this.game.gui.refreshLife(this.life);
  };

  getOutFromTruck = () => {
    if (
      this.position.y <=
      this.game.minPlayerArea -
        (this.speed / this.maxSpeed) * this.game.maxPlayerArea
    ) {
      this.position.y++;
    } else {
      this.game.startDrive();
    }
  };

  draw = (context: CanvasRenderingContext2D) => {
    if (!this.beforeMove || !this.game.isRecovery) {
      if (!this.isDeath)
        this.collisionPoints = this.game.collision.checkCollision(
          this,
          this.collisionPoints,
          context,
          this.position,
          this.size,
          this.collisionDifferenceLimit
        );
    }
    this.vehicleHitAction = this.game.collision.refreshBounceAction(this);

    if (this.game.gameFrame % this.game.staggerFrames == 0 && this.isDeath) {
      if (
        this.frameX < fires.find((el) => el.id == 0)!.amountOfGraphic - 1 &&
        !this.afterFire
      )
        this.frameX++; // to 1 because we have 2 images to display
      else {
        this.afterFire = true;
      }
    }

    context.drawImage(
      this.img!,
      this.frameX * this.size.x,
      0,
      this.size.x,
      this.size.y,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  };
}
