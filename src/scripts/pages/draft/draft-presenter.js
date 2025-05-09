import { parseActivePathname } from "../../routes/url-parser";
import { getToken } from "../../utils";

export default class DraftPresenter {
  constructor({ view, db, model = null }) {
    this._view = view;
    this._db = db;
    this._model = model;
  }

  async showDraftStories() {
    const stories = await this._db.getStories();
    this._view.showDraftStories(stories);
  }

  async showDraftDetail() {
    const { id } = parseActivePathname();
    const story = await this._db.getStoryById(id);
    story.photoUrl = URL.createObjectURL(story.blob);
    this._view.showDraftDetail(story);
  }

  async publishDraft() {
    const { id } = parseActivePathname();
    const story = await this._db.getStoryById(id);
    const token = getToken();
    await this._model.addStory(token, {
      description: story.description,
      lat: story.lat,
      lon: story.lon,
      blob: story.blob,
    });
    await this._db.deleteStory(id);
    alert("Draft berhasil dipublish");
    location.hash = "/";
  }

  async deleteDraft() {
    const { id } = parseActivePathname();
    await this._db.deleteStory(id);
    alert("Draft berhasil dihapus");
    location.hash = "/draft";
  }
}
