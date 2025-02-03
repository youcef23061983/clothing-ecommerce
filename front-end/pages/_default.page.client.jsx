import { hydrateRoot } from "react-dom/client";
import React from "react";
import PageShell from "./PageShell";

export const render = (pageContext) => {
  const { Page, pageProps } = pageContext;
  hydrateRoot(
    document.getElementById("app"),
    <PageShell>
      <Page {...pageProps} />
    </PageShell>
  );
};

export const clientRouting = true; // Enables client-side routing
