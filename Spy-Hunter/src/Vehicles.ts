import CivilianCar from "./CivilianCar";
import Game from "./Game";
import Truck from "./Truck";
import Vehicle from "./Vehicle";

export default class Vehicles {
  game: Game;
  vehicles: Vehicle[];
  constructor(game: Game) {
    this.game = game;
    this.vehicles = [];
    this.reset();
  }

  reset = () => {
    this.vehicles = [];
    this.vehicles.push(this.game.player);
  };

  createCivilian = () => {
    this.vehicles.push(new CivilianCar(this.game));
    console.log(this.vehicles);
  };

  createTruck = () => {
    this.vehicles.push(new Truck(this.game));
    console.log(this.vehicles);
  };

  draw = (context: CanvasRenderingContext2D) => {
    this.vehicles.forEach((vehicle) => {
      if (
        vehicle.position.y < -200 ||
        vehicle.position.y > this.game.gameHeight + this.game.player.environment
      )
        this.vehicles = this.vehicles.filter((element) => element != vehicle);
      else vehicle.draw(context);
    });

    ///console.log(this.vehicles);
  };
}
