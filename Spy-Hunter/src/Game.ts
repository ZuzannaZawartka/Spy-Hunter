import Background from "./Background";
import Control from "./Control";
import Obstacles from "./Obstacles";
import Player from "./Player";

export default class Game {
  public canvas: HTMLCanvasElement | null;
  public context: CanvasRenderingContext2D;
  public gameWidth: number;
  public gameHeight: number;
  public playerWidth: number;
  public playerHeight: number;
  public maxPlayerArea: number;
  public minPlayerArea: number;

  public isGameplay: boolean; //czy byl death czy nie jesli tak to zatrzymanie
  public pause: boolean; //pauza
  public points: number;
  public level: number;
  public distance: number;
  public pointsForGround: number;
  public pointsForWater: number;

  public background: Background;
  public player: Player;
  public control: Control;
  public obstacles: Obstacles;

  constructor(
    gameWidth: number,
    gameHeight: number,
    playerWidth: number,
    playerHeight: number
  ) {
    this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
    this.context = this.canvas.getContext("2d")!;
    this.canvas.width = gameWidth;
    this.canvas.height = gameHeight;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.playerHeight = playerHeight;
    this.playerWidth = playerWidth;
    this.maxPlayerArea = this.gameHeight / 2 - this.playerHeight;
    this.minPlayerArea = this.gameHeight - 2 * this.playerHeight;
    this.pointsForGround = 15;
    this.pointsForWater = 25;

    this.points = 0;
    this.distance = 0;
    this.level = 0;
    this.pause = false;
    this.isGameplay = true;

    this.background = new Background(this);
    this.player = new Player(this.playerWidth, this.playerHeight, this);
    this.control = new Control(this);
    this.obstacles = new Obstacles(this);
    this.init();
  }

  init = () => {
    document.getElementById("container")!.style.width = this.gameWidth + "px";
    document.getElementById("container")!.style.height = this.gameHeight + "px";
    this.animate();
  };

  addPoints = () => {
    if (this.distance >= this.gameHeight / 4) {
      let ground = this.player.checkTypeOfGroundUnderPlayer()?.ground;
      if (ground == "road" || ground == "roadside")
        this.points += this.pointsForGround;
      else if (ground == "water1" || ground == "water2")
        this.points += this.pointsForWater;
      this.distance = 0;

      if ((this.points % 100) * this.points == 0)
        this.obstacles.generatePuddle({ x: 100, y: 60 });
    }
  };

  animate = () => {
    this.context?.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    this.background.draw(this.context);
    this.background.update();

    this.obstacles.update();

    this.player.draw(this.context!);
    this.player.update();
    if (this.isGameplay) requestAnimationFrame(this.animate);

    // this.x.draw();
    // this.x.update();
    // console.log(this.x);
    // console.log(this.player.position);
  };
}
