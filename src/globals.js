import { haste } from "./entry";

export let currentScene;
export let currentScore = 0;
export let lineClears = 0;
export let currentLevel = 1;
export const hasteGameId = "df185b3b-a2c5-4a67-ac62-ee93015e4e1e";

export function setScene(scene) {
  currentScene = scene;
}

export function resetScore() {
  currentScore = 0;
}

export function addToScore(amount) {
  currentScore += amount;
}

export function resetLineClears() {
  lineClears = 0;
  currentLevel = 1;
}

export function addLineClears(amount) {
  lineClears += amount;
  currentLevel = 0 | (lineClears / 10 + 1);
}
