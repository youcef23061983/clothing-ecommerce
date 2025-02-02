import express from "express";
import { createServer as createViteServer } from "vite";
import { renderPage } from "vite-plugin-ssr";

const isProduction = process.env.NODE_ENV === "production";
const root = process.cwd();

async function createServer() {
  const app = express();

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: "ssr" },
      root,
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist/client"));
  }

  app.get("*", async (req, res) => {
    const pageContextInit = { url: req.originalUrl };
    const pageContext = await renderPage(pageContextInit);
    const { documentHtml } = pageContext;

    res.status(200).send(documentHtml);
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer();
