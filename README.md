# Memory Game

A memory matching game built for the RS School assignment.

## Demo

Play the game at <https://vanoki.github.io/memory-game/>.

## Run locally

Start a static server from the project root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Project structure

- `index.html` — entry point with an otherwise empty `body`.
- `styles.css` — application styles.
- `src/main.js` — JavaScript entry point.
- `.github/workflows/deploy.yml` — deploys the `memory-game` branch to GitHub Pages.
