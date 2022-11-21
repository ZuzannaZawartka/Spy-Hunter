import Background from "./Background";
import Collision from "./Collision";
import Control from "./Control";
import Gui from "./Gui";
import Obstacles from "./Obstacles";
import Player from "./Player";
import BulletController from "./BulletController";
import Vehicles from "./Vehicles";

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
  public timeNoDeath: number;
  private timer: undefined | number;

  public background: Background;
  public player: Player;
  public control: Control;
  public obstacles: Obstacles;
  public collision: Collision;
  public gui: Gui;
  public vehicles: Vehicles;
  public bulletController: BulletController;
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
    this.timeNoDeath = 1000;
    this.timer = undefined;

    this.background = new Background(this);
    this.player = new Player(40, 80, this);
    this.control = new Control(this);
    this.collision = new Collision(this);
    this.gui = new Gui(this);

    this.bulletController = new BulletController(this);
    this.obstacles = new Obstacles(this);
    this.vehicles = new Vehicles(this);

    this.init();
  }

  init = () => {
    document.getElementById("container")!.style.width = this.gameWidth + "px";
    document.getElementById("container")!.style.height = this.gameHeight + "px";
    this.player.reset();
    this.obstacles.reset();
    this.vehicles.reset();
    this.points = 0;
    this.distance = 0;
    this.level = 0;
    this.isPause = false;
    this.timeNoDeath = 1000;
    this.background?.init();
  };

  start = () => {
    this.isGameplay = true;
    this.gui!.hideMenu();
    this.noDeathTimer();
    this.animate();
  };

  stop = () => {
    this.isGameplay = false;
    this.gui.showMenu();
    clearInterval(this.timer);
    this.init();
  };

  pause = () => {
    this.isPause = !this.isPause;
    if (!this.isPause) {
      this.animate();
      if (this.timeNoDeath > 0) this.noDeathTimer();
    } else {
      cancelAnimationFrame(this.animation!);
      if (this.timeNoDeath > 0) clearInterval(this.timer);
    }
  };

  noDeathTimer = () => {
    this.timer = setInterval(() => {
      this.timeNoDeath--;
      if (this.timeNoDeath <= 0) {
        clearInterval(this.timer);
        this.timeNoDeath = 0;
      }
    }, 100);
  };

  addPoints = () => {
    if (this.distance >= this.gameHeight / 4) {
      let ground = this.player.checkTypeOfGroundUnderPlayer()?.ground;
      if (ground == "road" || ground == "roadside")
        this.points += this.pointsForGround;
      else if (ground == "water1" || ground == "water2")
        this.points += this.pointsForWater;
      this.distance = 0;

      if ((this.points % 20) * this.points == 0) {
        this.obstacles.generatePuddle();
      }

      if ((this.points % 100) * this.points == 0) {
        this.vehicles.createCivilian();
      }
    }
  };

  animate = () => {
    // console.log(this.player.position);
    this.context?.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    this.background.draw(this.context);
    this.background.update();

    this.obstacles.update(); //paddles,grenade etc.

    this.player.draw(this.context);
    this.player.update();

    this.bulletController.draw(this.context);

    this.vehicles.draw(this.context);

    this.gui.refreshGui();
    if (this.isGameplay) {
      this.animation = requestAnimationFrame(this.animate);
    }
  };
}
