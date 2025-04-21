import { getToken } from "../../utils";

export default class HomePresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async getStories() {
    this.#view.showLoading();
    try {
      const token = getToken();
      const response = await this.#model.getStories(token);
      if (response.error) {
        console.error(response);
        throw new Error(response.message);
      }
      await this.#view.showStories(response.listStory);
    } catch (error) {
      console.error("error get story: ", error.message);
      this.#view.failedFetch(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}
