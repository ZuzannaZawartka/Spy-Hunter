import CivilianCar from "./CivilianCar";
import Game from "./Game";
import { coords } from "./interfaces";
import Truck from "./Truck";
import Vehicle from "./Vehicle";
import Helicopter from "./Helicopter";

export default class Vehicles {
  game: Game;
  vehicles: Vehicle[];
  truck: undefined | Vehicle | Truck;
  helicopter: undefined | Helicopter | Vehicle;

  constructor(game: Game) {
    this.game = game;
    this.vehicles = [];
    this.truck = undefined;
    this.reset();
  }

  reset = () => {
    this.vehicles = [];
    this.vehicles.push(this.game.player);
  };

  addPlayerOnPosition = (position: coords) => {
    this.game.player.position = position;
  };

  createCivilian = () => {
    this.vehicles.push(new CivilianCar(this.game));
  };

  truckRecovery = () => {
    if (this.getVehicle("truck") != undefined) this.getVehicle("truck");
    this.deleteSpecificTypeOfObject("truck");
    this.vehicles.push(new Truck(this.game, 2));
  };

  createTruck = () => {
    this.vehicles.push(new Truck(this.game, 0));
    this.truck = this.getVehicle("truck")!;
  };

  createHelicopter = () => {
    this.vehicles.push(new Helicopter(this.game));
    this.helicopter = this.getVehicle("helicopter")!;
  };

  createTruckWithLadder = () => {
    if (this.getVehicle("truck") == undefined) {
      let truck = new Truck(this.game, 2);
      truck.isWaitingForPlayer = true;
      truck.createOnTop();
      this.vehicles.push(truck);
      this.truck = this.getVehicle("truck")!;
    }
  };

  deleteSpecificTypeOfObject = (typeOfVehicle: string) => {
    this.vehicles = this.vehicles.filter(
      (vehicle) => vehicle != this.getVehicle(typeOfVehicle)
    );

    if (typeOfVehicle == "truck") this.truck = undefined;
  };

  getVehicle = (typeOfVehicle: string) => {
    return this.vehicles.find((vehicle) => vehicle.type == typeOfVehicle);
  };

  draw = (context: CanvasRenderingContext2D) => {
    this.vehicles.forEach((vehicle) => {
      if (
        vehicle.position.y < -150 ||
        vehicle.position.y > this.game.gameHeight + this.game.player.environment
      )
        this.vehicles = this.vehicles.filter((element) => element != vehicle);
      else vehicle.draw(context);
    });

    ///console.log(this.vehicles);
  };
}
