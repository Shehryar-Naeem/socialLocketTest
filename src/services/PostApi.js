import { in200s } from "../helpers";
import { API } from "./ApiClient";

export const updatePost = (data) => API.put(`posts/:id`, data);
export const deletePost = (data) => API.delete(`posts/${data?.id}`, { data });

function getPosts(page, limit) {
  return API.get(`posts?page=${page}&limit=${limit}`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
}
function getPostsById(id) {
  return API.get(`posts/${id}`)
    .then((response) => {
      if (in200s(response.status)) {
        // console.log(response.data);
        return response?.data?.result;
      }

      return null;
    })
    .catch((error) => error.response);
}

function getAllPostComments() {
  return API.get("post-comments")
    .then((response) => {
      if (in200s(response.status)) {
        return response.data;
      }
      return null;
    })
    .catch((error) => error.response);
}

function getCommentsById(post_id) {
  return API.get(`post-comments/${post_id}/all`)
    .then((response) => {
      if (in200s(response.status)) {
        // console.log(response.data);
        return response?.data;
      }

      return null;
    })
    .catch((error) => error.response);
}
// http://ec2-52-56-131-124.eu-west-2.compute.amazonaws.com/api/v1/posts/:id
export const postsService = {
  getPosts,
  getPostsById,
  getAllPostComments,
  getCommentsById,
};
