import { createGame } from './game.js';
import { createModalController } from './modal.js';
import { createApp } from './ui.js';
import { formatResultDate, getLeaderboard, saveResult } from './leaderboard.js';

const app = createApp();
const modal = createModalController(app.modal);
let game;

game = createGame({
  ...app,
  onVictory: (moves) => {
    saveResult(moves);
    modal.showVictory(moves, () => {
      modal.close();
      game.startNewGame();
    });
  },
});

app.restartButton.addEventListener('click', () => {
  modal.close();
  game.startNewGame();
});

app.leadersButton.addEventListener('click', () => {
  modal.showLeaderboard(getLeaderboard(), formatResultDate);
});
