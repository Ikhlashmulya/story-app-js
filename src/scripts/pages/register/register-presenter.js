export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getRegistered(dataInput) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.registerUser(dataInput);
      if (response.error) {
        console.error(response);
        throw new Error(response.message);
      }
      this.#view.registeredSuccess(response.message);
    } catch (error) {
      console.error("error register: ", error.message);
      this.#view.registeredFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
