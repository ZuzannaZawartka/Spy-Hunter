import { audio } from "./config";

export default class SoundManager {
  soundtrack: HTMLAudioElement;
  shootSound: HTMLAudioElement;
  urlSoundTrack: string;
  constructor(url: string) {
    this.urlSoundTrack = url;
    this.soundtrack = document.createElement("audio");
    this.shootSound = document.createElement("audio");
  }

  playSound = (url: string) => {
    this.soundtrack = document.createElement("audio"); // Create a audio element using the DOM
    this.soundtrack.id = "soundtrack";

    this.soundtrack.style.display = "none"; // Hide the audio element
    this.soundtrack.src = url; // Set resource to our URL
    this.soundtrack.autoplay = true; // Automatically play sound
    this.soundtrack.onended = () => {
      this.playSound(url); // Remove when played.
    };
    document.body.appendChild(this.soundtrack);
  };

  restartMusic = (name: string) => {
    document.getElementById(name)?.remove();
    this.playSound(this.urlSoundTrack);
  };

  stopMusic = (name: string) => {
    document.getElementById(name)?.remove();
  };

  shoot = () => {
    let sound = audio.find((audio) => audio.type == "shoot");
    this.shootSound = document.createElement("audio"); // Create a audio element using the DOM
    this.shootSound!.id = "shoot";

    this.shootSound.style.display = "none"; // Hide the audio element
    this.shootSound.src = sound!.imgSrc; // Set resource to our URL
    this.shootSound.autoplay = true; // Automatically play sound
    this.shootSound.onended = () => {
      this.stopMusic("shoot"); // Remove when played.
    };
    document.body.appendChild(this.soundtrack);
  };

  helicopter = () => {
    let sound = audio.find((audio) => audio.type == "helicopter");
    this.shootSound = document.createElement("audio"); // Create a audio element using the DOM
    this.shootSound!.id = "helicopter";

    this.shootSound.style.display = "none"; // Hide the audio element
    this.shootSound.src = sound!.imgSrc; // Set resource to our URL
    this.shootSound.autoplay = true; // Automatically play sound
    this.shootSound.onended = () => {
      this.stopMusic("helicopter"); // Remove when played.
    };
    document.body.appendChild(this.soundtrack);
  };

  death = () => {
    let sound = audio.find((audio) => audio.type == "death");
    this.shootSound = document.createElement("audio"); // Create a audio element using the DOM
    this.shootSound!.id = "death";

    this.shootSound.style.display = "none"; // Hide the audio element
    this.shootSound.src = sound!.imgSrc; // Set resource to our URL
    this.shootSound.autoplay = true; // Automatically play sound
    this.shootSound.onended = () => {
      this.stopMusic("death"); // Remove when played.
    };
    document.body.appendChild(this.soundtrack);
  };

  skid = () => {
    let sound = audio.find((audio) => audio.type == "skid");
    this.shootSound = document.createElement("audio"); // Create a audio element using the DOM
    this.shootSound!.id = "skid";

    this.shootSound.style.display = "none"; // Hide the audio element
    this.shootSound.src = sound!.imgSrc; // Set resource to our URL
    this.shootSound.autoplay = true; // Automatically play sound
    this.shootSound.onended = () => {
      this.stopMusic("skid"); // Remove when played.
    };
    document.body.appendChild(this.soundtrack);
  };

  collision = () => {
    let sound = audio.find((audio) => audio.type == "collision");
    this.shootSound = document.createElement("audio"); // Create a audio element using the DOM
    this.shootSound!.id = "collision";

    this.shootSound.style.display = "none"; // Hide the audio element
    this.shootSound.src = sound!.imgSrc; // Set resource to our URL
    this.shootSound.autoplay = true; // Automatically play sound
    this.shootSound.onended = () => {
      this.stopMusic("collision"); // Remove when played.
    };
    document.body.appendChild(this.soundtrack);
  };
}
