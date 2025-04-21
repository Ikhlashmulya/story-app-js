import { getToken } from "../../utils";

export default class NewPresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async addStory(data) {
    try {
      const token = getToken();
      const response = await this.#model.addStory(token, data);
      if (response.error) {
        console.error(response);
        throw new Error(response.message);
      }
      await this.#view.onSuccess(response.message);
    } catch (error) {
      console.error("error add story: ", error.message);
      this.#view.onFailed(error.message);
    }
  }
}
