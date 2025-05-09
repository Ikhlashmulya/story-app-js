import { getUserInfo } from "../../utils";
import HomePresenter from "./home-presenter";
import * as StoryAppAPI from "../../data/api";

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1 id="welcome"></h1>
        <a href="#/new" class="btn">New Story</a>
        <a href="#/draft" class="btn">Draft</a>
        <div id="loading"></div>
        <article id="story-list"></article>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      model: StoryAppAPI,
      view: this,
    });
    this.#showWelcome();
    await this.#presenter.getStories();
  }

  async showStories(stories) {
    const storyList = document.getElementById("story-list");
    storyList.id = "story-list";
    const storyCards = stories.map((story) => {
      const storyCard = document.createElement("story-card");
      storyCard.setStory(story);
      return storyCard;
    });
    storyList.append(...storyCards);
  }

  showLoading() {
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      loadingElement.innerHTML = `<i class="fas fa-spinner loader-button" style="font-size: 50px"></i>`;
    }
  }

  hideLoading() {
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      loadingElement.innerHTML = ``;
    }
  }

  failedFetch(message) {
    alert(message);
  }

  #showWelcome() {
    const userInfo = getUserInfo();
    const welcomeElement = document.getElementById("welcome");
    if (welcomeElement) {
      welcome.textContent = `Welcome ${userInfo.name}`;
    }
  }
}
