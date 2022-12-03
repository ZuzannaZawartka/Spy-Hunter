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

  constructor(width: number, height: number, game: Game) {
    super(width, height, game);

    this.moves = new Set();
    this.speed = 5;
    this.maxSpeed = 35;
    this.maxVibrations = 8;
    this.lastSignVibration = 1;
    this.isActive = true;
    this.acceleration = 0.4;
    this.turnDelay = 50;
    this.bulletSpeed = this.speed + 10;
    this.collisionDifferenceLimit = 15;
    this.isCivilian = false;

    this.resizePLayer();
  }

  reset = () => {
    this.position = {
      x: 300,
      y:
        this.game.minPlayerArea -
        (this.speed / this.maxSpeed) * this.game.maxPlayerArea,
    };
    this.speed = 0;
    this.isActive = true;
  };

  resizePLayer = () => {
    let player = document.getElementById("playerImage");
    player!.style.width = this.size.x + "px";
    player!.style.height = this.size.y + "px";
  };

  death = () => {
    //animacje dorobimy ze tak buch robi
    this.isActive = false;
    this.game.stop();
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

  draw = (context: CanvasRenderingContext2D) => {
    this.collisionPoints = this.game.collision.checkCollision(
      this,
      this.collisionPoints,
      context,
      this.position,
      this.size,
      this.collisionDifferenceLimit
    );

    this.vehicleHitAction = this.game.collision.refreshBounceAction(this);

    context.drawImage(
      document.getElementById("playerImage") as CanvasImageSource,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  };

  update = () => {
    if (this.isActive) {
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
      this.game.distance += this.speed; // distance counting to points

      this.game.addPoints();
    }
  };
}
