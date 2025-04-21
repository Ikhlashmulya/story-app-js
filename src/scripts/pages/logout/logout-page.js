import { clearUserInfo } from "../../utils";

export default class LogoutPage {
  async render() {
    return "";
  }

  async afterRender() {
    clearUserInfo();
    location.hash = "/login";
  }
}
