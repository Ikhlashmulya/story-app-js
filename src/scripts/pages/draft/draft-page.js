import Database from "../../data/database";
import DraftPresenter from "./draft-presenter";

export default class DraftPage {
  #presenter;

  async render() {
    return `
      <section class="container">
        <h1>Draft</h1>
        <div id="loading"></div>
        <article id="story-list"></article>
      </section>
      `;
  }

  async afterRender() {
    this.#presenter = new DraftPresenter({
      view: this,
      db: Database,
    });
    this.#presenter.showDraftStories();
  }

  async showDraftStories(stories) {
    const storyList = document.getElementById("story-list");
    storyList.id = "story-list";
    // const storyCards = stories
    //   .map((story) => {
    //     const imgURL = URL.createObjectURL(story.blob);
    //     return `
    //     <a href="#/draft/${story.id}">
    //     <div class="card-content">
    //       <p>${story.description}</p>
    //       <img src="${imgURL}" width="100%" alt="foto" />
    //     </div>
    //   </a>
    //   `;
    //   })
    //   .join("");
    const storyCards = stories.map((story) => {
      const storyCard = document.createElement("story-card-draft");
      story.photoUrl = URL.createObjectURL(story.blob);
      storyCard.setStory(story);
      return storyCard;
    });
    storyList.append(...storyCards);
    // storyList.innerHTML = storyCards;
  }
}
