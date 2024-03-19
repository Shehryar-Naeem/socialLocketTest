import { in200s } from "../helpers";
import { API } from "./ApiClient";

const uploadBannerApi = (data) =>
  API.put(`banner-images/:user_id`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const getBannerImageByUserId = (userId) =>
  API.get(`banner-images/${userId}`).then((response) => {
    if (in200s(response.status)) {
      return response.data?.result;
    }
    return null;
  });

const uploadProfileImageApi = (data) =>
  API.put(`profile-images/:user_id`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      

    },
  });
const getProfileImageByUserId = (userId) =>
  API.get(`profile-images/${userId}`).then((response) => {
    if (in200s(response.status)) {
      return response.data?.result;
    }
    return null;
  });

const uploadFileDocument = (data) =>
  API.post(`files`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const deleteFileDocument = (data) =>
  API.delete(`files/:id`, {
    data,
  });

const getFilesByUserId = (userId) =>
  API.get(`files/${userId}`).then((response) => {
    if (in200s(response.status)) {
      return response.data?.result;
    }

    return null;
  });

const uploadPostImage = (data) =>
  API.post(`images`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const getPostImageByUserId = (userId) =>
  API.get(`images/${userId}`).then((response) => {
    if (in200s(response.status)) {
      return response.data?.result;
    }

    return null;
  });
export {
  uploadBannerApi,
  uploadProfileImageApi,
  uploadFileDocument,
  getFilesByUserId,
  getProfileImageByUserId,
  getBannerImageByUserId,
  uploadPostImage,
  getPostImageByUserId,
  deleteFileDocument,
};
