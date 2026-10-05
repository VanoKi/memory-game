const createElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

const createButton = (label, className, ariaLabel = label) => {
  const button = createElement('button', className, label);
  button.type = 'button';
  button.setAttribute('aria-label', ariaLabel);
  return button;
};

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
  const stats = createElement('section', 'stats', undefined);
  stats.setAttribute('aria-label', 'Статистика игры');

  const moves = createElement('div', 'stat-card');
  const movesLabel = createElement('span', 'stat-label', 'Ходы');
  const movesValue = createElement('strong', 'stat-value');
  const movesNumber = createElement('span', '', '0');
  movesNumber.id = 'moves-count';
  movesValue.append(movesNumber);
  moves.append(movesLabel, movesValue);

  const pairs = createElement('div', 'stat-card');
  const pairsLabel = createElement('span', 'stat-label', 'Найдено пар');
  const pairsValue = createElement('strong', 'stat-value');
  const pairsNumber = createElement('span', '', '0');
  pairsNumber.id = 'pairs-count';
  pairsValue.append(pairsNumber, ' ', createElement('span', 'stat-total', '/ 8'));
  pairs.append(pairsLabel, pairsValue);

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
  front.dataset.role = 'face';
  front.setAttribute('aria-hidden', 'true');
  inner.append(back, front);
  card.append(inner);
  return card;
};

const createBoard = () => {
  const board = createElement('section', 'game-board');
  board.id = 'game-board';
  board.setAttribute('aria-label', 'Игровое поле, 16 карточек');
  board.setAttribute('role', 'grid');

  for (let index = 0; index < 16; index += 1) {
    const cell = createElement('div', 'game-board__cell');
    cell.setAttribute('role', 'gridcell');
    cell.append(createCard(index));
    board.append(cell);
  }
  return board;
};

const createModal = () => {
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

const { header: appHeader, leadersButton, restartButton } = createHeader();
const main = createElement('main', 'main-content');
main.id = 'main';

const intro = createElement('section', 'intro');
intro.append(
  createElement('p', 'eyebrow', 'ТРЕНИРУЙ ПАМЯТЬ'),
  createElement('h1', 'page-title', 'Найди все пары.'),
  createElement('p', 'intro__description', 'Открывай карточки, запоминай изображения и собери все совпадения.'),
);

main.append(intro, createStats(), createBoard());
const footer = createElement('footer', 'site-footer', 'Memory Game · RS School');
const modalElements = createModal();

document.body.append(appHeader, main, footer, modalElements.overlay);

const cardFaces = Array.from(document.querySelectorAll('.memory-card__front'));
const cards = Array.from(document.querySelectorAll('.memory-card'));
const movesDisplay = document.querySelector('#moves-count');
const pairsDisplay = document.querySelector('#pairs-count');

const cardTypes = [
  { name: 'Солнце', symbol: '☀', color: '#f4c95d' },
  { name: 'Луна', symbol: '☾', color: '#b7a6f6' },
  { name: 'Молния', symbol: 'ϟ', color: '#8bd8e8' },
  { name: 'Звезда', symbol: '✦', color: '#f49ab7' },
  { name: 'Цветок', symbol: '✿', color: '#f4a270' },
  { name: 'Лист', symbol: '❧', color: '#a7df83' },
  { name: 'Кристалл', symbol: '◇', color: '#89b8f4' },
  { name: 'Пламя', symbol: '♨', color: '#f17e6c' },
];

const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
};

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let closeMismatchTimer = null;
let moves = 0;
let matchedPairs = 0;
let gameFinished = false;
let lastFocusedElement = null;

const updateStats = () => {
  movesDisplay.textContent = String(moves);
  pairsDisplay.textContent = String(matchedPairs);
};

const revealCard = (card) => {
  card.classList.add('is-open');
  card.setAttribute('aria-pressed', 'true');
  card.setAttribute('aria-label', `Карточка ${Number(card.dataset.index) + 1}, ${card.dataset.pair}`);
};

const hideCard = (card) => {
  card.classList.remove('is-open');
  card.setAttribute('aria-pressed', 'false');
  card.setAttribute('aria-label', `Карточка ${Number(card.dataset.index) + 1}, закрыта`);
};

const clearSelection = () => {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
};

const closeModal = () => {
  if (modalElements.overlay.hidden) return;
  modalElements.overlay.hidden = true;
  modalElements.overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
};

const openModal = ({ title, content, actions = [] }) => {
  lastFocusedElement = document.activeElement;
  modalElements.title.textContent = title;
  modalElements.content.replaceChildren(content);
  modalElements.actions.replaceChildren(...actions);
  modalElements.overlay.hidden = false;
  modalElements.overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  const firstAction = actions[0] ?? modalElements.closeButton;
  firstAction.focus();
};

const showVictoryModal = () => {
  const message = createElement('p', 'victory-message', `Вы нашли все пары за ${moves} ходов!`);
  const newGameButton = createButton('Новая игра', 'button button--primary');
  newGameButton.addEventListener('click', startNewGame);
  openModal({ title: 'Победа!', content: message, actions: [newGameButton] });
};

const handleCardClick = (event) => {
  const card = event.currentTarget;
  if (gameFinished || lockBoard || card === firstCard || card.classList.contains('is-matched')) return;

  revealCard(card);

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
  moves += 1;
  updateStats();

  if (firstCard.dataset.pair === secondCard.dataset.pair) {
    firstCard.classList.add('is-matched');
    secondCard.classList.add('is-matched');
    firstCard.setAttribute('aria-label', `Карточка ${Number(firstCard.dataset.index) + 1}, пара ${firstCard.dataset.pair} найдена`);
    secondCard.setAttribute('aria-label', `Карточка ${Number(secondCard.dataset.index) + 1}, пара ${secondCard.dataset.pair} найдена`);
    firstCard.disabled = true;
    secondCard.disabled = true;
    matchedPairs += 1;
    updateStats();
    clearSelection();
    if (matchedPairs === cardTypes.length) {
      gameFinished = true;
      showVictoryModal();
    }
    return;
  }

  closeMismatchTimer = window.setTimeout(() => {
    hideCard(firstCard);
    hideCard(secondCard);
    closeMismatchTimer = null;
    clearSelection();
  }, 1000);
};

const startNewGame = () => {
  closeModal();
  if (closeMismatchTimer !== null) {
    window.clearTimeout(closeMismatchTimer);
    closeMismatchTimer = null;
  }
  clearSelection();
  moves = 0;
  matchedPairs = 0;
  gameFinished = false;

  const deck = shuffle([...cardTypes, ...cardTypes]);
  deck.forEach((type, index) => {
    cards[index].dataset.pair = type.name;
    cardFaces[index].textContent = type.symbol;
    cardFaces[index].style.setProperty('--card-color', type.color);
    cards[index].classList.remove('is-open', 'is-matched');
    cards[index].disabled = false;
    cards[index].setAttribute('aria-pressed', 'false');
    cards[index].setAttribute('aria-label', `Карточка ${index + 1}, закрыта`);
  });
  updateStats();
};

modalElements.closeButton.addEventListener('click', closeModal);
modalElements.overlay.addEventListener('click', (event) => {
  if (event.target === modalElements.overlay) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (modalElements.overlay.hidden) return;
  if (event.key === 'Escape') {
    closeModal();
    return;
  }
  if (event.key === 'Tab') {
    const focusable = Array.from(modalElements.dialog.querySelectorAll('button:not([disabled])'));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
cards.forEach((card) => card.addEventListener('click', handleCardClick));
restartButton.addEventListener('click', startNewGame);
startNewGame();
void leadersButton;
