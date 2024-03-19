// import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext, useEffect, useState } from "react";
import LogoImage from "../../assets/images/logo-login.png";
import LoginImage from "../../assets/images/logo-login.webp";
import LeftSidebar from "../../components/leftSideBar/LeftSideBar";
import { AuthContext } from "../../context/authContext";
import OtpInput from "react-otp-input";
import { in200s } from "helpers";

const schema = yup.object({
  otp: yup.string().required("Otp incomplete").length(6, "OTP must be exactly 6 characters"),
});
const OTP = () => {
  const value = useContext(AuthContext);
  const { user_id, token } = useParams();
  const [countdown, setCountdown] = useState(300);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const auth = value?.auth;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [otp, setOtp] = useState("");

  // console.log(otp);

  // useEffect(() => {
  //   if (auth?.isAuthenticated === false) {
  //     console.log("called", auth?.isAuthenticated);
  //     navigate("/");
  //   }
  // }, [auth?.isAuthenticated]);
  useEffect(() => {
    // Set the "otp" field value in the form when the OTP state changes
    setValue("otp", otp);
  }, [otp, setValue]);
  const resendOtp = async () => {
    try {
      const response = await value?.resendOtp({ user_id });

      if (in200s(response?.status)) {
        setCountdown(300);
        console.log("Resend OTP response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onSubmit = async (data) => {
    console.log(user_id);

    try {
      const validatedOtp = data.otp;

      const otpData = {
        user_id: user_id,
        otp: data.otp,
      };

    
      const response = await value?.verifyOtp(otpData, token);
      if (in200s(response?.status)) {
        setValue("otp", "");
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOtpChange = (otpValue) => {
    // Ensure only digits are kept in the OTP value
    const sanitizedValue = otpValue.replace(/\D/g, "");

    // If the length is greater than the desired length, trim it
    const trimmedValue = sanitizedValue.slice(0, 6);

    setOtp(trimmedValue);
  };

  return (
    <section className="main main-login">
      <div className="container">
        <div className="row flex-row-reverse">
          <div className="col-lg-6 m-auto">
            <div className="login mob main-right mx-4">
              <picture>
                <source srcSet={LoginImage} type="image/webp" />
                <source srcSet={LogoImage} type="image/png" />
                <img
                  loading="lazy"
                  src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                  data-src="assets/images/logo-login.png"
                  alt="login logo"
                  className="img-fluid"
                  width={220}
                  height={92}
                />
              </picture>
              <h3>Hello Again!</h3>
              <h5>
                <strong>#1</strong> Real Estate Marketplace and CRM connecting{" "}
                <strong>Buyers</strong> and <strong>Sellers</strong>
              </h5>
              {value?.auth?.message ? (
                <div className="alert alert-danger" role="alert">
                  {value?.auth?.message}
                </div>
              ) : null}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row justify-content-center">
                  <div className="col-lg-10">
                    {errors?.otp?.message && (
                      <div className="alert alert-danger" role="alert">
                        {errors?.otp?.message}
                      </div>
                    )}

                    <div
                      id="otp"
                      class="inputs d-flex flex-row justify-content-center flex-wrap mt-2"
                    >
                      <OtpInput
                        containerStyle="container"
                        value={otp}
                        onChange={handleOtpChange}
                        numInputs={6}
                        placeholder="000000"
                        inputStyle="m-sm-2 m-0 p-md-2 p-1 text-center form-control rounded"
                        skipDefaultStyles={true}
                        shouldAutoFocus={true}
                        renderSeparator={<span className="seperator">-</span>}
                        renderInput={(props, index) => (
                          // <input {...props} />
                          <input
                            {...register("otp")}
                            {...props}
                            // Add any additional props or styles if needed
                          />
                        )}
                      />
                    </div>
                    <div className="mt-3">
                      <button
                        type="submit"
                        className="btn btn-common w-100 mb-3 text-uppercase"
                      >
                        validate
                      </button>
                    </div>
                    <div className="timer">
                      {countdown > 0 ? (
                        <p>
                          Time left: {Math.floor(countdown / 60)}:
                          {countdown % 60}
                        </p>
                      ) : (
                        <p>OTP has expired. Please request a new one.</p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
              <div className="login-signup">
                <p>
                  Didn't get the code{" "}
                  <button className="resend" onClick={resendOtp}>
                    Resend
                  </button>
                </p>
              </div>
            </div>
          </div>
          <LeftSidebar />
        </div>
      </div>
    </section>
  );
};

export default OTP;
