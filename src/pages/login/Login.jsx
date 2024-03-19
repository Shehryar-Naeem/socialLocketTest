// import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext, useEffect, useState } from "react";
import LogoImage from "../../assets/images/logo-login.png";
import LoginImage from "../../assets/images/logo-login.webp";
import Emaillogo from "../../assets/images/emai-icon.png";
import LeftSidebar from "../../components/leftSideBar/LeftSideBar";
import { AuthContext } from "../../context/authContext";

const schema = yup.object({
  email: yup.string().email().required(),

  password: yup
    .string()
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
      "Password should contains atleast 8 charaters and containing uppercase,lowercase and numbers"
    ),
});

const Login = () => {
  const eye = <FontAwesomeIcon icon={faEye} />;
  const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
  const [passwordShown, setPasswordShown] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const value = useContext(AuthContext);
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

  useEffect(() => {
    if (auth?.isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [auth?.isAuthenticated]);
  useEffect(() => {
    let res = localStorage.getItem("password_social_locket");
    let data = res ? JSON.parse(res) : undefined;
    if (data) {
      setValue("email", data.email);
      setValue("password", data.password);
    }
  }, []);

  const onSubmit = async (data) => {
    localStorage.setItem("password_social_locket", JSON.stringify(data));

    const response = await value?.login(data);

    if (response && response?.data?.accessToken) {
      const userId = response?.data?.user_id;
      navigate(`/otp-verification/${userId}/${response?.data?.accessToken}`, {
        state: { accessToken: response?.data?.accessToken },
      });
    }
    setValue("email", "");
    setValue("password", "");
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
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
                    {errors?.email?.message ? (
                      <div className="alert alert-danger" role="alert">
                        {errors?.email?.message}
                      </div>
                    ) : (
                      ""
                    )}
                    <div id="email_id">
                      {/* <div className="text-end mb-1 login-mobile"><a href="#">Login with mobile no.</a></div> */}
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          id="floatingInput"
                          placeholder="test@gmail.com"
                          {...register("email")}
                        />
                        <span>
                          <img
                            src={Emaillogo}
                            srcSet={Emaillogo}
                            alt="email"
                            width="16"
                            height="16"
                          />
                        </span>
                        <label htmlFor="floatingInput">Email ID</label>
                      </div>
                    </div>
                    {/* <div id="mobile_no">
                                      <div className="text-end mb-1 login-email"><a href="#">Login with Email</a></div>
                                      <div className="form-floating mb-3">
                                            <input type="text" className="form-control" id="floatingInput" placeholder="9876543210">
                                            <span><img src="assets/images/emai-icon.png" alt="email" width="16" height="16"></span>
                                            <label for="floatingInput">Mobile No.</label>
                                      </div>
                                  </div> */}
                    <div className="form-floating mb-3">
                      <input
                        type={passwordShown ? "text" : "password"}
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        {...register("password")}
                      />
                      <span
                        role="button"
                        aria-hidden="true"
                        onClick={togglePasswordVisibility}
                      >
                        {passwordShown ? eye : eyeSlash}
                      </span>
                      <label htmlFor="floatingPassword">Password</label>
                      {errors.password?.message ? (
                        <div className="alert alert-danger" role="alert">
                          {errors?.password?.message}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="flexCheckChecked"
                          value={isRememberMe}
                          onChange={() => setIsRememberMe((prev) => !prev)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckChecked"
                        >
                          Remember me
                        </label>
                      </div>
                      <div className="recovery-pass">
                        <Link to="/forgot-password">Recovery Password</Link>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        type="submit"
                        className="btn btn-common w-100 mb-3"
                      >
                        Login
                      </button>
                    </div>
                    <div className="login-signup">
                      <p>
                        Don&#39;t have an Account yet?{" "}
                        <Link to="/Register">Sign Up</Link>
                      </p>
                    </div>
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

export default Login;
