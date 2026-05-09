import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Providers } from "./app/providers";
import { AppRouter } from "./app/router";
import { CursorSpotlight } from "./shared/components/animations/CursorSpotlight";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <CursorSpotlight />
      <div className="noise-overlay" />
      <AppRouter />
    </Providers>
  </StrictMode>
);
