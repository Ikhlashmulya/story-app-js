export class Camera {
  #videoElement;
  #canvasElement;
  #currentStream;
  #streaming;

  static addNewStream(stream) {
    if (!Array.isArray(window.currentStreams)) {
      window.currentStreams = [stream];
      return;
    }
    window.currentStreams = [...window.currentStreams, stream];
  }

  static stopAllStreams() {
    if (!Array.isArray(window.currentStreams)) {
      window.currentStreams = [];
      return;
    }
    window.currentStreams.forEach((stream) => {
      if (stream.active) {
        stream.getTracks().forEach((track) => track.stop());
      }
    });
  }

  constructor({ video, canvas }) {
    this.#videoElement = video;
    this.#canvasElement = canvas;
    this.#initialListener();
  }

  #initialListener() {
    this.#videoElement.oncanplay = () => {
      if (this.#streaming) {
        return;
      }

      this.#streaming = true;
    };
  }

  async #getStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          aspectRatio: 4 / 3,
        },
      });

      return stream;
    } catch (error) {
      console.error("#getStream: error:", error);
      return null;
    }
  }

  async launch() {
    this.#currentStream = await this.#getStream();

    Camera.addNewStream(this.#currentStream);

    this.#videoElement.srcObject = this.#currentStream;
    this.#videoElement.play();
  }

  stop() {
    if (this.#videoElement) {
      this.#videoElement.srcObject = null;
      this.#streaming = false;
    }

    if (this.#currentStream instanceof MediaStream) {
      this.#currentStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  async takePicture() {
    const context = this.#canvasElement.getContext("2d");
    this.#canvasElement.width = this.#videoElement.videoWidth;
    this.#canvasElement.height = this.#videoElement.videoHeight;
    context.drawImage(
      this.#videoElement,
      0,
      0,
      this.#canvasElement.width,
      this.#canvasElement.height
    );
    return new Promise((resolve) => {
      this.#canvasElement.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  }
}
