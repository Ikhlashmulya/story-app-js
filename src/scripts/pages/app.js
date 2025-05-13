import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { getToken, isServiceWorkerAvailable } from "../utils";
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

    this._setupDrawer();
  }

  async #setupNotification() {
    const subscribeButton = document.getElementById("subscribe-notification");
    const isSubscribe = await isCurrentPushSubscriptionAvailable();
    
    if (isSubscribe) {
      subscribeButton.textContent = "unsubscribe";
    } else {
      subscribeButton.textContent = "subscribe";
    }

    subscribeButton.addEventListener("click", () => {
      if (isSubscribe) {
        unsubscribe().finally(() => {
          this.#setupNotification();
        })
      } else {
        subscribe().finally(() => {
          this.#setupNotification();
        })
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
      return;
    }

    const page = routes[url];

    this.#content.innerHTML = await page.render();
    await page.afterRender();
    if (isServiceWorkerAvailable()) {
      this.#setupNotification();
    }
  }
}

export default App;
