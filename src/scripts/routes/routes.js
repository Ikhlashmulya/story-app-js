import HomePage from "../pages/home/home-page";
import LoginPage from "../pages/login/login-page";
import RegisterPage from "../pages/register/register-page";
import LogoutPage from "../pages/logout/logout-page";
import StoryDetailPage from "../pages/story-detail/story-detail-page";
import NewPage from "../pages/new/new-page";

const routes = {
  "/": new HomePage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/logout": new LogoutPage(),
  "/story/:id": new StoryDetailPage(),
  "/new": new NewPage(),
};

export default routes;
