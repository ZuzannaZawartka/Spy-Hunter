import Bullet from "./Bullet";
import { collisionColors, colorsCollisionGroups, obstacles } from "./config";
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
    this.collisionDifferenceLimit = 1;
  }

  refreshCollisionPoints = (
    position: coords,
    size: coords,
    collisionDifferenceLimit: number
  ) => {
    position = {
      x: position.x + collisionDifferenceLimit,
      y: position.y + collisionDifferenceLimit,
    };
    size = {
      x: size.x - 2 * collisionDifferenceLimit,
      y: size.y - 2 * collisionDifferenceLimit,
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

  refreshBounceAction = (vehicle: Vehicle) => {
    let power;
    // if (vehicle.speed > this.player.maxSpeed * 2)
    //   power =
    //     vehicle.bouncePower * (Math.abs(vehicle.speed) / 2 / vehicle.maxSpeed);
    // else
    power = vehicle.bouncePower / 2;

    return [
      { x: -power, y: 0 },
      { x: 0, y: 0 },
      { x: power, y: 0 }, //first 3 collison point left up corner center and right

      { x: -power, y: 0 },

      {
        x: power,
        y: 0,
      }, //first 3 collison point left up corner center and right

      { x: -power, y: 0 },
      {
        x: 0,
        y: 0,
      },
      { x: power, y: 0 }, //first 3 collison point left up corner center and right
    ];
  };

  checkCollision = (
    vehicle: Vehicle,
    collisionPoints: { x: number; y: number }[],
    context: CanvasRenderingContext2D,
    position: coords,
    size: coords,
    collisionDifferenceLimit: number
  ) => {
    collisionPoints = this.game.collision.refreshCollisionPoints(
      position,
      size,
      collisionDifferenceLimit
    );

    //pick every point of collison
    vehicle.checkTimeForLastTouch();
    this.checkColorCollison(vehicle, collisionPoints, context);
    this.checkObjectCollision(vehicle);
    this.checkBulletCollision(vehicle);
    if (!this.game.isPackingCar) this.checkVehiclesCollision(vehicle);

    return collisionPoints;
  };

  checkColorCollison = (
    vehicle: Vehicle,
    collisionPoints: { x: number; y: number }[],
    context: CanvasRenderingContext2D
  ) => {
    try {
      collisionPoints.forEach((collisionPoint) => {
        let data = context.getImageData(
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
    } catch (error) {}
  };

  checkObjectCollision = (vehicle: Vehicle) => {
    this.game.obstacles.obstacles.forEach((element: Obstacle) => {
      if (
        this.checkCollisionPosition(vehicle.position, vehicle.size, element)
      ) {
        element.useObstacle();
        if (element.type == "granade" && !element.used) {
          vehicle.death();
        } else if (!element.used) {
          vehicle.skid(element);
        }
        //Jakis dzialanie na obstacle
      }
    });
  };

  checkBulletCollision = (vehicle: Vehicle) => {
    if (vehicle != this.game.player) {
      this.game.bulletController.bullets.forEach((element: Bullet) => {
        if (
          this.checkCollisionPosition(vehicle.position, vehicle.size, element)
        ) {
          if (vehicle.isCivilian && vehicle.isEnemy == false)
            this.player.killedCivile();
          vehicle.death();
        }
      });
    }
  };

  checkCollisionPosition = (
    position: coords,
    size: coords,
    element: Bullet | Obstacle | Vehicle
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

  checkIsColorCollison = (
    collisionPoints: { x: number; y: number }[],
    context: CanvasRenderingContext2D
  ) => {
    let leftSide = [0, 3, 5];
    let rightSide = [2, 4, 7];
    let move = 0;

    collisionPoints.forEach((collisionPoint, index) => {
      try {
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

          if (
            collisonGroup?.action == "vibrations" ||
            collisonGroup?.action == "death"
          ) {
            if (leftSide.includes(index)) {
              move -= 5 * this.collisionDifferenceLimit;
            } else if (rightSide.includes(index)) {
              move += 5 * this.collisionDifferenceLimit;
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    });

    return move;
  };

  checkSideOfVehicleCollision = (vehicle: Vehicle, opponent: Vehicle) => {
    let moveResult = { x: 0, y: 0 };
    vehicle.collisionPoints.forEach((collisionPoint, index) => {
      if (
        this.checkCollisionPosition(
          collisionPoint,
          {
            x: this.collisionDifferenceLimit * 2,
            y: this.collisionDifferenceLimit * 2,
          },
          opponent
        )
      ) {
        let move = vehicle.vehicleHitAction[index];
        if (moveResult.x == 0)
          moveResult.x =
            Math.sign(move.x) *
            (opponent.size.x / 2 +
              vehicle.size.x / 2 -
              Math.abs(
                opponent.position.x +
                  opponent.size.x / 2 -
                  vehicle.position.x -
                  vehicle.size.x / 2
              ));
        if (moveResult.y == 0) moveResult.y = move.y;
      }
    });
    vehicle.moveAfterHit(vehicle, opponent, moveResult);
  };

  checkVehiclesCollision = (vehicle: Vehicle) => {
    this.game.vehicles.vehicles.forEach((opponents: Vehicle) => {
      if (
        this.checkCollisionPosition(
          vehicle.position,
          vehicle.size,
          opponents
        ) &&
        vehicle != opponents &&
        opponents.isCollison == true
      ) {
        this.checkSideOfVehicleCollision(vehicle, opponents);
      }
    });
  };
}
