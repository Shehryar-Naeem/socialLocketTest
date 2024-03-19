import { in200s } from "../helpers";
import { API } from "./ApiClient";

function GetUsers(page, limit) {
  return API.get(`search/tabs/users?page=${page}&limit=${limit}`)
    .then((response) => {
      if (in200s(response.status)) {
        console.log(response.data?.result);
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
}

function GetUserAddress() {
  return API.get("search/tabs/usersaddress")
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
}

async function GetPosts(page, limit) {
  console.log("GetPosts", page, limit);
  return await API.get(`search/tabs/posts?page=${page}&limit=${limit}`)


    .then((response) => {
      if (in200s(response.status)) {
        console.log(response.data);
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
}

export const searchService = {
  GetUsers,
  GetPosts,
  GetUserAddress,
};
