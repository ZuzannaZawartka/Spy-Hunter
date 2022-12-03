const keymap = [
  { action: "UP", keys: ["ArrowUp", "w", "W"] },
  { action: "DOWN", keys: ["ArrowDown", "s", "S"] },
  { action: "RIGHT", keys: ["ArrowRight", "d", "D"] },
  { action: "LEFT", keys: ["ArrowLeft", "a", "A"] },
  { action: "SHOOT1", keys: ["a", "A"] },
  { action: "SHOOT2", keys: ["z", "Z"] },
];

const keymapAction = [
  { action: "START", keys: ["Control"] },
  { action: "PAUSE", keys: ["Escape"] },
];

const collisionColors = [
  { id: 1, ground: "road", RED: 116, GREEN: 116, BLUE: 116 },
  { id: 2, ground: "roadside", RED: 252, GREEN: 152, BLUE: 56 },
  { id: 3, ground: "roadsideContour", RED: 0, GREEN: 0, BLUE: 0 },
  { id: 4, ground: "lawn", RED: 76, GREEN: 220, BLUE: 72 },
  { id: 5, ground: "lawn2", RED: 0, GREEN: 148, BLUE: 0 },
  { id: 6, ground: "lawn3", RED: 33, GREEN: 179, BLUE: 31 },
  { id: 7, ground: "water1", RED: 60, GREEN: 188, BLUE: 252 },
  { id: 8, ground: "water2", RED: 0, GREEN: 112, BLUE: 236 },
  { id: 9, ground: "bridge", RED: 188, GREEN: 188, BLUE: 188 },
  { id: 10, ground: "paddle", RED: 76, GREEN: 98, BLUE: 218 },
];

const colorsCollisionGroups = [
  { id: 1, action: "noCollision", colors: [1, 7, 8] },
  { id: 2, action: "vibrations", colors: [2, 3] },
  { id: 3, action: "death", colors: [4, 5, 6, 9] },
  { id: 4, action: "skid", colors: [10] },
];

const obstacles = [
  {
    id: 0,
    type: "paddle",
    imgSrc: "./graphics/obstacles/puddle.png",
    afterCollisionImgSrc: "./graphics/obstacles/puddle2.png",
    width: 80,
    height: 40,
  },
  {
    id: 1,
    type: "granade",
    imgSrc: "./graphics/obstacles/granade.png",
    afterCollisionImgSrc: "./graphics/obstacles/granade.png",
    width: 60,
    height: 36,
  },
];

const civilian = [
  {
    id: 0,
    type: "motor",
    imgSrc: "./graphics/vehicles/civilian2.png",
    afterCollisionImgSrc: "./graphics/vehicles/civilian2.png",
    width: 80,
    height: 40,
    maxSpeed: 60,
    isCivilian: true,
  },
  {
    id: 1,
    type: "civilianCar",
    imgSrc: "./graphics/vehicles/civilian.png",
    afterCollisionImgSrc: "./graphics/vehicles/civilian.png",
    width: 80,
    height: 40,
    maxSpeed: 60,
    isCivilian: true,
  },
];
export {
  keymap,
  collisionColors,
  colorsCollisionGroups,
  obstacles,
  keymapAction,
  civilian,
};
