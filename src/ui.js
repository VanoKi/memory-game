import { createButton, createElement } from './dom.js';

const createHeader = () => {
  const header = createElement('header', 'site-header');
  const brand = createElement('a', 'brand', 'MEMORY');
  brand.href = '#main';
  brand.setAttribute('aria-label', 'Memory Game — на главную');

  const actions = createElement('div', 'header-actions');
  const leadersButton = createButton('Таблица лидеров', 'button button--quiet');
  const restartButton = createButton('Новая игра', 'button button--primary');
  actions.append(leadersButton, restartButton);
  header.append(brand, actions);
  return { header, leadersButton, restartButton };
};

const createStats = () => {
  const stats = createElement('section', 'stats');
  stats.setAttribute('aria-label', 'Статистика игры');
  const moves = createElement('div', 'stat-card');
  const movesNumber = createElement('span', '', '0');
  movesNumber.id = 'moves-count';
  moves.append(createElement('span', 'stat-label', 'Ходы'), createElement('strong', 'stat-value'));
  moves.lastElementChild.append(movesNumber);

  const pairs = createElement('div', 'stat-card');
  const pairsNumber = createElement('span', '', '0');
  pairsNumber.id = 'pairs-count';
  const pairsValue = createElement('strong', 'stat-value');
  pairsValue.append(pairsNumber, ' ', createElement('span', 'stat-total', '/ 8'));
  pairs.append(createElement('span', 'stat-label', 'Найдено пар'), pairsValue);
  stats.append(moves, pairs);
  return stats;
};

const createCard = (index) => {
  const card = createButton('', 'memory-card', `Карточка ${index + 1}, закрыта`);
  card.dataset.index = String(index);
  card.setAttribute('aria-pressed', 'false');
  const inner = createElement('span', 'memory-card__inner');
  const back = createElement('span', 'memory-card__face memory-card__back', '?');
  back.setAttribute('aria-hidden', 'true');
  const front = createElement('span', 'memory-card__face memory-card__front');
  front.setAttribute('aria-hidden', 'true');
  inner.append(back, front);
  card.append(inner);
  return { card, face: front };
};

const createBoard = () => {
  const board = createElement('section', 'game-board');
  board.id = 'game-board';
  board.setAttribute('aria-label', 'Игровое поле, 16 карточек');
  board.setAttribute('role', 'grid');
  const cards = [];
  const faces = [];

  for (let index = 0; index < 16; index += 1) {
    const cell = createElement('div', 'game-board__cell');
    cell.setAttribute('role', 'gridcell');
    const { card, face } = createCard(index);
    cards.push(card);
    faces.push(face);
    cell.append(card);
    board.append(cell);
  }
  return { board, cards, faces };
};

const createModalShell = () => {
  const overlay = createElement('div', 'modal-overlay');
  overlay.hidden = true;
  overlay.setAttribute('aria-hidden', 'true');
  const dialog = createElement('section', 'modal');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'modal-title');
  const title = createElement('h2', 'modal__title');
  title.id = 'modal-title';
  const content = createElement('div', 'modal__content');
  const actions = createElement('div', 'modal__actions');
  const closeButton = createButton('Закрыть', 'button button--quiet');
  dialog.append(title, content, actions, closeButton);
  overlay.append(dialog);
  return { overlay, dialog, title, content, actions, closeButton };
};

export const createApp = () => {
  const { header, leadersButton, restartButton } = createHeader();
  const main = createElement('main', 'main-content');
  main.id = 'main';
  const intro = createElement('section', 'intro');
  intro.append(
    createElement('p', 'eyebrow', 'ТРЕНИРУЙ ПАМЯТЬ'),
    createElement('h1', 'page-title', 'Найди все пары.'),
    createElement('p', 'intro__description', 'Открывай карточки, запоминай изображения и собери все совпадения.'),
  );
  const { board, cards, faces } = createBoard();
  main.append(intro, createStats(), board);
  const footer = createElement('footer', 'site-footer', 'Memory Game · RS School');
  const modal = createModalShell();
  document.body.append(header, main, footer, modal.overlay);

  return {
    cards,
    faces,
    movesDisplay: document.querySelector('#moves-count'),
    pairsDisplay: document.querySelector('#pairs-count'),
    leadersButton,
    restartButton,
    modal,
  };
};
