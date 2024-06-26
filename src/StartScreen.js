import { Input } from "./Input";
import { Overlay } from "./Overlay";
import { setScene } from "./globals";
import { drawSprite, Graphics, Canvas } from "./Graphics";
import { LogoSprite, VictorySong } from "./Assets";
import { drawTextCentered } from "./fontUtils";
import { PauseScreen } from "./PauseScreen";
import { haste } from "./entry";

export class StartScreen extends Overlay {
  constructor(scene) {
    super(scene);

    this.blinkingTimer = 0;
  }
  step() {
    if (!!localStorage.getItem("playId")) {
      setScene(new PauseScreen(this.scene, true));
    }

    this.blinkingTimer++;
  }

  render() {
    super.render();

    Graphics.setTransform(1, 0, 0, 1, Canvas.width / 2, 150);

    drawSprite(LogoSprite, 0, 0, 0, 2, 2);

    if (this.blinkingTimer % 60 < 30) {
      drawTextCentered("LOCK HST TO START", 0, 130);
    }
  }
}
