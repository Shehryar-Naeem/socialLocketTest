import { in200s } from "../helpers";
import { API } from "./ApiClient";

const getPostDocumentListByPostId = (postId) =>
  API.get(`documents/tab/${postId}`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
const createPostDocument = (data) =>
  API.post(`documents`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const updatePostDocument = (data) =>
  API.put(`documents/:id`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
const deletePostDocument = (data) =>
  API.delete(`documents/${data?.id}`, {
    data,
  });
export {
  getPostDocumentListByPostId,
  createPostDocument,
  updatePostDocument,
  deletePostDocument,
};
