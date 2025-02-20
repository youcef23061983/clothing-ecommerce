import express from "express";
import { renderToString } from "react-dom/server";
import App from "./src/App";

const app = express();

app.use(express.static("dist"));

app.get("*", (req, res) => {
  const appHtml = renderToString(<App />);
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite React SSR</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script type="module" src="/src/main.jsx"></script>
      </body>
    </html>
  `);
});

const PORT = 3001; // Ensure the port is set to 3001
app.listen(PORT, () => {
  console.log(`SSR server running on http://localhost:${PORT}`);
});
