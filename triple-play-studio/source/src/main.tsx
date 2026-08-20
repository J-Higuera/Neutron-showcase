import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// always load at the top: the browser otherwise restores the previous scroll
// position on refresh (deep anchor links still work — we only override when
// there is no hash in the URL)
if (!window.location.hash) {
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
