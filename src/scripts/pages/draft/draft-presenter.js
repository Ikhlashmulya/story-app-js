import { parseActivePathname } from "../../routes/url-parser";
import { getToken } from "../../utils";

export default class DraftPresenter {
  #view;
  #db;
  #model;

  constructor({ view, db, model = null }) {
    this.#view = view;
    this.#db = db;
    this.#model = model;
  }

  async showDraftStories() {
    const stories = await this.#db.getStories();
    this.#view.showDraftStories(stories);
  }

  async showDraftDetail() {
    const { id } = parseActivePathname();
    const story = await this.#db.getStoryById(id);
    story.photoUrl = URL.createObjectURL(story.blob);
    this.#view.showDraftDetail(story);
  }

  async publishDraft() {
    const { id } = parseActivePathname();
    const story = await this.#db.getStoryById(id);
    const token = getToken();
    await this.#model.addStory(token, {
      description: story.description,
      lat: story.lat,
      lon: story.lon,
      blob: story.blob,
    });
    await this.#db.deleteStory(id);
    alert("Draft berhasil dipublish");
    location.hash = "/";
  }

  async deleteDraft() {
    const { id } = parseActivePathname();
    await this.#db.deleteStory(id);
    alert("Draft berhasil dihapus");
    location.hash = "/draft";
  }
}
