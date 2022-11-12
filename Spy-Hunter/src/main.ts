import "./style.css";
import Game from "./Game";

window.addEventListener("load", () => {
  let x = new Game(1000, 900, 60, 80);
});
// var ctx = document.getElementById("canvas")!.getContext("2d"),

//   canvasTemp = document.createElement("canvas"),
//   scrollImg = new Image(),
//   car = new Image(),
//   imgWidth = 0,
//   imgHeight = 0,
//   carWidth = 0,
//   carHeight = 0,
//   canvasWidth = 768,
//   canvasHeight = 800,
//   scrollVal = 0,
//   driven = 0,
//   speed = 10,
//   imgScale = 3;

// scrollImg.src = "../graphics/SpyHunterArea01.png";
// scrollImg.onload = loadImage;

// car.src = "../graphics/car.png";
// carWidth = car.width,
//   carHeight = car.height;

// function loadImage() {
//   imgWidth = scrollImg.width * imgScale,
//     imgHeight = scrollImg.height * imgScale;
//   canvasTemp.width = imgWidth;
//   canvasTemp.height = imgHeight;
//   render();
// }
// document.getElementById("container")?.addEventListener("click", function (e) {
//   const data = ctx.getImageData(e.x, e.y, 4, 4).data;

//   let RED = data[0]
//   let GREEN = data[1]
//   let BLUE = data[2]
//   let ALPHA = data[3]
//   console.log(RED + "," + GREEN + "," + BLUE, "")
// })

// function render() {

//   ctx.clearRect(0, 0, canvasWidth, canvasHeight);

//   if (scrollVal >= imgHeight - canvasHeight) {
//     scrollVal = 0;
//   }

//   scrollVal += speed;

//   ctx.drawImage(scrollImg, 0, (-imgHeight + canvasHeight) + scrollVal, imgWidth, imgHeight);
//   ctx.drawImage(car, driven, 0, carWidth, carHeight);
//   setTimeout(function () { render(); }, 10);
// }

// document.addEventListener("keypress", function (e) {
//   console.log(e)
//   if (e.code == "KeyA") {
//     driven = driven - 10;
//   }
// })
