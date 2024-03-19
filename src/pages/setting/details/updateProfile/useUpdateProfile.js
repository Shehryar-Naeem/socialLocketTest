import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import * as yup from "yup";
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from "../../../../components/messageModal/MessageModal";
import { AuthContext } from "../../../../context/authContext";
import { formatDateMMDDYYYY, getSelectedValues } from "../../../../helpers";
import { API } from "../../../../services/ApiClient";
import { countryService } from "../../../../services/CountryService";
import useGetUserType from "hooks/query/commonData/useGetUserType";
const schema = yup.object().shape({
  forename: yup.string().required("First Name is required"),
  surname: yup.string().required("Last Name is required"),
  secret_answer: yup.string().required("Secret Answer is required"),
});
const useUpdateProfile = (preloadedValues, userSelectedTypesData) => {
  const userTypeQuery = useGetUserType();

  const [user, setUser] = useState(null);
  const { data: countryList, isLoading: countryListLoading } = useQuery(
    ["countiesList"],
    countryService.GetCountryCodes
  );
  const [selectedCountry, setSelectedCountry] = useState({
    id: 1,
    name: "AFGHANISTAN",
    nick_name: "Afghanistan",
    iso3: "AFG",
    phone_code: 93,
  });
  const { auth } = useContext(AuthContext);
  const form = useForm({
    resolver: yupResolver(schema),
  });
  const { reset, watch } = form;
  const UserType = watch("user_type");

  useEffect(() => {
    const objectWithOnes = userSelectedTypesData
      ? userSelectedTypesData[0]
      : {};
    const selectedOptions = getSelectedValues(objectWithOnes);
    setTimeout(
      () =>
        setUser({
          forename: preloadedValues?.forename,
          surname: preloadedValues?.surname,
          email: preloadedValues?.email,
          bio: preloadedValues?.bio,
          mobile: preloadedValues?.mobile,
          gender: preloadedValues?.gender,
          city: preloadedValues?.city,
          main_user_type: preloadedValues?.main_user_type,
          user_type: selectedOptions,
          dob:
            typeof preloadedValues?.dob === "string"
              ? moment(
                  formatDateMMDDYYYY(preloadedValues?.dob),
                  "MM/DD/YYYY"
                ).toDate()
              : null,
          secret_answer: preloadedValues?.secret_answer,
        }),
      100
    );
  }, [preloadedValues, userSelectedTypesData]);

  useEffect(() => {
    // reset form with user data

    if (!user) return;
    let temp = {
      ...user,
    };

    let countryCode = user.mobile ? user?.mobile?.match(/^\+\d+/)?.[0] : ""; // extract country code
    if (countryCode) {
      temp.mobile = Number(user.mobile.replace(countryCode, "")); // remove country code from mobile number
    }
    reset(temp);
    if (countryList?.length && user?.mobile) {
      let countryFind = countryList?.find(
        (item) =>
          item?.phone_code === Number(user?.mobile?.match(/\+(\d+)/)?.[1])
      );
      countryFind && setSelectedCountry(countryFind);
    }
    // phone_code
  }, [user, countryList]);

  const queryClient = useQueryClient();
  const updateDetails = useMutation(
    async (payload) => {
      const res = API.put(`users/${preloadedValues?.id}`, payload);
      if (res) {
        return res;
      }

      return null;
    },
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries(["users-types"]);
        }
      },
    }
  );

  const updateUserTypes = useMutation(
    async (payload) => {
      const res = await API.put(`user-types/:id`, payload);
      if (res) {
        return res;
      }
      return null;
    },
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries(["users"]);
          queryClient.invalidateQueries(["users-types", preloadedValues?.id]);
        }
      },
    }
  );
  useEffect(() => {
    if (updateDetails.isSuccess && updateUserTypes.isSuccess) {
      Swal.fire({
        title: "Success",
        text: "Updated Successfully",
        icon: "success",
        confirmButtonText: "Ok",
      });
    }
  }, [updateDetails.isSuccess, updateUserTypes.isSuccess]);
  const onSubmit = async (data, event) => {
    try {
      event.preventDefault();
      showLoadingSpinner({});

      let userTypePayload = {};
      userTypeQuery?.data?.map?.((item) => {
        userTypePayload = {
          ...userTypePayload,
          [item?.type.toLowerCase()]: UserType.includes(item?.type) ? "1" : "0",
        };
      });
      const userDetails = {
        ...preloadedValues,
        id: auth?.userId,
        forename: data?.forename,
        surname: data.surname,
        dob: data.dob ? moment(data.dob).format("MM/DD/YYYY") : "",
        bio: data?.bio,
        gender: data?.gender,
        // mobile: data?.mobile,
        mobile: `+${
          selectedCountry?.phone_code ? selectedCountry?.phone_code : ""
        } ${data?.mobile ? data?.mobile : ""}`,
        email: data?.email,
        main_user_type: UserType?.[0],
        // main_user_type: data?.main_user_type,
        // seller: UserType && UserType.includes("seller") ? "1" : "0",
        // buyer: UserType && UserType.includes("buyer") ? "1" : "0",
        // finance: UserType && UserType.includes("finance") ? "1" : "0",
        // legal: UserType && UserType.includes("legal") ? "1" : "0",
        status: "",
        // agent: UserType && UserType.includes("agent") ? "1" : "0",
        // other: UserType && UserType.includes("other") ? "1" : "0",
        // accountant: UserType && UserType.includes("accountant") ? "1" : "0",
        secret_answer: data?.secret_answer,
        ...userTypePayload,
      };
      const userTypesUpdateData = {
        id: userSelectedTypesData?.[0]?.id,
        user_id: auth?.userId,
        // seller: UserType && UserType.includes("seller") ? "1" : "0",
        // buyer: UserType && UserType.includes("buyer") ? "1" : "0",
        // finance: UserType && UserType.includes("finance") ? "1" : "0",
        // legal: UserType && UserType.includes("legal") ? "1" : "0",
        // agent: UserType && UserType.includes("agent") ? "1" : "0",
        // other: UserType && UserType.includes("other") ? "1" : "0",
        // accountant: UserType && UserType.includes("accountant") ? "1" : "0",
        ...userTypePayload,
      };
      await updateDetails.mutateAsync(userDetails, {
        onSettled: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["users", auth?.userId],
          });
        },
      });
      await updateUserTypes.mutateAsync(userTypesUpdateData, {
        onSettled: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["users", auth?.userId],
          });
          hideLoadingSpinner({});
        },
      });
    } catch (error) {
      console.error({ error });

      hideLoadingSpinner({});
    } finally {
      hideLoadingSpinner({});
    }
  };
  const handleCountryChange = async (event) => {
    const selectedCountryData = countryList.find(
      (x) => x.id === Number(event.target.value)
    );
    setSelectedCountry(selectedCountryData);
  };

  return {
    form,
    countryList,
    handleCountryChange,
    selectedCountry,
    UserType,
    onSubmit,
    userTypeQuery,
  };
};

export default useUpdateProfile;
