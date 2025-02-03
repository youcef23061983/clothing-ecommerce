import ReactDOMServer from "react-dom/server";
import PageShell from "./PageShell";

export const render = async (pageContext) => {
  const { Page, pageProps } = pageContext;
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell>
      <Page {...pageProps} />
    </PageShell>
  );

  return {
    documentHtml: `<!DOCTYPE html>
    <html>
      <head>
        <title>${pageContext.documentProps?.title || "App"}</title>
      </head>
      <body>
        <div id="app">${pageHtml}</div>
      </body>
    </html>`,
  };
};
