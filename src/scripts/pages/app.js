import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { getToken } from "../utils";
import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe,
} from "../utils/notification-helper";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupNotification();
    this._setupDrawer();
  }

  async #setupNotification() {
    const subscribeButton = document.getElementById("subscribe-notification");
    const isSubscribe = await isCurrentPushSubscriptionAvailable();
    if (isSubscribe) subscribeButton.textContent = "unsubscribe";
    subscribeButton.addEventListener("click", async () => {
      if (isSubscribe) {
        await unsubscribe();
        subscribeButton.textContent = "subscribe";
      } else {
        await subscribe();
        subscribeButton.textContent = "unsubscribe";
      }
    });
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async renderPage() {
    const token = getToken();

    const navHome = document.getElementById("nav-home");
    const navAuth = document.getElementById("nav-auth");
    if (!token) {
      navHome.hidden = true;
      navAuth.hidden = false;
    } else {
      navHome.hidden = false;
      navAuth.hidden = true;
    }

    const publicUrl = ["/register", "/login"];
    const url = getActiveRoute();

    if (!token && !publicUrl.includes(url)) {
      location.hash = "/login";
    }

    const page = routes[url];

    this.#content.innerHTML = await page.render();
    await page.afterRender();
  }
}

export default App;
