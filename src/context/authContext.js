import { createContext, useEffect, useMemo, useState } from "react";
// import { useHistory, useLocation } from "react-router-dom";
import { in200s, isNonEmptyString } from "../helpers";
import { authService } from "../services/AuthApi";
import { userService } from "../services/UserService";
import {
  getUserId,
  loadString,
  remove,
  save,
  saveString,
} from "../utils/Storage";

export const AuthContext = createContext({});

export const AuthProvider = (props) => {
  const [loading, setLoading] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [loginUserDetail, setLoginUserDetail] = useState(null);
  const [auth, setAuth] = useState(() => {
    const user = loadString("userDetails");
    const savedToken = loadString("accessToken");

    if (savedToken) {
      try {
        const userDetails = JSON.parse(user);
        const { email, id } = userDetails;
        return {
          token: savedToken,
          isAuthenticated: true,
          message: "",
          userEmail: email,
          userId: id,
        };
      } catch (error) {
        console.error(error);
        return {
          token: "",
          isAuthenticated: false,
          message: "",
          userEmail: "",
          userId: "",
        };
      }
    }
    return {
      token: "",
      isAuthenticated: false,
      message: "",
      userEmail: "",
      userId: "",
    };
  });

  const login = async (data) => {
    setLoading(true);

    const response = await authService.login(data);
    if (
      response &&
      response?.data &&
      isNonEmptyString(response?.data?.accessToken)
    ) {
      // saveString("accessToken", response?.data?.accessToken);

      // if (response?.data?.user_id) {
      //   const userProfile = await userService.getUserProfile(
      //     response?.data?.user_id
      //   );
      //   if (userProfile) {
      //     save("userDetails", userProfile);
      //   } else {
      //     remove("userDetails", userProfile);
      //   }
      // }

      setAuth({
        token: "",
        isAuthenticated: true,
        message: "otp send to your email",
        userEmail: "",
        userId: "",
      });
    } else {
      setAuth({
        token: "",
        isAuthenticated: false,
        message: response?.data?.message,
        userEmail: "",
        userId: "",
      });
      remove("accessToken");
    }
    setLoading(false);
    return response;
  };

  const register = async (data) => {
    setLoading(true);

    const response = await authService.register(data);
    if (
      response &&
      response?.data &&
      isNonEmptyString(response?.data?.accessToken)
    ) {
      // saveString("accessToken", response.data.accessToken);

      // if (response.data.user_id) {
      //   const userProfile = await userService.getUserProfile(
      //     response.data.user_id
      //   );
      //   if (userProfile) {
      //     save("userDetails", userProfile);
      //   } else {
      //     remove("userDetails", userProfile);
      //   }
      // }
      setAuth({
        token: "",
        isAuthenticated: true,
        message: "otp send to your email",
        userEmail: "",
        userId: "",
      });
    } else {
      setAuth({
        token: "",
        isAuthenticated: false,
        message: response?.data?.message,
        userEmail: "",
        userId: "",
      });
      remove("accessToken");
    }
    setLoading(false);
    return response;
  };

  const logout = async () => {
    setAuth({
      token: "",
      isAuthenticated: false,
      message: "",
      userEmail: "",
      userId: "",
    });
    remove("accessToken");
    remove("userDetails");
    const userId = getUserId();
    if (userId) {
      const response = await authService.logout(userId);
      if (response) {
        // console.log(response);
      }
    }
  };
  const resendOtp = async (data) => {
    try {
      const response = await authService.reSendOTP(data);
      if (response?.data?.status === 200) {
        setAuth({
          token: "",
          isAuthenticated: false,
          message: response.data.message,
          userEmail: "",
          userId: "",
        });
        remove("accessToken");
      }
      return response;
    } catch (error) {
      console.error("Error in resendOtp:", error);
      throw error; // Propagate the error up the call stack
    }
  };
  // const verifyOtp = async (data, token) => {

  //   const response = await authService.verifiyOTP(data);
  //   console.log(response);
  //   if (response?.data?.status === 200) {
  //     saveString("accessToken", token);
  //     if (response?.data?.user_id) {
  //       const userProfile = await userService.getUserProfile(
  //         response?.data?.user_id
  //       );
  //       if (userProfile) {
  //         save("userDetails", userProfile);
  //       } else {
  //         remove("userDetails", userProfile);
  //       }
  //       setAuth({
  //         token: token,
  //         isAuthenticated: true,
  //         message: response.data.message,
  //         userEmail: userProfile?.email,
  //         userId: response.data.user_id,
  //       });
  //       console.log("inner success");
  //     }
  //     console.log("success");
  //   } else {
  //     setAuth({
  //       token: "",
  //       isAuthenticated: false,
  //       message: response?.data?.message,
  //       userEmail: "",
  //       userId: "",
  //     });
  //     remove("accessToken");
  //   }
  //   return response
  // };

  const verifyOtp = async (data, token) => {
    console.log("verifyOtp");
    try {
      const response = await authService.verifiyOTP(data); // Corrected typo in function name

      if (in200s(response?.status)) {
        saveString("accessToken", token);
        const resData = response?.data?.result[0].user_id;
        // console.log(resData);

        if (response?.data?.result[0].user_id) {
          const userProfile = await userService.getUserProfile(
            response?.data?.result[0].user_id
          );
          // console.log(userProfile);
          if (userProfile) {
            save("userDetails", userProfile);
          } else {
            remove("userDetails"); // Removed unnecessary parameter
          }

          setAuth({
            token: token,
            isAuthenticated: true,
            message: response.data.message,
            userEmail: userProfile?.email,
            userId: response?.data?.result[0].user_id,
          });

          // console.log("inner success");
        }

        // console.log("success");
      } else {
        setAuth({
          token: "",
          isAuthenticated: false,
          message: response?.data?.message,
          userEmail: "",
          userId: "",
        });

        remove("accessToken");
      }

      return response;
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      throw error; // Propagate the error up the call stack
    }
  };

  const value = useMemo(
    () => ({
      auth,
      setAuth,
      login,
      register,
      logout,
      loading,
      setIsSideBarOpen,
      isSideBarOpen,
      setLoginUserDetail,
      resendOtp,
      verifyOtp,
      loginUserDetail,
    }),
    [
      auth,
      setAuth,
      login,
      register,
      logout,
      loading,
      setIsSideBarOpen,
      isSideBarOpen,
      setLoginUserDetail,
      loginUserDetail,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};
