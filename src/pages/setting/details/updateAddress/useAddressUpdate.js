import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from "../../../../components/messageModal/MessageModal";
import {
  addressStatusChange,
  createAddress,
  createUserAddress,
  deleteAddress,
  updateAddress,
} from "../../../../services/addressApi";
import { AuthContext } from "../../../../context/authContext";
import { useQueryClient } from "react-query";
import Swal from "sweetalert2";

function useAddressUpdate(item, getAllAddresses, handleClose) {
  const [addressTye, setAddressTye] = useState(item?.address_type);
  const queryClient = useQueryClient();
  const { auth } = useContext(AuthContext);
  const userId = auth?.userId;
  const initializedValue = () => {
    let initialValues = {
      unit_number: item?.unit_number ?? "",
      street_number: item?.street_number ?? "",
      address_line_1: item?.address_line_1 ?? "",
      address_line_2: item?.address_line_2 ?? "",
      city: item?.city ?? "",
      region: item?.region ?? "",
      postal_code: item?.postal_code ?? "",
      country_id: item?.country_id ?? null,
      post_id: item?.post_id ?? null,
      user_id: auth?.userId,
      longitude: item?.longitude ?? null,
      latitude: item?.latitude ?? null,
    };
    return initialValues;
  };

  useEffect(() => {
    if (item?.id && item?.address_type) {
      let initialValues = initializedValue();
      setAddressTye(item?.address_type);
      formik.setValues({
        ...initialValues,
      });
    }
  }, [item]);

  const formik = useFormik({
    //1
    initialValues: initializedValue(),
    //2
    validationSchema,
    //3
    onSubmit: async (values) => {
      showLoadingSpinner({
        message: !!item?.id ? "Updating..." : "Adding new address...",
      });
      // let temp = { ...values };

      if (!!item?.id) {
        let obj = { ...values, id: item?.id };
        //update
        await updateAddress(110, obj)
          .then(async (res) => {
            if (!item?.address_type) {
              await createUserAddress({
                user_id: auth?.userId,
                address_id: item?.id,
                status: "active",
                address_type: "Business",
              });
            }
            await getAllAddresses();
            await queryClient.invalidateQueries([
              `address`,
              "progress",
              userId,
            ]);
            handleClose && handleClose();
            // getAddress.refetch();
            // queryClient.invalidateQueries([`address`, item?.id]);
          })
          .catch((err) => {
            console.error("err", err);
          })
          .finally(() => {
            hideLoadingSpinner();
          });
      } else {
        //new address
        await createAddress(values)
          .then(async (res) => {
            await createUserAddress({
              user_id: auth?.userId,
              address_id: res?.insertId,
              status: "active",
              address_type: "Personal",
              primary_address: "1",
            });
            await getAllAddresses();
            await queryClient.invalidateQueries([
              `address`,
              "progress",
              userId,
            ]);

            handleClose && handleClose();
          })

          .catch((er) => {
            console.error("error", er);
          })
          .finally(() => {
            hideLoadingSpinner();
          });
      }
    },
  });

  let handleDeleteAddress = (id) => {
    showLoadingSpinner({
      message: "Deleting...",
    });
    deleteAddress(id, { id })
      .then(async (res) => {
        await getAllAddresses();
      })
      .catch((er) => {
        console.error("error", er);
      })
      .finally(() => {
        hideLoadingSpinner();
      });
  };

  let handleChangeAddressType = async (newStatus, addressType) => {
    showLoadingSpinner({
      message: "Loading...",
    });
    let temp = {
      Business: "Personal",
      Personal: "Business",
    };
    console.log({ addressType });
    // addressData?.find((item) => item?.id);
    console.log({ newStatus });
    let obj = {
      user_id: item?.user_id,
      address_id: item?.id,
      status: newStatus || "active",
      address_type: newStatus ? addressType ?? "Personal" : temp[addressTye],
      primary_address: newStatus
        ? "1"
        : temp[addressTye] === "Business"
        ? "0"
        : "1",
    };
    if (!temp[addressTye]) {
      try {
        await createUserAddress({
          user_id: item?.user_id,
          address_id: item?.id,
          status: "active",
          address_type: "Personal",
          primary_address: "1",
        });
        await getAllAddresses();
        await queryClient.invalidateQueries([`address`, "progress", userId]);

        handleClose && handleClose();
      } catch (error) {
      } finally {
        hideLoadingSpinner();
      }
      return;
    }
    addressStatusChange(obj?.user_id, obj)
      .then(async (res) => {
        setAddressTye(temp[addressTye]);
        await getAllAddresses();
      })
      .catch((err) => {
        Swal.fire({
          title: "Error",
          text: err?.response?.data?.message,
        });
        console.error(err);
      })
      .finally(() => {
        hideLoadingSpinner();
      });
  };
  return {
    // updateAddressMutation,
    formik,
    handleDeleteAddress,
    handleChangeAddressType,
    addressTye,
  };
}

export default useAddressUpdate;

const validationSchema = Yup.object().shape({
  // unit_number: Yup.string().required("Field is required"),
  street_number: Yup.string().required("Field is required"),
  address_line_1: Yup.string().required("Field is required"),
  // address_line_2: Yup.string().required("Field is required"),
  city: Yup.string().required("Field is required"),
  region: Yup.string().required("Field is required"),
  postal_code: Yup.string().required("Field is required"),
  country_id: Yup.string().required("Field is required"),
});
