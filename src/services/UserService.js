import { in200s } from "../helpers";
import { API } from "./ApiClient";

function supportRequest(data) {
  return API.post("support-requests", data)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data;
      }

      return null;
    })
    .catch((error) => error.response);
}
function getUserProfile(userId) {
  return API.get(`users/${userId}`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result[0];
      }
      return null;
    })
    .catch((error) => error.response);
}
function getAllUserProfile() {
  return API.get("users")
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
}
function getUserTypes(userId) {
  return API.get(`user-types/${userId}`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
}

function getAllUserTypes() {
  return API.get(`user-types`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
}

function getUserPosts(userId) {
  return API.get(`users/${userId}/posts?id=1&user_id=13`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data;
      }
      return null;
    })
    .catch((error) => error.response);
}

function getUserAddress(userId) {
  return API.get(`address/${userId}`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data;
      }
      return null;
    })
    .catch((error) => error.response);
}
function getUserMembers(userId) {
  return API.get(`users-members/${userId}`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data.result;
      }
      return null;
    })
    .catch((error) => error.response);
}

function deleteUserMembers({ userId, data }) {
  return API.delete(`users-members/${userId}`, { data })
    .then((response) => {
      if (in200s(response.status)) {
        return response.data.result;
      }
      return null;
    })
    .catch((error) => error.response);
}

const getMessages = ({ data }) => {
  console.log({ data });
  return API.get(
    `messages-participants/${data?.to_user_id}/${data?.from_user_id}`,
    {
      params: {
        ...data,
      },
    }
  )
    .then((response) => {
      if (in200s(response.status)) {
        return response.data.result;
      }
      return null;
    })
    .catch((error) => error.response);
};

const createMessages = ({ data }) =>
  API.post(`messages`, data)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data.result;
      }
      return null;
    })
    .catch((error) => error.response);

export const userService = {
  supportRequest,
  getUserProfile,
  getAllUserProfile,
  getUserTypes,
  getUserPosts,
  getUserAddress,
  getUserMembers,
  deleteUserMembers,
  getMessages,
  createMessages,
  getAllUserTypes,
};
