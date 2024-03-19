import { useFormik } from "formik";
import { useContext, useState } from "react";
import * as Yup from "yup";
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from "../../../../components/messageModal/MessageModal";
import { createPostGroup } from "../../../../services/postGroupApi";
import { useParams } from "react-router-dom";
import { getIdValue } from "../../../../helpers";
import Swal from "sweetalert2";
import { useQueryClient } from "react-query";
import { AuthContext } from "../../../../context/authContext";

function useCreatePostGroup() {
  const params = useParams();
  const id = getIdValue(params);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const handleOpen = () => setIsOpen((prev) => !prev);
  const { auth } = useContext(AuthContext);
  const userId = auth?.userId ? auth?.userId.toString() : "";

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: async (data) => {
      try {
        showLoadingSpinner({});
        const res = await createPostGroup({
          post_id: id,
          name: data.name,
          user_id: userId,
        });
        await queryClient.invalidateQueries({ queryKey: ["postGroup", id] });
        Swal.fire({
          title: "Success",
          text: res?.message,
          icon: "success",
          confirmButtonText: "Ok",
        });
      } catch (error) {
      } finally {
        hideLoadingSpinner();
      }
    },
  });
  return { isOpen, handleOpen, formik };
}

export default useCreatePostGroup;

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Group name is required"),
});
