import { Game } from "./Game";
import { loadAssets } from "./Assets";
import { drawTextCentered, Graphics, Canvas } from "./Graphics";
import { GameService, Origin } from "haste-arcade-sdk";

const haste = new GameService(
  "f8c22e6c-1086-4529-8800-2c72f98b9915",
  Origin.DEV
);

document.addEventListener("DOMContentLoaded", function () {
  haste.init();
  load();
});

const load = async () => {
  const loadingDiv = document.getElementById("generate-audio");
  loadingDiv.style.display = "flex";
  await loadAssets();
  const waitText = "Waiting for Haste Arcade HST lock to start...";
  loadingDiv.textContent = waitText;
  renderLoadingText(waitText);

  haste.on("play", (data) => {
    console.log("Play event received:", data);
    if (data.playId) {
      console.log("Starting game...");
      startGame();
    }
  });

  haste.play();

  function startGame() {
    console.log("Clearing canvas and starting game...");
    Graphics.clearRect(0, 0, Canvas.width, Canvas.height);
    loadingDiv.style.display = "none";
    document.querySelector("canvas").style.display = "block";
    console.log("Canvas cleared, game starting...");
    Game.start();
  }
};

const renderLoadingText = (text) => {
  // Clear the canvas
  Graphics.clearRect(0, 0, Canvas.width, Canvas.height);

  // Set transformation for centered text
  Graphics.setTransform(1, 0, 0, 1, 0, 0);

  // Draw centered text
  drawTextCentered(text, Canvas.width / 2, Canvas.height / 2);
};
