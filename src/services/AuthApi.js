import { in200s } from "../helpers";
import { API } from "./ApiClient";

function login(data) {
  return API.post("login", data)
    .then((response) => {
      // console.log("response ***** ", response);
      if (in200s(response.status)) {
        // console.log(response.data);
        return response;
      }

      return null;
    })
    .catch((error) => error.response);
}

function register(data) {
  return API.post("register", data)
    .then((response) => {
      if (in200s(response.status)) {
        // console.log(response.data);
        return response;
      }

      return null;
    })
    .catch((error) => error.response);
}

function logout(userId) {
  return API.delete(`logout/${userId}`)
    .then((response) => {
      console.log("response ***** ", response);
      if (in200s(response.status)) {
        // console.log(response.data);
        return response;
      }

      return null;
    })
    .catch((error) => error.response);
}

// export const changePassword = (data) => axiosInstance.post(`reset-password/:email`, data);
function changePassword(data) {
  return API.put("reset-password/:email", data);
}

const forgetPassword = (data) => API.post("forgot-password", data);

const reSendOTP = (data) => API.post("otp-verification", data);

async function verifiyOTP(data) {
  const { user_id, otp } = data;
  try {
    const response = await API.get(`otp-verification/${user_id}/${otp}`);
    return response;
  } catch (e) {
    console.log("error", e.response);
    return e.response;
  }
}



export const authService = {
  login,
  register,
  logout,
  changePassword,
  forgetPassword,
  reSendOTP,
  verifiyOTP,
};
