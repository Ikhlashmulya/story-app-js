import { icon, map, marker, tileLayer } from "leaflet";
import { Camera } from "../../utils/camera";
import NewPresenter from "./new-presenter";
import * as StoryAppAPI from "../../data/api";

export default class NewPage {
  #camera = null;
  #takenPicture;
  #map;
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <form id="new-form">
          <div id="camera">
            <button id="take-photo" class="btn" type="button" disabled>
              Ambil Gambar
            </button>
            <button id="open-camera" class="btn" type="button">
              Buka Kamera
            </button>
            <div class="camera-container">
              <video id="camera-video" class="form-camera">
                Video stream not available.
              </video>

              <img class="form-camera" id="preview-photo" />
            </div>
            <canvas id="camera-canvas" style="display: none"></canvas>
          </div>
          <div>
            <label label="description">Deskripsi</label> <br />
            <textarea name="description" id="description"></textarea>
          </div>
          <div id="map" class="map"></div>
          <input name="lat-input" id="lat-input" hidden />
          <input name="lon-input" id="lon-input" hidden />
          <button type="submit" class="btn">Add Story</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.#setupCamera();
    this.#setupMap();
    this.#presenter = new NewPresenter({ model: StoryAppAPI, view: this });
    this.#addSubmitListener();
  }

  #addSubmitListener() {
    const form = document.getElementById("new-form");
    const latInput = document.getElementById("lat-input");
    const lonInput = document.getElementById("lon-input");
    const description = document.getElementById("description");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.#presenter.addStory({
        blob: this.#takenPicture,
        description: description.value,
        lon: lonInput.value,
        lat: latInput.value,
      });
    });
  }

  #setupCamera() {
    const button = document.getElementById("open-camera");
    const container = document.querySelector(".camera-container");
    const videoElement = document.getElementById("camera-video");
    const canvasElement = document.getElementById("camera-canvas");
    const takePhoto = document.getElementById("take-photo");

    this.#camera = new Camera({ video: videoElement, canvas: canvasElement });

    let isCameraOpen = false;

    button.addEventListener("click", async () => {
      if (!isCameraOpen) {
        await this.#camera.launch();
        isCameraOpen = true;
        container.classList.toggle("open");
        button.textContent = "Tutup Kamera";
        takePhoto.disabled = false;
      } else {
        this.#camera.stop();
        isCameraOpen = false;
        container.classList.toggle("open");
        button.textContent = "Buka Kamera";
        takePhoto.disabled = true;
      }
    });

    const previewPhoto = document.getElementById("preview-photo");

    takePhoto.addEventListener("click", async () => {
      const blob = await this.#camera.takePicture();
      this.#takenPicture = blob;
      previewPhoto.src = URL.createObjectURL(blob);
    });
  }

  #setupMap() {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung geolocation.");
    }

    const mapContainer = document.getElementById("map");
    const latInput = document.getElementById("lat-input");
    const lonInput = document.getElementById("lon-input");

    let leafletMarker;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      latInput.value = latitude;
      lonInput.value = longitude;

      this.#map = map(mapContainer, {
        center: [latitude, longitude],
        zoom: 10,
      });

      tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
      }).addTo(this.#map);

      leafletMarker = marker([latitude, longitude], {
        icon: icon({
          iconUrl: "/images/location.png",
          iconSize: [38, 38],
          iconAnchor: [22, 32],
          popupAnchor: [-2, -76],
        }),
      }).addTo(this.#map);

      this.#map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        leafletMarker.setLatLng([lat, lng]);
        latInput.value = lat;
        lonInput.value = lng;
      });
    });
  }

  onSuccess() {
    location.hash = "/";
  }

  onFailed(message) {
    alert(message);
  }
}
