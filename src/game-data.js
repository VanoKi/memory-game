export const CARD_TYPES = [
  { name: 'Солнце', symbol: '☀', color: '#f4c95d' },
  { name: 'Луна', symbol: '☾', color: '#b7a6f6' },
  { name: 'Молния', symbol: 'ϟ', color: '#8bd8e8' },
  { name: 'Звезда', symbol: '✦', color: '#f49ab7' },
  { name: 'Цветок', symbol: '✿', color: '#f4a270' },
  { name: 'Лист', symbol: '❧', color: '#a7df83' },
  { name: 'Кристалл', symbol: '◇', color: '#89b8f4' },
  { name: 'Пламя', symbol: '♨', color: '#f17e6c' },
];

export const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
};
