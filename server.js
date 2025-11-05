const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const root = process.cwd();

// Simple request logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// Serve static files from project root (index.html, js/, etc.)
app.use(express.static(root, { extensions: ['html'] }));

// SPA fallback: return index.html for any GET request that accepts HTML
app.get('*', (req, res) => {
  if (req.method === 'GET' && req.accepts('html')) {
    res.sendFile(path.join(root, 'index.html'));
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}/`);
  console.log(`Serving directory: ${root}`);
});
