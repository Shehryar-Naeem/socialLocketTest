import React from "react";
import "./changePassword.css";
import useChangePassword from "./useChangePassword";

function ChangePassword({ preloadedValues }) {
  const {
    formik: {
      values: { password, newPassword, confirmPassword },
      errors,
      handleChange,
      setFieldValue,
      touched,
      handleBlur,
      handleSubmit,
    },
  } = useChangePassword(preloadedValues);
  return (
    <>
      <h3 className="mb-4">Change Password</h3>

      {/*  */}
      <div className="col-md-12">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="form-control"
          onChange={handleChange("password")}
          onBlur={handleBlur("password")}
          value={password}
        />
        <p style={{ color: "red", fontSize: 12 }}>
          {touched?.password && errors.password}
        </p>
      </div>
      <div className="col-md-12">
        <label htmlFor="newPassword" className="form-label">
          New Password
        </label>
        <input
          name="newPassword"
          id="newPassword"
          className="form-control"
          onChange={handleChange("newPassword")}
          onBlur={handleBlur("newPassword")}
          value={newPassword}
          type="password"
        />
        <p style={{ color: "red", fontSize: 12 }}>
          {touched?.newPassword && errors.newPassword}
        </p>
      </div>

      <div className="col-md-12">
        <label htmlFor="newPassword" className="form-label">
          Confirm Password
        </label>
        <input
          name="confirmPassword"
          id="confirmPassword"
          className="form-control"
          onChange={handleChange("confirmPassword")}
          onBlur={handleBlur("confirmPassword")}
          value={confirmPassword}
          type="password"
        />
        <p style={{ color: "red", fontSize: 12 }}>
          {touched?.confirmPassword && errors.confirmPassword}
        </p>
      </div>

      <div>
        <button
          type="button"
          className="btn btn-common"
          // onClick={() => handleSubmit}
          onClick={handleSubmit}
          style={{ marginBottom: 30 }}
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default ChangePassword;
