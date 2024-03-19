import { in200s } from "../helpers";
import { API } from "./ApiClient";

const getOfferByPostId = (postId) => {
  return API.get(`offers/${postId}`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
};
const getOfferFromUserId = (userId) => {
  return API.get(`offers/sent/${userId}`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
};

const createPostOffer = (data) => API.post("offers", data);

const updatePostOffer = (data) => API.put(`offers/:id`, data);

export {
  createPostOffer,
  getOfferByPostId,
  getOfferFromUserId,
  updatePostOffer,
};
