import { useFormik } from "formik";
import { useMutation } from "react-query";
import * as yup from "yup";
import { createPostOffer } from "../../../../../services/postOfferApi";
import { useParams } from "react-router-dom";
import { getIdValue } from "../../../../../helpers";
import { useContext } from "react";
import { AuthContext } from "../../../../../context/authContext";
import { PostDetailContext } from "../../../PostDetailContext";
import Swal from "sweetalert2";

function useCreatePrice(handleClose) {
  const { postDetail } = useContext(PostDetailContext);
  const mutate = useMutation(createPostOffer);
  const params = useParams();
  const postId = getIdValue(params);
  const { auth } = useContext(AuthContext);
  const userId = auth?.userId ? auth?.userId.toString() : "";
  const formik = useFormik({
    initialValues: {
      offer_price: "",
      message: "",
      currency: "$",
    },
    validationSchema,
    onSubmit: ({ currency, message, offer_price }, { resetForm }) => {
      mutate.mutate(
        {
          post_id: postId,
          to_user_id: postDetail?.user_id,
          from_user_id: userId,
          offer_price: currency + " " + offer_price,
          user_who_triggered_notify_id: userId,
          user_to_notify_id: postDetail?.user_id,
          status: "Under Offer",
          message: message,
          opened: 0,
        },
        {
          onSuccess: async (res) => {
            Swal.fire({
              title: "Success",
              text: res?.data?.message,
              icon: "success",
            });
            resetForm && resetForm();
            handleClose && handleClose();
          },
          onError: (err, data) => {
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
  return { formik, isLoading: mutate.isLoading };
}

export default useCreatePrice;
const validationSchema = yup.object().shape({
  message: yup
    .string()

    .required("Message is required"),

  offer_price: yup
    .mixed()
    .test("positiveOrNaN", "Price must be greater than zero", (value) => {
      return typeof value === "number" && (value > 0 || Number.isNaN(value));
    })
    .required("Price must be greater than zero"),
});
// {
// "post_id": 1,
// "to_user_id": 1,
// "from_user_id": 2,
// "offer_price": "$122",
// "user_who_triggered_notify_id": 2,
// "user_to_notify_id": 1,
// "status": "Under Offer",
// "message": "Will you accept this",
// "opened": 0
// }
