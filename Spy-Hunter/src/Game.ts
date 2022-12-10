import Background from "./Background";
import Collision from "./Collision";
import Control from "./Control";
import Gui from "./Gui";
import Obstacles from "./Obstacles";
import Player from "./Player";
import BulletController from "./BulletController";
import Vehicles from "./Vehicles";
import Guns from "./Guns";

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
  public isRecovery: boolean;
  public points: number;
  public level: number;
  public distance: number;
  public pointsForGround: number;
  public pointsForWater: number;
  public timeNoDeath: number;
  private timer: undefined | number;
  public gameFrame: number;

  public background: Background;
  public player: Player;
  public guns: Guns;
  public control: Control;
  public obstacles: Obstacles;
  public collision: Collision;
  public gui: Gui;
  public vehicles: Vehicles;
  public bulletController: BulletController;
  public animation: number | undefined;
  public isBlockedCountingPoints: boolean;
  public recoverySpeed: number;
  public staggerFrames: number;

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
    this.recoverySpeed = 3;
    this.points = 0;
    this.distance = 0;
    this.level = 0;
    this.isPause = false;
    this.isBlockedCountingPoints = false;
    this.isGameplay = false;
    this.isRecovery = false; // truck drive with car
    this.animation = undefined;
    this.timeNoDeath = 1000;
    this.timer = undefined;
    this.gameFrame = 0;
    this.staggerFrames = 20;

    this.background = new Background(this);
    this.player = new Player(40, 80, this);
    this.control = new Control(this);
    this.collision = new Collision(this);
    this.gui = new Gui(this);
    this.guns = new Guns(this);

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
    this.isGameplay = false;
    this.isRecovery = true;
    this.gui!.hideMenu();
    this.animate();
    this.vehicles.createTruck();
  };

  restartGame = () => {
    console.log("RESTART");

    this.isGameplay = false;
    this.isRecovery = true;
    this.vehicles.truckRecovery();
    this.player.position.y = 900;
    console.log(this.vehicles.vehicles);
  };

  startDrive = () => {
    this.isGameplay = true;
    this.isRecovery = false;
    this.player.isActive = true;
    this.player.isAlive = true;
    this.noDeathTimer();
    this.vehicles.createHelicopter();
  };

  recovery = () => {
    this.isGameplay = true; // if gameplay is on and player isActive false background slide
    this.isRecovery = false;
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

      if ((this.points % 1000) * this.points == 0) {
        this.obstacles.generatePuddle();
      }

      if ((this.points % 200) * this.points == 0) {
        this.vehicles.createCivilian();
        this.vehicles.createHelicopter();
        //this.vehicles.createTruckWithLadder();
      }
    }
  };

  animate = () => {
    this.context?.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    this.background.draw(this.context);
    this.background.update();
    this.obstacles.update(); //paddles,grenade etc.
    this.bulletController.draw(this.context);

    this.gui.refreshGui();
    this.vehicles.draw(this.context);
    this.player.update();

    this.gameFrame++;

    if (this.isGameplay || this.isRecovery) {
      this.animation = requestAnimationFrame(this.animate);
    }
  };
}
