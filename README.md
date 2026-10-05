# Memory Game

Учебный проект RS School: игра на поиск пар карточек.

## Демо

После настройки GitHub Pages игра будет доступна по адресу: <https://vanoki.github.io/memory-game/>.

## Локальный запуск

Запустите статический сервер из корня проекта:

```bash
python3 -m http.server 8000
```

Затем откройте <http://localhost:8000>.

## Структура

- `index.html` — точка входа с пустым контейнером `body` и подключённым скриптом.
- `styles.css` — стили приложения.
- `src/main.js` — JavaScript-точка входа.
- `.github/workflows/deploy.yml` — автоматическая публикация ветки `memory-game` в GitHub Pages.
