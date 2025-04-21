import RegisterPresenter from "./register-presenter";
import * as StoryAppAPI from "../../data/api";

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <form id="form-register" class="form-auth-container">
          <h2>Register</h2>
          <label for="name">name</label>
          <input type="text" name="name" id="name"/>
          <label for="email">email</label>
          <input type="email" name="email" id="email"/>
          <label for="password">password</label>
          <input type="password" name="password" id="password"/>
          <label for="verify-password">verify password</label>
          <input type="password" name="verify-password" id="verify-password"/>
          <button type="submit" id="btn-submit">Register</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryAppAPI,
    });

    this.#addSubmitListener();
  }

  #addSubmitListener() {
    const formRegister = document.getElementById("form-register");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const verifyPasswordInput = document.getElementById("verify-password");

    formRegister.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = nameInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;
      const verifyPassword = verifyPasswordInput.value;

      if (password !== verifyPassword) {
        alert("verify password is not match with password");
        return;
      }

      await this.#presenter.getRegistered({ name, email, password });
    });
  }

  registeredSuccess(message) {
    location.hash = "/";
    alert(message);
  }

  registeredFailed(message) {
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
