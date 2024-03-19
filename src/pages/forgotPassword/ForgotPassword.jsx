/* eslint-disable react/no-unescaped-entities */
import LogoImage from "../../assets/images/logo-login.png";
import LoginImage from "../../assets/images/logo-login.webp";
import LeftSidebar from "../../components/leftSideBar/LeftSideBar";
import Emaillogo from "../../assets/images/emai-icon.png";
import { Link, useLocation } from "react-router-dom";
import useForgetPassword from "./useForgetPassword";
import { useEffect } from "react";

const ForgotPassword = () => {
  const {
    formik: {
      values: { email, secret_answer },
      handleChange,
      handleBlur,
      errors,
      touched,
      handleSubmit,
    },
    resetPasswordFormik: {
      values: { password, confirmPassword },
      handleChange: passwordHandleChange,
      handleBlur: passwordHandleBlur,
      errors: passwordErrors,
      touched: passwordTouched,
      handleSubmit: passwordHandleSubmit,
    },
  } = useForgetPassword();
  const { state } = useLocation();
  const isResetPassword = state?.data;

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
                  srcSet="assets/images/logo.png"
                  alt="login-logo"
                  className="img-fluid"
                  width="220"
                  height="92"
                />
              </picture>
              <h3>
                {isResetPassword
                  ? "Change your password"
                  : "Recover your password"}
              </h3>
              <h5><strong>#1</strong> Real Estate Marketplace and CRM connecting <strong>Buyers</strong> and <strong>Sellers</strong></h5>
              {/* {message ? (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Password Reset Link Sent Successfully in your Email
                </p>
              ) : (
                ""
              )} */}
              {/* <!--  fake fields are a workaround for chrome/opera autofill getting the wrong fields --> */}

              <form autoComplete="off">
                <div className="row justify-content-center">
                  <div className="col-lg-10">
                    {isResetPassword ? (
                      <div className="common-form">
                        <div className="mb-4">
                          <div className="form-floating">
                            {/* <input
                              id="username"
                              style={{ display: "none" }}
                              type="password"
                              name="fakeusernameremembered"
                            />
                            <input
                              id="password"
                              style={{ display: "none" }}
                              type="password"
                              name="fakepasswordremembered"
                            /> */}
                            <input
                              type="password"
                              className={"form-control"}
                              id="floatingInput"
                              placeholder="test@gmail.com"
                              name="password"
                              value={password}
                              onChange={passwordHandleChange}
                              handleBlur={passwordHandleBlur}
                              autoComplete="none"
                            />
                            {/* <span>
                          <img
                            src={Emaillogo}
                            alt="email"
                            width="16"
                            height="16"
                          />
                        </span> */}
                            <label htmlFor="floatingInput">Password</label>
                          </div>

                          <div className="error">
                            {passwordTouched?.password &&
                              passwordErrors.password}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="form-floating">
                            <input
                              type="password"
                              // className="form-control"
                              className={"form-control"}
                              id="floatingInput"
                              placeholder="test@gmail.com"
                              name="confirmPassword"
                              value={confirmPassword}
                              onChange={passwordHandleChange("confirmPassword")}
                              handleBlur={passwordHandleBlur("confirmPassword")}
                              autoComplete="none"
                            />
                            {/* <span>
                          <img
                            src={Emaillogo}
                            alt="email"
                            width="16"
                            height="16"
                          />
                        </span> */}
                            <label htmlFor="floatingInput">
                              Confirm Password
                            </label>
                          </div>
                          {
                            <div className="error">
                              {passwordTouched?.confirmPassword &&
                                passwordErrors.confirmPassword}
                            </div>
                          }
                        </div>

                        <div className="mt-3">
                          {/* data-bs-toggle="modal" data-bs-target="#changepass" */}
                          <button
                            type="button"
                            className="btn btn-common w-100 mb-3"
                            onClick={passwordHandleSubmit}
                          >
                            Reset Password
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="common-form">
                        <div className="mb-4">
                          <div className="form-floating">
                            <input
                              type="email"
                              className={"form-control"}
                              id="floatingInput"
                              placeholder="test@gmail.com"
                              name="email"
                              value={email}
                              onChange={handleChange}
                              handleBlur={handleBlur}
                            />
                            <span>
                              <img
                                src={Emaillogo}
                                alt="email"
                                width="16"
                                height="16"
                              />
                            </span>
                            <label htmlFor="floatingInput">Email ID</label>
                          </div>
                          {errors?.email && (
                            <div className="error">{errors?.email}</div>
                          )}
                        </div>

                        <div className="mb-4">
                          <div className="form-floating">
                            <input
                              type="text"
                              // className="form-control"
                              className={"form-control"}
                              id="floatingInput"
                              placeholder="test@gmail.com"
                              name="secret_answer"
                              value={secret_answer}
                              onChange={handleChange("secret_answer")}
                              handleBlur={handleBlur("secret_answer")}
                            />
                            <span>
                              <img
                                src={Emaillogo}
                                alt="email"
                                width="16"
                                height="16"
                              />
                            </span>
                            <label htmlFor="floatingInput">Secret Answer</label>
                          </div>
                          {
                            <div className="error">
                              {touched?.secret_answer && errors.secret_answer}
                            </div>
                          }
                        </div>

                        <div className="mt-3">
                          {/* data-bs-toggle="modal" data-bs-target="#changepass" */}
                          <button
                            type="button"
                            className="btn btn-common w-100 mb-3"
                            onClick={handleSubmit}
                          >
                            Recover Password
                          </button>
                        </div>
                        <div className="login-signup">
                          <div>
                            Don't have an Account yet?{" "}
                            <Link to="/register">Sign Up</Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
          <LeftSidebar />
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
