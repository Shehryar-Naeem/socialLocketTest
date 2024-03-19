import { in200s } from "../helpers";
import { API } from "./ApiClient";

export const getAllPostGroup = () => {
  return API.get("posts-group")
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
};

export const createPostGroup = (data) => API.post("posts-group", data);

// export const groupMembers = () => {
//   return API.get("posts-group")
//     .then((response) => {
//       if (in200s(response.status)) {
//         return response.data?.result;
//       }
//       return null;
//     })
//     .catch((error) => error.response);
// };

export const addGroupMember = (data) => API.post("posts-group-members", data);

export const removeGroupMember = (data) =>
  API.delete(`posts-group-members/:id`, {
    data: data,
  });

export const getGroupMembersByPostId = ({ postId }) => {
  return API.get(`posts-group-members/${postId}`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
};

export const createPostGroupAdmin = (data) =>
  API.post("posts-group-admins", data);

export const getPostGroupAdmins = ({ groupId }) => {
  return API.get(`posts-group-admins/${groupId}`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
};

export const deletePostGroupAdmin = (data) =>
  API.delete(`posts-group-admins/:id`, {
    data: data,
  });

export const createPostRequest = (data) => API.post(`user-requests`, data);

export const getRequestFromUserID = ({ fromUserId }) => {
  return API.get(`user-requests/sent/${fromUserId}`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
};

export const getRequestToUserID = ({ toUserId }) => {
  return API.get(`user-requests/received/${toUserId}`)
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
};

export const updateUserRequest = (data) => API.put(`user-requests/:id`, data);
