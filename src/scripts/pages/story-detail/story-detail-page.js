import { parseActivePathname } from "../../routes/url-parser";
import StoryDetailPresenter from "./story-detail-presenter";
import * as StoryAppAPI from "../../data/api";
import { icon, map, marker, tileLayer } from "leaflet";

export default class StoryDetailPage {
  #presenter;
  #map;

  async render() {
    return `
      <section class="container">
        <div id="loading"></div>
        <h2 id="name"></h2>
        <p id="created-at"></p>
        <p id="description"></p>
        <img id="photo" width="100%" />
        <div id="map"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      model: StoryAppAPI,
      view: this,
    });

    this.#presenter.showStoryDetail();
  }

  showStoryDetail(story) {
    if (this.#map) {
      this.#map.remove();
    }

    document.getElementById("name").textContent = story.name;

    const createdAt = document.getElementById("created-at");
    createdAt.textContent = story.createdAt;
    createdAt.style.color = "gray";

    const desc = document.getElementById("description");
    desc.textContent = story.description;
    desc.style.marginTop = "10px";
    desc.style.marginBottom = "10px";

    const photo = document.getElementById("photo");
    photo.src = story.photoUrl;
    photo.alt = `foto ${story.name}`;

    const mapContainer = document.getElementById("map");
    const coor = [parseFloat(story.lat), parseFloat(story.lon)];

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
}
