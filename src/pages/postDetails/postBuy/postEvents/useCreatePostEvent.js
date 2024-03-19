import { useFormik } from "formik";
import moment from "moment";
import { useMutation } from "react-query";
import { createAddress } from "services/addressApi";
import { createEvent } from "services/eventsApi";
import Swal from "sweetalert2";
import * as Yup from "yup";

const initialState = {
  title: "",
  description: "",
  time: "",
  date: "",
};
function useCreatePostEvent({ postData, userId, handleClose }) {
  const createMutate = useMutation(createEvent);
  const formik = useFormik({
    initialValues: initialState,
    onSubmit: (data, { resetForm }) => {
      const obj = {
        ...data,
        date: moment(data?.date, "DD-MMM-YYYY").format("DD/MM/YYYY"),
        time: moment(data?.time, "hh:mm A").format("HH:mm"),
        post_id: postData?.id,
        to_user_id: postData?.user_id,
        from_user_id: userId,
        user_to_notify_id: postData?.user_id,
        user_who_triggered_notify_id: userId,
        opened: 0,
      };
      console.log({ obj });
      createMutate.mutate(obj, {
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
      });
    },
    validationSchema,
  });
  return { formik, createMutate };
}

export default useCreatePostEvent;

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Time field is required"),
  description: Yup.string().required("Description field is required"),
  time: Yup.string().required("Time field is required"),
  date: Yup.string().required("Date field is required"),
});
