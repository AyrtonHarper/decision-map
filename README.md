# Decision Map v0.1

Personal thinking tool: dump unstructured thoughts, map them into an editable reasoning graph, and check decision clarity.

## Try it (no install)

**Live demo:** https://ayrtonharper.github.io/decision-map/

Open that URL in your browser — nothing to install. Your graph saves to `localStorage` in that browser.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints (default `http://127.0.0.1:5173`).

Pushes to `main` auto-deploy to GitHub Pages via Actions.

## Flow

1. Enter a central question and dump free-form thoughts.
2. Click **Map My Thinking** (mock extractor → cards + edges).
3. Edit nodes/edges on the canvas; review warnings and summary in the sidebar.
4. Graph state autosaves to `localStorage`.
