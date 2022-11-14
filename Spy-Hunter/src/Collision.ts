import { collisionColors, colorsCollisionGroups } from "./config";
import { coords } from "./interfaces";
import Player from "./Player";

export default class Collision {
  playerCollisionPoints: { x: number; y: number }[];
  player: Player;
  constructor(player: Player) {
    this.player = player;
    this.playerCollisionPoints = [];
  }

  refreshCollisionPoints = (position: coords, size: coords) => {
    this.playerCollisionPoints = [
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

  checkCollision = (context: CanvasRenderingContext2D) => {
    this.refreshCollisionPoints(this.player.position, this.player.size);

    //pick every point of collison
    this.playerCollisionPoints.forEach((collisionPoint) => {
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
          if (collisonGroup.action == "vibrations")
            this.player.simulateVibrations();
        }
      }
    });
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
