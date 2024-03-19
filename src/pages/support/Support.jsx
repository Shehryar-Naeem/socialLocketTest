import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import slide1 from "../../assets/images/suport-image.jpg";
import Line from "../../assets/images/lines.png";
import Triangle from "../../assets/images/tringle.png";
import circle from "../../assets/images/circle.png";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import "react-phone-number-input/style.css";
import { useMutation, useQueryClient } from "react-query";
import { userService } from "../../services/UserService";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Swal from "sweetalert2";
import { countryService } from "../../services/CountryService";
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from "../../components/messageModal/MessageModal";
import LoadingSpinner from "../../components/messageModal/LoadingSpinner";
import useUsersById from "../../hooks/query/AllUserProfile/useUserById";

const schema = yup.object({
  email: yup.string().email().required(),
  name: yup.string().required(),
  description: yup.string().required(),
  mobile: yup.string().required(),
});
const Support = () => {
  const { auth } = useContext(AuthContext);

  const [countryList, SetCountryList] = useState([]);
  const {
    isLoading: isUserDetailsLoading,
    error: userDetailsError,
    data: userDetailsData,
  } = useUsersById(auth?.userId);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: userDetailsData?.email ?? "",
      mobile: "",
      description: "",
      name: userDetailsData?.email
        ? userDetailsData?.forename + " " + userDetailsData?.surname
        : "",
    },
  });

  useEffect(() => {
    if (userDetailsData?.email) {
      const { email, forename, surname, mobile } = userDetailsData;
      setValue("email", email);
      setValue("name", forename + " " + surname);

      let countryCode = mobile ? mobile?.match(/^\+\d+/)?.[0] : ""; // extract country code
      if (countryCode) {
        let tempMobile = mobile.replace(countryCode, ""); // remove country code from mobile number
        setValue("mobile", Number(tempMobile));
        if (countryList?.length && mobile) {
          let countryFind = countryList?.find(
            (item) => item?.phone_code === Number(mobile?.match(/\+(\d+)/)?.[1])
          );
          countryFind && setSelectedCountry(countryFind);
        }
      }
    }
  }, [userDetailsData, countryList]);

  const [selectedCountry, setSelectedCountry] = useState({
    id: 1,
    name: "AFGHANISTAN",
    nick_name: "Afghanistan",
    iso3: "AFG",
    phone_code: 93,
  });
  const queryClient = useQueryClient();
  const { mutate: supportRequest, isLoading: isSupportRequestLoading } =
    useMutation(
      async (payload) => {
        return await userService.supportRequest(payload);
      },
      {
        onMutate: () => {
          showLoadingSpinner({});
        },
        onSuccess: async () => {
          // Invalidate and refetch
          await queryClient.invalidateQueries(["payload"]);
        },
        onSettled: () => hideLoadingSpinner({}),
      }
    );

  useEffect(() => {
    async function getCounties() {
      const countryData = await countryService.GetCountryCodes();
      SetCountryList(countryData);
    }
    getCounties();
  }, []);
  const handleCountryChange = async (event) => {
    const selectedCountryData = countryList.find(
      (x) => x.id === Number(event.target.value)
    );
    setSelectedCountry(selectedCountryData);
  };
  const onSave = (data, e) => {
    e.preventDefault();
    supportRequest(
      {
        ...data,
        mobile: `+${selectedCountry?.phone_code} ${data?.mobile}`,
        user_id: auth?.userId,
        type: "Issue with User",
        task: "Investigate",
      },
      {
        onSuccess: (res) => {
          Swal.fire({
            title: "Success",
            text: res?.message,
            icon: "success",
            confirmButtonText: "Ok",
          });
          e.target.reset();
          reset("", {
            keepValues: false,
          });
        },
      }
    );
  };

  return isUserDetailsLoading ? (
    <LoadingSpinner />
  ) : (
    <div>
      <div className="box-shadow p-0">
        <div className="support">
          <div className="support-left">
            <div className="row justify-content-center">
              <div className="col-md-12">
                <h2>Get a Support</h2>
                <p>Please feel free to contact us.</p>
                <form className="form" onSubmit={handleSubmit(onSave)}>
                  <div className="form-floating mb-4">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="name@example.com"
                      {...register("email")}
                    />
                    <label htmlFor="email">Email</label>
                    {errors?.email?.message && (
                      <div className="error">{errors?.email?.message}</div>
                    )}
                  </div>

                  <div className="form-floating mb-4">
                    <input
                      type="name"
                      className="form-control"
                      id="name"
                      placeholder="name@example.com"
                      {...register("name")}
                    />
                    <label htmlFor="name">Name</label>
                    {errors?.name?.message && (
                      <div className="error">{errors?.name?.message}</div>
                    )}
                  </div>

                  <div className="form-floating mb-4">
                    <div className="col-md-12 mb-3">
                      {/* <label htmlFor="mobile" className="form-label">
                      Enter Your Phone Number
                    </label> */}
                      <label htmlFor="mobile" className="pb-2">
                        Please enter your contact number
                      </label>
                      {countryList?.length > 0 ? (
                        <div className="input-group phone-number-dropdown">
                          <select
                            className="form-select"
                            onChange={(e) => handleCountryChange(e)}
                            value={selectedCountry?.id}
                          >
                            {countryList
                              ? countryList.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {`${option.iso} +${option.phone_code}`}
                                  </option>
                                ))
                              : null}
                          </select>
                          <input
                            type="number"
                            className="form-control"
                            id="mobile"
                            placeholder="Contact Number"
                            {...register("mobile")}
                            min={1}
                          />
                          {errors?.mobile?.message && (
                            <div className="error">
                              {errors?.mobile?.message}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                  </div>
                  {/* <div className="">
                    <div className="register-mobile mb-3">
                      <Controller
                        name="mobile"
                        control={control}
                        rules={{
                          validate: (value) => isValidPhoneNumber(value),
                        }}
                        render={({ field: { onChange, value } }) => (
                          <PhoneInput
                            withCountryCallingCode={true}
                            value={value}
                            onChange={onChange}
                            defaultCountry="TH"
                            className="form-control"
                            //   dropdownstyle={{ height: "200px", width: "480px" }}
                            id="mobile"
                          />
                        )}
                      />
                      <label htmlFor="mobile">Enter your mobile no.</label>
                      
                      {errors?.mobile?.message && (
                        <div className="error">{errors?.mobile?.message}</div>
                      )}
                    </div>

                    <div className="form-floating mb-4">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="name"
                        {...register("name")}
                      />
                      <label htmlFor="name">Name</label>
                      {errors?.name?.message && (
                        <div className="error">{errors?.name?.message}</div>
                      )}
                    </div>
                  </div> */}
                  <div className="form-floating mb-4">
                    <textarea
                      className="form-control"
                      placeholder="Leave a comment here"
                      id="description"
                      style={{ height: 150 }}
                      {...register("description")}
                    />
                    <label htmlFor="description">Enquiry</label>
                    {errors?.description?.message && (
                      <div className="error">
                        {errors?.description?.message}
                      </div>
                    )}
                  </div>
                  <div className="text-end">
                    <button
                      type="submit"
                      className="btn btn-common"
                      disabled={isSupportRequestLoading}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="support-right">
            <picture>
              <source srcSet={slide1} type="image/jpg" />
              <img
                loading="lazy"
                src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                srcSet={slide1}
                className="img-fluid"
                alt="slider"
              />
            </picture>
            <div>
              <div className="animate lines">
                {" "}
                <img src={Line} alt="lines" />
              </div>
              <div className="animate tringle">
                <img src={Triangle} alt="tringle" width="" height="" />
              </div>
              <div className="animate circle">
                <img src={circle} alt="circle" width="" height="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
