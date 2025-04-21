import { getToken } from "../../utils";

export default class StoryDetailPresenter {
  #storyId;
  #model;
  #view;

  constructor(storyId, { model, view }) {
    this.#storyId = storyId;
    this.#model = model;
    this.#view = view;
  }

  async showStoryDetail() {
    this.#view.showLoading();
    try {
      const token = getToken();
      const response = await this.#model.getStoryDetail(this.#storyId, token);
      if (response.error) {
        console.error(response);
        throw new Error(response.message);
      }
      await this.#view.showStoryDetail(response.story);
    } catch (error) {
      console.error("error show story: ", error.message);
      this.#view.failedFetch(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}
