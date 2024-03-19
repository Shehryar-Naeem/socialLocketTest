import { in200s } from "../helpers";
import { API } from "./ApiClient";

export const createAddress = (data) => API.post("address", data);

export function getTotalUserList() {
  return API.get(`users`)
    .then((response) => {
      if (in200s(response.status)) {
        // console.log(response.data);
        return response.data?.result;
      }

      return null;
    })
    .catch((error) => error.response);
}

export function getCommentsList(user_id) {
  return API.get(`/comments/${user_id}`)
    .then((response) => {
      if (in200s(response.status)) {
        // console.log(response.data);
        return response.data?.result;
      }

      return null;
    })
    .catch((error) => error.response);
}

export function getLikesList(user_id) {
  return API.get(`/likes/tab/posts/${user_id}`)
    .then((response) => {
      if (in200s(response.status)) {
        // console.log(response.data);
        return response.data?.result;
      }

      return null;
    })
    .catch((error) => error.response);
}

export function getNotificationList() {
  return API.get(`/notifications`)
    .then((response) => {
      if (in200s(response.status)) {
        // console.log(response.data);
        return response.data?.result;
      }

      return null;
    })
    .catch((error) => error.response);
}

export function getNotificationById({ userId }) {
  return API.get(`notifications/${userId}`)
    .then((response) => {
      if (in200s(response.status)) {
        // console.log(response.data);
        return response.data?.result;
      }

      return null;
    })
    .catch((error) => error.response);
}

export function getGeneralNotificationById({ userId }) {
  return API.get(`general-notifications/`)
    .then((response) => {
      if (in200s(response.status)) {
        // console.log(response.data);
        return response.data?.result;
      }

      return null;
    })
    .catch((error) => error.response);
}
