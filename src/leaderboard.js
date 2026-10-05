const STORAGE_KEY = 'memory-game-leaderboard';
const MAX_RESULTS = 10;

const sortResults = (results) => results
  .sort((first, second) => first.moves - second.moves || first.completedAt - second.completedAt)
  .slice(0, MAX_RESULTS);

export const getLeaderboard = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(saved)) return [];
    const validResults = saved.filter((result) => (
      Number.isInteger(result.moves)
      && result.moves > 0
      && Number.isFinite(result.completedAt)
    ));
    return sortResults(validResults);
  } catch {
    return [];
  }
};

export const saveResult = (moves) => {
  const results = getLeaderboard();
  results.push({ moves, completedAt: Date.now() });
  const topResults = sortResults(results);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topResults));
  } catch {
    // The victory dialog still reports the result if browser storage is unavailable.
  }
  return topResults;
};

export const formatResultDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
};
