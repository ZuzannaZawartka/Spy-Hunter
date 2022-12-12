import Background from "./Background";
import Collision from "./Collision";
import Control from "./Control";
import Gui from "./Gui";
import Obstacles from "./Obstacles";
import Player from "./Player";
import BulletController from "./BulletController";
import Vehicles from "./Vehicles";
import Guns from "./Guns";
import SoundManager from "./SoundManager";
import { audio } from "./config";

export default class Game {
  public canvas: HTMLCanvasElement | null;
  public context: CanvasRenderingContext2D;
  public gameWidth: number;
  public gameHeight: number;
  public playerWidth: number;
  public playerHeight: number;
  public maxPlayerArea: number;
  public minPlayerArea: number;

  public isGameplay: boolean = false; //czy byl death czy nie jesli tak to zatrzymanie
  public isPause: boolean = false; //pauza
  public isRecovery: boolean = false;
  public points: number = 0;
  public level: number = 0;
  public distance: number = 0;
  public pointsForGround: number = 15;
  public pointsForWater: number = 25;
  public timeNoDeath: number = 1000;
  private timer: undefined | number = undefined;
  public gameFrame: number = 0;

  public background: Background;
  public player: Player;
  public guns: Guns;
  public control: Control;
  public obstacles: Obstacles;
  public collision: Collision;
  public gui: Gui;
  public vehicles: Vehicles;
  public bulletController: BulletController;
  public animation: number | undefined = undefined;
  public isBlockedCountingPoints: boolean = false;
  public recoverySpeed: number = 3;
  public staggerFrames: number = 20;
  public isPackingCar: boolean = false;
  public sound: SoundManager;
  public didYouGetAGift: boolean = false;

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

    this.background = new Background(this);
    this.player = new Player(40, 80, this);
    this.control = new Control(this);
    this.collision = new Collision(this);
    this.gui = new Gui(this);
    this.guns = new Guns(this);
    this.sound = new SoundManager(
      audio.find((audio) => audio.type == "soundtrack")!.imgSrc
    );

    this.bulletController = new BulletController(this);
    this.obstacles = new Obstacles(this);
    this.vehicles = new Vehicles(this);

    this.init();
  }

  init = () => {
    document.getElementById("container")!.style.width = this.gameWidth + "px";
    document.getElementById("container")!.style.height = this.gameHeight + "px";

    this.player.reset();
    this.guns.refreshGuns();
    this.obstacles.reset();
    this.vehicles.reset();
    this.points = 0;
    this.distance = 0;

    this.level = 0;
    this.isPause = false;
    this.timeNoDeath = 1000;
    this.timer = undefined;
    this.background?.init();
    this.gui.refreshGui();
  };

  start = () => {
    this.isGameplay = false;
    this.isRecovery = true;
    this.gui!.hideMenu();
    this.animate();
    this.vehicles.createTruck();
  };

  restartGame = () => {
    this.isGameplay = false;
    this.isRecovery = true;
    this.isPackingCar = false;
    this.player.isDeath = false;
    this.vehicles.truckRecovery();
  };

  startDrive = () => {
    this.sound.restartMusic("soundtrack");
    this.isGameplay = true;
    this.isRecovery = false;
    //this.isPackingCar = false;
    this.player.isActive = true;
    this.player.isDeath = false;
    if (this.timer == undefined) this.noDeathTimer();
  };

  recovery = () => {
    this.isGameplay = true; // if gameplay is on and player isActive false background slide
    this.isRecovery = false;
  };

  stop = () => {
    clearInterval(this.timer);
    this.sound.stopMusic("soundtrack");
    this.isGameplay = false;
    this.gui.showMenu();
    this.player.previousImage();
    this.init();
  };

  pause = () => {
    this.isPause = !this.isPause;
    if (!this.isPause) {
      this.animate();
      this.sound.restartMusic("soundtrack");
      if (this.timeNoDeath > 0) this.noDeathTimer();
    } else {
      cancelAnimationFrame(this.animation!);
      this.sound.stopMusic("soundtrack");
      if (this.timeNoDeath > 0) clearInterval(this.timer);
    }
  };

  getGift = (type: string) => {
    if (!this.didYouGetAGift) {
      if (type == "life") {
        if (!this.didYouGetAGift) {
          this.player.addLife();
        }
        this.didYouGetAGift = true;
      } else {
        this.guns.addGun(type);
      }
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

      if (!this.isRecovery) {
        if ((this.points % 300) * this.points == 0) {
          this.obstacles.generatePuddle();
          //this.vehicles.createTruckWithLadder();
        }

        if ((this.points % 255) * this.points == 0) {
          this.obstacles.generatePuddle();
          // this.vehicles.createSpinningEnemy();
          //this.vehicles.createCivilian();
          // this.vehicles.createCivilian();
          // this.vehicles.createHelicopter();
          // this.vehicles.createTruckWithLadder();
        }
        if ((this.points % 510) * this.points == 0) {
          // this.obstacles.generatePuddle();
          // this.vehicles.createSpinningEnemy();
          this.vehicles.createCivilian();
          // this.vehicles.createCivilian();
          // this.vehicles.createHelicopter();
          // this.vehicles.createTruckWithLadder();
        }
        if ((this.points % 750) * this.points == 0) {
          // this.obstacles.generatePuddle();
          // this.vehicles.createSpinningEnemy();
          this.vehicles.createCivilian();
          // this.vehicles.createCivilian();
          // this.vehicles.createHelicopter();
          // this.vehicles.createTruckWithLadder();
        }
        if ((this.points % 800) * this.points == 0) {
          //this.vehicles.createCivilian();
          // this.vehicles.createHelicopter();
          this.vehicles.createSpinningEnemy();
          //this.vehicles.createTruckWithLadder();
        }
        if ((this.points % 1500) * this.points == 0) {
          //this.vehicles.createCivilian();
          // this.vehicles.createHelicopter();
          this.vehicles.createHelicopter();
          //this.vehicles.createTruckWithLadder();
        }
      }
    }
  };

  animate = () => {
    console.log(this.timer + "TIME");

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
