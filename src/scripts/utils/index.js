export function showFormattedDate(date, locale = "en-US", options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function setUserInfo(data) {
  localStorage.setItem("userId", data.userId);
  localStorage.setItem("name", data.name);
  localStorage.setItem("token", data.token);
}

export function getUserInfo() {
  return {
    userId: localStorage.getItem("userId"),
    name: localStorage.getItem("name"),
  };
}

export function clearUserInfo() {
  localStorage.removeItem("userId");
  localStorage.removeItem("name");
  localStorage.removeItem("token");
}

export function viewTransition(callback) {
  if (document.startViewTransition) {
    document.startViewTransition(callback);
  } else {
    callback();
  }
}
