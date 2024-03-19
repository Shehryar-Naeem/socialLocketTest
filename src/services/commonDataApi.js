import { in200s } from "../helpers";
import { API } from "./ApiClient";
// type = "user-types-list" | "inventory" | "bedrooms"
function getUserTypeList(type) {
  return API.get("user-types-list")
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
}
function getInventory() {
  return API.get("inventory")
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
}
function getBedrooms() {
  return API.get("bedrooms")
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
}
function getCurrency() {
  return API.get("currency")
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
}
export { getUserTypeList, getInventory, getBedrooms, getCurrency };
