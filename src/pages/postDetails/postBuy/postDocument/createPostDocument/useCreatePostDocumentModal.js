import { useFormik } from "formik";
import { useMutation, useQueryClient } from "react-query";
import * as yup from "yup";
import { createPostDocument } from "../../../../../services/postDocumentApi";
import { useParams } from "react-router-dom";
import { getIdValue } from "../../../../../helpers";
import { AuthContext } from "../../../../../context/authContext";
import { useContext } from "react";
import Swal from "sweetalert2";

function useCreatePostDocumentModal(handleClose) {
  const { mutate, isLoading } = useMutation(createPostDocument);
  const params = useParams();
  const postId = getIdValue(params);
  const auth = useContext(AuthContext);
  let loginUserId = Number(auth?.auth?.userId);
  const queryClient = useQueryClient();
  const formik = useFormik({
    initialValues: {
      name: "",
      file: [],
    },
    validationSchema,
    onSubmit: ({ file, name }) => {
      const fd = new FormData();
      fd.append("user_id", loginUserId);
      fd.append("post_id", postId);

      fd.append("name", name);

      fd.append("type", "Document");
      fd.append("path", "Document");

      file?.map((item) => fd.append("file", item));

      mutate(fd, {
        onSuccess: async (res) => {
          Swal.fire({
            title: "Success",
            text: res?.data?.message,
            icon: "success",
          });
          await queryClient.invalidateQueries(["documentList", postId]);
          handleClose && handleClose();
        },
        onError: (err) => {
          Swal.fire({
            title: "Error",
            text: err?.response?.data?.message,
            icon: "error",
          });
        },
      });
    },
  });
  const handleOnDrop = (files) => {
    formik.setFieldValue("file", [...formik?.values?.file, ...files]);
  };

  return { handleOnDrop, formik, isLoading };
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Document name is required"),
  file: yup.array().min(1, "Document file is required"),
});

export default useCreatePostDocumentModal;
