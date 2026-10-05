import { CARD_TYPES, shuffle } from './game-data.js';

export const createGame = ({ cards, faces, movesDisplay, pairsDisplay, onVictory }) => {
  let firstCard = null;
  let secondCard = null;
  let locked = false;
  let mismatchTimer = null;
  let moves = 0;
  let matchedPairs = 0;
  let finished = false;

  const updateStats = () => {
    movesDisplay.textContent = String(moves);
    pairsDisplay.textContent = String(matchedPairs);
  };

  const clearSelection = () => {
    firstCard = null;
    secondCard = null;
    locked = false;
  };

  const setCardFace = (card, face, type, index) => {
    card.dataset.pair = type.name;
    const logo = face.querySelector('.framework-logo');
    logo.src = type.logo;
    logo.alt = '';
    face.querySelector('.framework-name').textContent = type.name;
    face.style.setProperty('--card-color', type.color);
    card.classList.remove('is-open', 'is-matched');
    card.disabled = false;
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', `Карточка ${index + 1}, закрыта`);
  };

  const startNewGame = () => {
    if (mismatchTimer !== null) {
      window.clearTimeout(mismatchTimer);
      mismatchTimer = null;
    }
    clearSelection();
    moves = 0;
    matchedPairs = 0;
    finished = false;
    const deck = shuffle([...CARD_TYPES, ...CARD_TYPES]);
    deck.forEach((type, index) => setCardFace(cards[index], faces[index], type, index));
    updateStats();
  };

  const reveal = (card) => {
    card.classList.add('is-open');
    card.setAttribute('aria-pressed', 'true');
    card.setAttribute('aria-label', `Карточка ${Number(card.dataset.index) + 1}, ${card.dataset.pair}`);
  };

  const hide = (card) => {
    card.classList.remove('is-open');
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', `Карточка ${Number(card.dataset.index) + 1}, закрыта`);
  };

  const handleCardClick = (event) => {
    const card = event.currentTarget;
    if (finished || locked || card === firstCard || card.classList.contains('is-matched')) return;
    reveal(card);
    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    locked = true;
    moves += 1;
    updateStats();
    if (firstCard.dataset.pair === secondCard.dataset.pair) {
      [firstCard, secondCard].forEach((matchedCard) => {
        matchedCard.classList.add('is-matched');
        matchedCard.disabled = true;
        matchedCard.setAttribute('aria-label', `Карточка ${Number(matchedCard.dataset.index) + 1}, пара ${matchedCard.dataset.pair} найдена`);
      });
      matchedPairs += 1;
      updateStats();
      clearSelection();
      if (matchedPairs === CARD_TYPES.length) {
        finished = true;
        onVictory(moves);
      }
      return;
    }

    mismatchTimer = window.setTimeout(() => {
      hide(firstCard);
      hide(secondCard);
      mismatchTimer = null;
      clearSelection();
    }, 1000);
  };

  cards.forEach((card) => card.addEventListener('click', handleCardClick));
  startNewGame();
  return { startNewGame };
};
