import axios from "axios";
import { loadString } from "../utils/Storage";
const API_URL = process.env.REACT_APP_URL;
const G_URL = process.env.GAPI_URL;
const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  // timeout: 3000,
  responseType: "json",
});
// Add a request interceptor
API.interceptors.request.use(
  (request) => {
    const token = loadString("accessToken");
    if (request.headers)
      if (token) request.headers.Authorization = `Bearer ${token}`;

    return request;
    // Do something before request is sent
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
const GAPI = axios.create({
  baseURL: G_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  responseType: "json",
});

GAPI.interceptors.request.use(
  (req) => {
    // Do something before request is sent
    return req;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export { API, GAPI };
