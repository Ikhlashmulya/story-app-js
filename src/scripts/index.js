// CSS imports
import "../styles/styles.css";
import "./components/story-card";
import "./components/story-card-draft";
import "leaflet/dist/leaflet.css";

import App from "./pages/app";
import { Camera } from "./utils/camera";
import { registerServiceWorker, viewTransition } from "./utils";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  viewTransition(async () => {
    await app.renderPage();
  });

  await registerServiceWorker();

  window.addEventListener("hashchange", async () => {
    if (location.hash == "#main-content") {
      return;
    }

    Camera.stopAllStreams();
    viewTransition(async () => {
      await app.renderPage();
    });
  });
});
