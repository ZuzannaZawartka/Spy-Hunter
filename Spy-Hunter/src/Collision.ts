import Bullet from "./Bullet";
import { collisionColors, colorsCollisionGroups } from "./config";
import Game from "./Game";
import { coords } from "./interfaces";
import Obstacle from "./Obstacle";
import Player from "./Player";
import Vehicle from "./Vehicle";

export default class Collision {
  collisionDifferenceLimit: number;
  player: Player;
  game: Game;

  constructor(game: Game) {
    this.player = game.player;
    this.game = game;
    this.collisionDifferenceLimit = 10;
  }

  refreshCollisionPoints = (position: coords, size: coords) => {
    position = {
      x: position.x + this.collisionDifferenceLimit,
      y: position.y - this.collisionDifferenceLimit,
    };
    size = {
      x: size.x - 2 * this.collisionDifferenceLimit,
      y: size.y - 2 * this.collisionDifferenceLimit,
    };

    return [
      { x: position.x, y: position.y },
      { x: position.x + size.x / 2, y: position.y },
      { x: position.x + size.x, y: position.y }, //first 3 collison point left up corner center and right

      { x: position.x, y: position.y + size.y / 2 },
      {
        x: position.x + size.x,
        y: position.y + size.y / 2,
      }, //first 3 collison point left up corner center and right

      { x: position.x, y: position.y + size.y },
      {
        x: position.x + size.x / 2,
        y: position.y + size.y,
      },
      { x: position.x + size.x, y: position.y + size.y }, //first 3 collison point left up corner center and right
    ];
  };

  checkCollision = (
    vehicle: Vehicle,
    collisionPoints: { x: number; y: number }[],
    context: CanvasRenderingContext2D,
    position: coords,
    size: coords
  ) => {
    collisionPoints = this.game.collision.refreshCollisionPoints(
      position,
      size
    );

    //pick every point of collison
    this.checkColorCollison(vehicle, collisionPoints, context);
    this.checkObjectCollision(vehicle);
    this.checkBulletCollision(vehicle);
    return collisionPoints;
  };

  checkColorCollison = (
    vehicle: Vehicle,
    collisionPoints: { x: number; y: number }[],
    context: CanvasRenderingContext2D
  ) => {
    collisionPoints.forEach((collisionPoint) => {
      const data = context.getImageData(
        collisionPoint.x,
        collisionPoint.y,
        2,
        2
      ).data;

      //checking collisions type and their groups
      let collisionType = this.checkTypeOfCollision(data);
      if (collisionType != undefined) {
        //checking group of collision
        let collisonGroup = colorsCollisionGroups.find((element) =>
          element.colors.includes(collisionType!.id)
        );

        if (collisonGroup != undefined) {
          if (collisonGroup.action == "vibrations") vehicle.vibrations();
          if (collisonGroup.action == "death") vehicle.death();
        }
      }
    });
  };

  checkObjectCollision = (vehicle: Vehicle) => {
    this.game.obstacles.obstacles.forEach((element: Obstacle) => {
      if (
        this.checkCollisionPosition(vehicle.position, vehicle.size, element)
      ) {
        //TO DO PRZEROBIENIA
        element.useObstacle();
        //Jakis dzialanie na obstacle
        vehicle.skid(element);
      }
    });
  };

  checkBulletCollision = (vehicle: Vehicle) => {
    if (vehicle != this.game.player) {
      // console.log(vehicle);
      this.game.bulletController.bullets.forEach((element: Bullet) => {
        if (
          this.checkCollisionPosition(vehicle.position, vehicle.size, element)
        ) {
          console.log("DEAD");
          vehicle.death();
        }
      });
    }
  };

  checkCollisionPosition = (
    position: coords,
    size: coords,
    element: Bullet | Obstacle
  ) => {
    if (
      position.x + size.x >= element.position.x &&
      position.x <= element.position.x + element.size.x &&
      position.y + size.y >= element.position.y &&
      position.y <= element.position.y + element.size.y
    )
      return true;
    else return false;
  };

  checkTypeOfCollision = (data: Uint8ClampedArray) => {
    return collisionColors.find(
      (element) =>
        element.RED == data[0] &&
        element.GREEN == data[1] &&
        element.BLUE == data[2]
    );
  };
}
