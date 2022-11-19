import Background from "./Background";
import Collision from "./Collision";
import Control from "./Control";
import Gui from "./Gui";
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
  public isPause: boolean; //pauza
  public points: number;
  public level: number;
  public distance: number;
  public pointsForGround: number;
  public pointsForWater: number;

  public background: Background;
  public player: Player;
  public control: Control;
  public obstacles: Obstacles;
  public collision: Collision;
  public gui: Gui;
  public animation: number | undefined;

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
    this.isPause = false;
    this.isGameplay = false;
    this.animation = undefined;

    this.background = new Background(this);
    this.player = new Player(this.playerWidth, this.playerHeight, this);
    this.control = new Control(this);
    this.collision = new Collision(this);
    this.obstacles = new Obstacles(this);
    this.gui = new Gui(this);
    this.init();
  }

  init = () => {
    document.getElementById("container")!.style.width = this.gameWidth + "px";
    document.getElementById("container")!.style.height = this.gameHeight + "px";
    // this.animate();
  };

  start = () => {
    console.log("stat");
    this.isGameplay = true;
    this.gui.hideMenu();
    this.animate();
  };

  pause = () => {
    this.isPause = !this.isPause;
    console.log("PAUZA");
    if (!this.isPause) this.animate();
    else cancelAnimationFrame(this.animation!);
  };

  addPoints = () => {
    if (this.distance >= this.gameHeight / 4) {
      let ground = this.player.checkTypeOfGroundUnderPlayer()?.ground;
      if (ground == "road" || ground == "roadside")
        this.points += this.pointsForGround;
      else if (ground == "water1" || ground == "water2")
        this.points += this.pointsForWater;
      this.distance = 0;

      if ((this.points % 10) * this.points == 0)
        this.obstacles.generatePuddle();
    }
  };

  animate = () => {
    this.context?.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    this.background.draw(this.context);
    this.background.update();

    this.obstacles.update(); //paddles,grenade etc.

    this.player.draw(this.context!);
    this.player.update();
    if (this.isGameplay) {
      this.animation = requestAnimationFrame(this.animate);
    }
  };
}
