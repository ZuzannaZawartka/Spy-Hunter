import Map from "./Map";
import Control from "./Control";
import Player from "./Player";

export default class Game {
  public canvas: HTMLCanvasElement | null;
  public context: CanvasRenderingContext2D | null;
  public gameWidth: number;
  public gameHeight: number;
  public playerWidth: number;
  public playerHeight: number;
  public maxPlayerArea: number;
  public minPlayerArea: number;

  public points: number;
  public map: Map;
  public player: Player;
  public control: Control;

  constructor(
    gameWidth: number,
    gameHeight: number,
    playerWidth: number,
    playerHeight: number
  ) {
    this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = gameWidth;
    this.canvas.height = gameHeight;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.playerHeight = playerHeight;
    this.playerWidth = playerWidth;
    this.maxPlayerArea = this.gameHeight / 2 - 2 * this.playerHeight;
    this.minPlayerArea = this.gameHeight - 2 * this.playerHeight;
    this.points = 0;

    this.map = new Map(this.gameWidth, this.gameHeight);
    this.player = new Player(this.playerWidth, this.playerHeight, this);
    this.control = new Control(this);

    this.init();
  }

  init = () => {
    console.log("INIT GAME");
    this.animate();
  };

  animate = () => {
    this.context?.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    this.player.draw(this.context!);
    this.player.update();
    requestAnimationFrame(this.animate);
  };
}
