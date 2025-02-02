import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { StaticRouter } from "react-router-dom/server";
import { renderPage } from "vite-plugin-ssr";
import App from "./src/App";

export { render };

async function render(pageContext) {
  const { url } = pageContext;
  const helmetContext = {};

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;

  return {
    documentHtml: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
          ${helmet.link.toString()}
        </head>
        <body>
          <div id="app">${appHtml}</div>
        </body>
      </html>
    `,
    pageContext: {},
  };
}
