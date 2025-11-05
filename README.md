# PRA-UTS — Static dev server

Simple instructions to run the project locally using Node/Express.

Prerequisites
- Node.js (v12+). Verify with `node -v`.

Run locally (Windows cmd.exe)

```cmd
cd /d C:\xampp\htdocs\2403310001.html
npm install
npm start
```

This will start an Express server on http://localhost:3000 serving files from the project root (`index.html` and the `js/` folder).

Notes
- The server includes a simple request logger and an SPA fallback that returns `index.html` for unknown GET routes.
- If your lecturer expects a different folder name (for example `2403310001` rather than `2403310001.html`), rename the project folder before pushing or ask for guidance — repository-level renames must be done carefully to preserve git history.
