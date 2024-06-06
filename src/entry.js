import { Game } from "./Game";
import { loadAssets } from "./Assets";
import { drawTextCentered, Graphics, Canvas } from "./Graphics";
import { GameService, Origin } from "haste-arcade-sdk";
import { hasteGameId } from "./globals";

export const haste = new GameService(hasteGameId, Origin.PROD);
localStorage.removeItem("playId");

document.addEventListener("DOMContentLoaded", function () {
  haste.init();
  load();
});

haste.on("play", (data) => {
  if (data.playId) {
    localStorage.setItem("playId", data.playId);
  }
});

const load = async () => {
  const loadingDiv = document.getElementById("generate-audio");
  loadingDiv.style.display = "flex";
  await loadAssets();

  async function startGame() {
    Graphics.clearRect(0, 0, Canvas.width, Canvas.height);
    loadingDiv.style.display = "none";
    document.querySelector("canvas").style.display = "block";
    haste.play();
    Game.start();
  }

  startGame();
};
