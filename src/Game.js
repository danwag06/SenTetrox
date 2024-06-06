import { Input } from "./Input";
import { Level } from "./Level";
import { StartScreen } from "./StartScreen";
import { setScene, currentScene } from "./globals";

let accumulatedElapsedTime = 0;
let oldTime = 0;

export let Game = {
  start() {
    setSce(new StartScreen(new Level()));
    requestAnimationFrame(Game.tick);
  },

  tick(time) {
    requestAnimationFrame(Game.tick);

    let dt = oldTime ? time - oldTime : 0;
    oldTime = time;

    accumulatedElapsedTime += dt;

    if (1000 / accumulatedElapsedTime > 67) {
      return;
    }

    accumulatedElapsedTime = 0;

    let scene = currentScene;

    Input.preUpdate();

    scene.step();

    Input.postUpdate();

    scene.render();
  },
};
