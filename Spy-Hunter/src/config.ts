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
  { id: 11, ground: "lawn3", RED: 0, GREEN: 168, BLUE: 0 },
  { id: 12, ground: "roadsideContour", RED: 200, GREEN: 76, BLUE: 12 },
];

const colorsCollisionGroups = [
  { id: 1, action: "noCollision", colors: [1, 7, 8] },
  { id: 2, action: "vibrations", colors: [2, 12] },
  { id: 3, action: "death", colors: [4, 5, 6, 9, 11] },
  { id: 4, action: "skid", colors: [10] },
];

const fires = [
  {
    id: 0,
    type: "fire",
    imgSrc: "./graphics/vehicles/fires.png",
    amountOfGraphic: 5,
    afterCollisionImgSrc: "./graphics/obstacles/puddle2.png",
    width: 70,
    height: 100,
  },
  {
    id: 1,
    type: "fire",
    imgSrc: "./graphics/vehicles/fires4.png",
    amountOfGraphic: 3,
    afterCollisionImgSrc: "./graphics/obstacles/puddle2.png",
    width: 70,
    height: 100,
  },
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
    afterCollisionImgSrc: "./graphics/obstacles/granade2.png",
    width: 60,
    height: 36,
  },
];

const guns = [
  {
    id: 0,
    type: "gun",
    imgSrc: "./graphics/guns/gun1.png",
    afterCollisionImgSrc: "./graphics/guns/gun1.png",
    width: 120,
    height: 60,
  },
  {
    id: 1,
    type: "gun2",
    imgSrc: "./graphics/guns/gun2.png",
    afterCollisionImgSrc: "./graphics/guns/gun2.png",
    width: 150,
    height: 90,
  },
];

const trucks = [
  {
    id: 0,
    type: "truck",
    imgSrc: "./graphics/vehicles/truckSpriteSheet.png",
    afterCollisionImgSrc: "./graphics/vehicles/truck1.png",
    amountOfGraphic: 2,
    width: 74,
    height: 165,
    maxSpeed: 15,
    isCivilian: true,
    collision: true,
    isEnemy: false,
  },
  {
    id: 1,
    type: "truck",
    imgSrc: "./graphics/vehicles/truckSpriteSheet2.png",
    amountOfGraphic: 2,
    afterCollisionImgSrc: "./graphics/vehicles/truck2.png",
    width: 74,
    height: 165,
    maxSpeed: 15,
    isCivilian: true,
    collision: true,
    isEnemy: false,
  },
  {
    id: 2,
    type: "truck",
    imgSrc: "./graphics/vehicles/truckSpriteSheet3.png",
    amountOfGraphic: 2,
    afterCollisionImgSrc: "./graphics/vehicles/truck3.png",
    width: 74,
    height: 165,
    maxSpeed: 15,
    isCivilian: true,
    collision: true,
    isEnemy: false,
  },
];

const vehicles = [
  {
    id: 0,
    type: "motor",
    imgSrc: "./graphics/vehicles/civilian2.png",
    afterCollisionImgSrc: "./graphics/vehicles/civilian2.png",
    width: 45,
    height: 80,
    maxSpeed: 15,
    isCivilian: true,
    collision: true,
    isEnemy: false,
  },
  {
    id: 1,
    type: "civilianCar",
    imgSrc: "./graphics/vehicles/civilian.png",
    afterCollisionImgSrc: "./graphics/vehicles/civilian.png",
    width: 50,
    height: 85,
    maxSpeed: 10,
    isCivilian: true,
    collision: true,
    isEnemy: false,
  },
  {
    id: 2,
    type: "civilianCar",
    imgSrc: "./graphics/vehicles/civilian3.png",
    afterCollisionImgSrc: "./graphics/vehicles/civilian3.png",
    width: 52,
    height: 80,
    maxSpeed: 10,
    isCivilian: true,
    collision: true,
    isEnemy: false,
  },
];

const helicopter = [
  {
    id: 0,
    type: "helicopter",
    imgSrc: "./graphics/vehicles/helicopter.png",
    afterCollisionImgSrc: "none",
    width: 145,
    height: 190,
    maxSpeed: 15,
    isCivilian: true,
    collision: false,
    isEnemy: true,
  },
];

const audio = [
  {
    id: 0,
    type: "soundtrack",
    imgSrc: "./graphics/music/soundtrack.mp3",
  },
  {
    id: 1,
    type: "shoot",
    imgSrc: "./graphics/music/shoot.mp3",
  },
  {
    id: 2,
    type: "helicopter",
    imgSrc: "./graphics/music/helicopter.mp3",
  },
  {
    id: 3,
    type: "death",
    imgSrc: "./graphics/music/death2.mp3",
  },
  {
    id: 4,
    type: "skid",
    imgSrc: "./graphics/music/skid.mp3",
  },
  {
    id: 5,
    type: "collision",
    imgSrc: "./graphics/music/collision.mp3",
  },
  {
    id: 6,
    type: "vibrations",
    imgSrc: "./graphics/music/vibrations.mp3",
  },
];

const enemies = [
  {
    id: 0,
    type: "enemy",
    imgSrc: "./graphics/vehicles/spinningEnemy2.png",
    afterCollisionImgSrc: "none",
    width: 70,
    height: 98,
    maxSpeed: 15,
    isCivilian: true,
    isEnemy: true,
    collision: true,
  },
  {
    id: 1,
    type: "car",
    imgSrc: "./graphics/car3.png",
    afterCollisionImgSrc: "none",
    width: 40,
    height: 75,
    maxSpeed: 25,
    isCivilian: true,
    isEnemy: true,
    collision: true,
  },
];
export {
  keymap,
  collisionColors,
  colorsCollisionGroups,
  obstacles,
  keymapAction,
  vehicles,
  guns,
  trucks,
  helicopter,
  enemies,
  fires,
  audio,
};
