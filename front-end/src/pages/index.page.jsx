import React from "react";
import ReactDOMServer from "react-dom/server";

export { Page, render };

function Page() {
  return (
    <div>
      <h1>Welcome to My Vite SSR App</h1>
      <p>This is the home page rendered with SSR.</p>
    </div>
  );
}

async function render(pageContext) {
  const { Page } = pageContext;
  const pageHtml = ReactDOMServer.renderToString(<Page />);
  const documentHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>My Vite SSR App</title>
      </head>
      <body>
        <div id="app">${pageHtml}</div>
      </body>
    </html>`;
  return { documentHtml };
}
