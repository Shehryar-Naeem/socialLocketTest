import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useContext, useEffect, useState } from "react";
import { authService } from "../../../../services/AuthApi";
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from "../../../../components/messageModal/MessageModal";
import { AuthContext } from "../../../../context/authContext";
import { useQueryClient } from "react-query";
import Swal from "sweetalert2";
import YupPassword from "yup-password";
YupPassword(Yup);
export default function useChangePassword(preloadedValues) {
  const { auth } = useContext(AuthContext);

  const [isOPen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  let query = queryClient.getQueryData(["users", auth?.userId]);

  let handleIsOpen = () => {
    setIsOpen(true);
  };

  const initializedValue = () => {
    let initial = {
      email: auth.userEmail || query?.email,
      password: "",
      newPassword: "",
      confirmPassword: "",
    };
    return initial;
  };

  const formik = useFormik({
    initialValues: initializedValue(),
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      showLoadingSpinner({
        message: "Changing Password...",
      });

      await authService
        .changePassword(values)
        .then((res) => {
          console.log("pasRes", res);
          setIsOpen(false);
          Swal.fire({
            title: "Success",
            text: res?.message,
            icon: "success",
            confirmButtonText: "Ok",
          });
          resetForm();
        })
        .catch((err) => {
          Swal.fire({
            title: "Error",
            text: err?.response?.data?.message,
            icon: "error",
            confirmButtonText: "Ok",
          });
        })
        .finally(() => {
          hideLoadingSpinner();
        });
    },
  });

  return {
    formik,
    isOPen,
    handleIsOpen,
  };
}

const validationSchema = Yup.object().shape({
  password: Yup.string().required("Password field is required"),
  // newPassword: Yup.string()
  //   .required("New Password field is required")
  //   .min(8, "Password must be at least 8 characters"),
  newPassword: Yup.string()
    .required("New Password field is required")
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
    .oneOf([Yup.ref("newPassword")], "Password did not match"),
});
