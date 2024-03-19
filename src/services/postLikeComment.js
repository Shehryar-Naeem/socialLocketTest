import { in200s } from "helpers";
import { API } from "./ApiClient";

const getPostCommentLikesByPostId = ({ postId, userId }) => {
  return API.get(`post-comments/${postId}/${userId}`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
};

const createLikeForAPostComment = (data) =>
  API.post("post-comment-likes", data);

const deletePostLikeComment = (data) =>
  API.delete("post-comment-likes/:id", { data });

export {
  getPostCommentLikesByPostId,
  createLikeForAPostComment,
  deletePostLikeComment,
};
