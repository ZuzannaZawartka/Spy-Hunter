import Map from "./Map"
import { size } from "./interfaces";
import Control from "./Control";

export default class Game implements size {
    canvas: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null
    width: number;
    height: number;
    map: Map;

    constructor(width: number, height: number) {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');;
        this.context = this.canvas.getContext('2d');;
        this.width = width;
        this.height = height;

        this.map = new Map(this.width, this.height)

        this.init()
    }


    init() {

        console.log("cos")
        let x = new Control



    }
}