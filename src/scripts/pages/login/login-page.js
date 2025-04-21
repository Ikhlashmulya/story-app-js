import LoginPresenter from "./login-presenter";
import * as StoryAppAPI from "../../data/api";

export default class LoginPage {
  #presenter = null;
  async render() {
    return `
      <section class="container">
        <form id="form-login" class="form-auth-container">
          <h2>Login</h2>
          <label for="email">email</label>
          <input type="text" name="email" id="email"/>
          <label for="password">password</label>
          <input type="password" name="password" id="password"/>
          <button type="submit" id="btn-submit">Login</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      model: StoryAppAPI,
      view: this,
    });

    this.#addSubmitListener();
  }

  #addSubmitListener() {
    const formLogin = document.getElementById("form-login");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = emailInput.value;
      const password = passwordInput.value;

      await this.#presenter.loginAndGetToken({ email, password });
    });
  }

  loginSuccess() {
    location.hash = "/";
  }

  loginFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    document.getElementById("btn-submit").innerHTML = `
    <i class="fas fa-spinner loader-button"></i>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("btn-submit").innerHTML = `
    Register
    `;
  }
}
