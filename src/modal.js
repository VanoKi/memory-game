import { createButton, createElement } from './dom.js';

export const createModalController = (modal) => {
  let lastFocusedElement = null;

  const close = () => {
    if (modal.overlay.hidden) return;
    modal.overlay.hidden = true;
    modal.overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
  };

  const open = ({ title, content, actions = [] }) => {
    lastFocusedElement = document.activeElement;
    modal.title.textContent = title;
    modal.content.replaceChildren(content);
    modal.actions.replaceChildren(...actions);
    modal.overlay.hidden = false;
    modal.overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    (actions[0] ?? modal.closeButton).focus();
  };

  const showVictory = (moves, onNewGame) => {
    const message = createElement('p', 'victory-message', `Вы нашли все пары за ${moves} ходов!`);
    const newGameButton = createButton('Новая игра', 'button button--primary');
    newGameButton.addEventListener('click', onNewGame);
    open({ title: 'Победа!', content: message, actions: [newGameButton] });
  };

  const showLeaderboard = (results, formatDate) => {
    let content;
    if (results.length === 0) {
      content = createElement('p', 'leaderboard-empty', 'Пока нет результатов. Найдите все пары, чтобы попасть в таблицу!');
    } else {
      content = createElement('table', 'leaderboard-table');
      const head = createElement('thead');
      const headerRow = createElement('tr');
      ['Место', 'Ходы', 'Дата'].forEach((label) => {
        const cell = createElement('th', '', label);
        cell.scope = 'col';
        headerRow.append(cell);
      });
      head.append(headerRow);
      const body = createElement('tbody');
      results.forEach((result, index) => {
        const row = createElement('tr');
        [String(index + 1), String(result.moves), formatDate(result.completedAt)].forEach((value) => {
          row.append(createElement('td', '', value));
        });
        body.append(row);
      });
      content.append(head, body);
    }
    open({ title: 'Таблица лидеров', content });
  };

  modal.closeButton.addEventListener('click', close);
  modal.overlay.addEventListener('click', (event) => {
    if (event.target === modal.overlay) close();
  });
  document.addEventListener('keydown', (event) => {
    if (modal.overlay.hidden) return;
    if (event.key === 'Escape') {
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(modal.dialog.querySelectorAll('button:not([disabled])'));
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
  });

  return { open, close, showVictory, showLeaderboard };
};
