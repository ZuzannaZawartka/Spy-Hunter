import { size } from "./interfaces";
export default class Map implements size {

    width: number;
    heigth: number;

    constructor(width: number, heigth: number) {
        this.width = width
        this.heigth = heigth
    }
}