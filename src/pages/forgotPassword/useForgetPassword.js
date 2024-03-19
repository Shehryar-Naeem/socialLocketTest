import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { authService } from "../../services/AuthApi";
import Swal from "sweetalert2";
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from "../../components/messageModal/MessageModal";
import { useLocation, useNavigate } from "react-router-dom";
import YupPassword from "yup-password";
YupPassword(Yup);

function useForgetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      secret_answer: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        showLoadingSpinner({});
        let res = await authService.forgetPassword(values);
        const data = res?.data?.result?.[0];
        if (data) {
          navigate("/reset-password", {
            state: {
              data,
            },
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error?.response?.data?.message,
          icon: "error",
        });
      } finally {
        hideLoadingSpinner();
      }
    },
  });

  const resetPasswordFormik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        showLoadingSpinner({});
        let res = await authService.changePassword({
          email: state?.data?.email,

          password: state?.data?.password,
          newPassword: values?.password,
        });

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your password has been successfully changed",
        });
        navigate("/login", {
          replace: true,
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error?.response?.data?.message,
          icon: "error",
        });
      } finally {
        hideLoadingSpinner();
      }
    },
  });
  return { formik, resetPasswordFormik };
}

export default useForgetPassword;
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email field is required")
    .email("Please enter a valid email"),
  secret_answer: Yup.string().required("Secret answer field is required"),
});

const resetPasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password field is required")
    .password()
    .min(
      8,
      "Password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special"
    )
    .minLowercase(1, "Password must contain at least 1 lower case letter")
    .minUppercase(1, "Password must contain at least 1 upper case letter")
    .minNumbers(1, "Password must contain at least 1 number")
    .minSymbols(1, "Password must contain at least 1 special character"),
  confirmPassword: Yup.string()
    .required("Confirm Password field is required")
    .oneOf([Yup.ref("password")], "Password did not match"),
});
