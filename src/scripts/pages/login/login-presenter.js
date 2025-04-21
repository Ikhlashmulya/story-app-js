import { setUserInfo } from "../../utils";

export default class LoginPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async loginAndGetToken(dataInput) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.loginUser(dataInput);
      if (response.error) {
        console.error(response);
        throw new Error(response.message);
      }
      this.#view.loginSuccess();
      setUserInfo(response.loginResult);
    } catch (error) {
      console.error("error login: ", error.message);
      this.#view.loginFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
