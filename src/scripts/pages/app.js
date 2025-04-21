import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { getToken } from "../utils";

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

    const publicUrl = ["/register"];
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
