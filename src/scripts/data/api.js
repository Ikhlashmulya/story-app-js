import CONFIG from "../config";
import { getToken } from "../utils";

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GETSTORIES: `${CONFIG.BASE_URL}/stories?location=1`,
  GETSTORYDETAIL: `${CONFIG.BASE_URL}/stories/`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export async function getStories(token) {
  const fetchResponse = await fetch(ENDPOINTS.GETSTORIES, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await fetchResponse.json();
}

export async function getStoryDetail(id, token) {
  const fetchResponse = await fetch(ENDPOINTS.GETSTORYDETAIL + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await fetchResponse.json();
}

export async function registerUser(data) {
  const body = JSON.stringify(data);

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body,
  });
  return await fetchResponse.json();
}

export async function loginUser(data) {
  const body = JSON.stringify(data);

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body,
  });
  return await fetchResponse.json();
}

export async function addStory(token, data) {
  const formData = new FormData();
  formData.append("description", data.description);
  formData.append("lat", data.lat);
  formData.append("lon", data.lon);
  formData.append("photo", data.blob, "photo.jpg");

  const fetchResponse = await fetch(`${CONFIG.BASE_URL}/stories`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await fetchResponse.json();
}

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const accessToken = getToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = getToken();
  const data = JSON.stringify({
    endpoint,
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
