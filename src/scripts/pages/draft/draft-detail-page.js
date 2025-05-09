import { icon, map, marker, tileLayer } from "leaflet";
import Database from "../../data/database";
import DraftPresenter from "./draft-presenter";
import * as StoryAppAPI from "../../data/api";

export default class DraftDetailPage {
  #presenter;
  #map;

  async render() {
    return `
      <section class="container">
        <h2>Draft anda</h2>
        <p id="description"></p>
        <img id="photo" width="100%" />
        <div id="map"></div>
        <br />
        <button class="btn" id="publish-draft">Publish</button>
        <button class="btn-danger" id="delete-draft">Delete</button>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new DraftPresenter({
      db: Database,
      view: this,
      model: StoryAppAPI,
    });
    this.#presenter.showDraftDetail();
    this.#publishDraftListener();
    this.#deleteDraftListener();
  }

  showDraftDetail(story) {
    document.getElementById("description").innerText = story.description;
    document.getElementById("photo").src = story.photoUrl;

    const coor = [parseFloat(story.lat), parseFloat(story.lon)];
    const mapContainer = document.getElementById("map");

    this.#map = map(mapContainer, {
      center: coor,
      zoom: 10,
    });

    tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
    }).addTo(this.#map);

    marker(coor, {
      icon: icon({
        iconUrl: "/images/location.png",
        iconSize: [38, 38],
        iconAnchor: [22, 72],
        popupAnchor: [-2, -76],
      }),
    })
      .addTo(this.#map)
      .bindPopup(
        `lokasi ${story.name} <br /> long : ${story.lon} lat : ${story.lat}`
      )
      .openPopup();
  }

  #publishDraftListener() {
    const publishButton = document.getElementById("publish-draft");
    publishButton.addEventListener("click", () => {
      this.#presenter.publishDraft();
    });
  }

  #deleteDraftListener() {
    const deleteButton = document.getElementById("delete-draft");
    deleteButton.addEventListener("click", () => {
      this.#presenter.deleteDraft();
    });
  }
}
