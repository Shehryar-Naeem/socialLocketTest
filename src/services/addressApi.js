import { in200s } from "../helpers";
import { API } from "./ApiClient";

export const createAddress = (data) => API.post("address", data);
export const createUserAddress = (data) => API.post("users-address", data);
export const updateAddress = (id, data) => API.put(`address/:id`, data);
export const getAddressByUserId = (userId) => {
  return API.get(`address/${userId}`)
    .then((response) => {
      if (in200s(response.status)) {
        // console.log(response.data);
        return response.data?.result;
      }

      return null;
    })
    .catch((error) => error.response);
};

export function getUserAddressById({ userId }) {
  return API.get(`users-address/${userId}`)
    .then((response) => {
      if (in200s(response.status)) {
        // console.log(response.data);
        return response.data?.result;
      }

      return null;
    })
    .catch((error) => error.response);
}

export const deleteAddress = (id, data) =>
  API.delete(`address/:${id}`, {
    data: data,
  });

//change address status
export const addressStatusChange = (id, data) =>
  API.put(`users-address/:${id}`, data);
// API.put(`users-address/:${id}`, {
//   data: data,
// });
// Create Address

// {
//    "unit_number": "qwerty 26-05-2023",
//   "street_number": "Mubmai",
//   "address_line_1": "Some Rd Name",
//   "address_line_2": "address Line",
//   "city": "Florida",
//   "region": "",
//   "postal_code": "32007",
//   "country_id": 226,
//   "post_id": null,
//   "user_id": 36,
//   "created": "2023-03-28T14:16:12.000Z",
//   "longitude": null,
//   "latitude": null
// }

// Update Address
// {
//   "id": 1,
//   "unit_number": "qwerty 26-05-2023",
//   "street_number": "Mubmai",
//   "address_line_1": "Some Rd Name",
//   "address_line_2": "address Line",
//   "city": "Florida",
//   "region": "",
//   "postal_code": "32007",
//   "country_id": 226,
//   "post_id": null,
//   "user_id": null,
//   "created": "2023-03-28T14:16:12.000Z",
//   "longitude": null,
//   "latitude": null
// }
