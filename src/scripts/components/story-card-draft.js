class StoryCardDraft extends HTMLElement {
  #shadowRoot = null;
  #style = null;
  #story = null;

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: "open" });
    this.#style = document.createElement("style");
  }

  setStory(story) {
    this.#story = story;
  }

  #updateStyle() {
    this.#style.textContent = `
      :host {
        display: block;
        margin: 1rem;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-sizing: border-box;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }

      :host(:hover) {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      }

      a {
        display: block;
        text-decoration: none;
        color: inherit;
        padding: 16px;
        border-radius: 12px;
        transition: box-shadow 0.2s ease;
      }

      a:focus {
        outline: none;
        border: 2px solid #6495ed; 
      }
      
      .card-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      h3 {
        margin: 0;
        font-size: 1.25rem;
      }

      p {
        margin: 0;
        color: #555;
        font-size: 0.95rem;
        line-height: 1.4;
      }

      .created-at {
        font-size: 0.8rem;
        color: #888;
        font-style: italic;
        margin-bottom: 8px;
      }
    `;
  }

  #emptyContent() {
    this.#shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.#story) return;

    this.#emptyContent();
    this.#updateStyle();
    this.#shadowRoot.appendChild(this.#style);
    this.#shadowRoot.innerHTML += `
      <a href="#/draft/${this.#story.id}">
        <div class="card-content">
          <h3>Anda</h3>
          <p>${this.#story.description}</p>
          <img src="${this.#story.photoUrl}" width="100%" alt="foto anda" />
        </div>
      </a>
    `;
  }
}

customElements.define("story-card-draft", StoryCardDraft);

