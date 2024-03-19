import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as yup from "yup";
import {
  deleteFileDocument,
  getFilesByUserId,
  uploadFileDocument,
} from "../../../../services/fileUploadApi";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../context/authContext";
import { useFormik } from "formik";
import { showMessage } from "components/messageModal/MessageModal";

function useUploadDocument() {
  const auth = useContext(AuthContext);
  let loginUserId = Number(auth?.auth?.userId);
  const getFilesQuery = useQuery(["file", loginUserId], () =>
    getFilesByUserId(loginUserId)
  );
  const { mutate, isLoading } = useMutation(uploadFileDocument);
  const deleteMutation = useMutation(deleteFileDocument);
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      name: "",
      file: [],
    },
    validationSchema,
    onSubmit: ({ file, name }, { resetForm }) => {
      const fd = new FormData();
      fd.append("user_id", loginUserId);

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
          await queryClient.invalidateQueries(["file", loginUserId]);
          await queryClient.invalidateQueries([
            `user_document`,
            "progress",
            loginUserId,
          ]);
          resetForm();
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

  const handleDelete = (id) => {
    showMessage({
      isVisible: true,
      title: "Delete Document",
      message: "Are you sure you want to delete this document?",
      successFn: () => {
        deleteMutation.mutate(
          {
            id,
            user_id: loginUserId,
          },
          {
            onSuccess: async (res) => {
              Swal.fire({
                title: "Success",
                text: res?.data?.message,
                icon: "success",
              });
              await queryClient.invalidateQueries(["file", loginUserId]);
              await queryClient.invalidateQueries([
                `user_document`,
                "progress",
                loginUserId,
              ]);
            },
            onError: (err) => {
              Swal.fire({
                title: "Error",
                text: err?.response?.data?.message,
                icon: "error",
              });
            },
          }
        );
      },
    });
  };
  return {
    handleOnDrop,
    formik,
    isLoading,
    getFilesQuery,
    handleDelete,
    deleteMutation,
  };
}
const validationSchema = yup.object().shape({
  name: yup.string().required("Document name is required"),
  file: yup.array().min(1, "Document file is required"),
});

export default useUploadDocument;
