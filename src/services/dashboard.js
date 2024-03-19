import { in200s } from "../helpers";
import { API } from "./ApiClient";

export const getDashboardByStatus = ({ userId, status }) => {
  return API.get(`dashboards/${userId}/${status}`)
    .then((response) => {
      if (in200s(response.status)) {
        // console.log(response.data);
        return response.data?.result;
      }

      return null;
    })
    .catch((error) => error.response);
};

export const getDashboardByUserId = ({ userId }) => {
  return API.get(`dashboards/${userId}`)
    .then((response) => {
      if (in200s(response.status)) {
        // console.log(response.data);
        return response.data?.result;
      }

      return null;
    })
    .catch((error) => error.response);
};
