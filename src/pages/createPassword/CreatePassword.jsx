/* eslint-disable react/no-unescaped-entities */
import LogoImage from "../../assets/images/logo-login.png";
import LoginImage from "../../assets/images/logo-login.webp";
import LeftSidebar from "../../components/leftSideBar/LeftSideBar";

const CreatePassword = () => {
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
                  alt="login logo"
                  className="img-fluid"
                  width="220"
                  height="92"
                />
              </picture>
              <h3>Create New Password</h3>
              <h5><strong>#1</strong> Real Estate Marketplace and CRM connecting <strong>Buyers</strong> and <strong>Sellers</strong></h5>
              <form>
                <div className="row justify-content-center">
                  <div className="col-lg-10">
                    <div className="common-form">
                      <div className="mb-4">
                        <div className="form-floating">
                          <input
                            // type={pwdType}
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            name="NewPassword"
                            // value={userData.NewPassword}
                            // onChange={validatePassword}
                          />
                          {/* <span onClick={togglePassword}>{passwordIcon}</span> */}
                          <label htmlFor="floatingPassword">New Password</label>
                        </div>
                        {/* {errorPassword === "" ? null : (
                          <div className="error">{errorPassword}</div>
                        )} */}
                      </div>

                      <div className="mb-4">
                        <div className="form-floating">
                          <input
                            // type={confirmType}
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            name="ConfirmPassword"
                            // value={userData.ConfirmPassword}
                            // onChange={validateConfirmPassword}
                          />
                          {/* <span onClick={toggleConfirmPassword}>
                            {confirmPwdIcon}
                          </span> */}
                          <label htmlFor="floatingPassword">
                            Re-entered New Password
                          </label>
                        </div>
                        {/* {errorConfirmPwd === "" ? null : (
                          <div className="error">{errorConfirmPwd}</div>
                        )} */}
                      </div>

                      <div className="mt-3">
                        <button
                          type="submit"
                          className="btn btn-common w-100 mb-3"
                          //   onClick={handle_Click}
                        >
                          Change Password
                        </button>
                      </div>
                      <div className="login-signup">
                        <div>
                          Don't have an Account yet?{" "}
                          <a href="./Register">Sign Up</a>
                        </div>
                      </div>
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

export default CreatePassword;
