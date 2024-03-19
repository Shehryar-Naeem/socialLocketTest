import React from "react";
import useUpdateProfile from "./useUpdateProfile";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Multiselect } from "multiselect-react-dropdown";
import moment from "moment";
import { userTypesOptions } from "../../components/DetailsForm";
import { Controller } from "react-hook-form";
import useGetUserType from "hooks/query/commonData/useGetUserType";
import LoadingSpinner from "components/messageModal/LoadingSpinner";
import { capitalizeFirstLetter } from "helpers";

function UpdateProfile({ preloadedValues, userSelectedTypesData }) {
  const {
    form: {
      register,
      handleSubmit,
      control,
      reset,
      watch,
      getValues,
      formState: { errors },
    },
    UserType,
    countryList,
    handleCountryChange,
    onSubmit,
    selectedCountry,
    userTypeQuery: { data, isLoading },
  } = useUpdateProfile(preloadedValues, userSelectedTypesData);

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div>
      <h3 className="mb-4">Update Your Profile</h3>
      <form className="row g-3">
        <div className="col-md-6">
          <label htmlFor="forename" className="form-label">
            Please enter your first name
          </label>
          <input
            type="text"
            className="form-control"
            id="forename"
            name="forename"
            placeholder="First Name"
            {...register("forename")}
          />
          {errors?.forename?.message && (
            <div style={{ color: "red" }}>{errors?.forename?.message}</div>
          )}
        </div>
        <div className="col-md-6">
          <label htmlFor="surname" className="form-label">
            Please enter your last name
          </label>
          <input
            type="text"
            className="form-control"
            id="surname"
            name="surname"
            placeholder="Last Name"
            {...register("surname")}
          />
          {errors?.surname?.message && (
            <div style={{ color: "red" }}>{errors?.surname?.message}</div>
          )}
        </div>
        <div className="col-md-6">
          <label htmlFor="bio" className="form-label">
            Bio
          </label>
          <input
            type="text"
            className="form-control"
            id="bio"
            name="bio"
            placeholder="Content Creator"
            {...register("bio")}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="gender" className="form-label">
            Gender
          </label>
          <select
            className="form-control"
            name="gender"
            {...register("gender")}
          >
            <option value=""> Select a gender </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div className="col-md-6 ">
          <label htmlFor="dob" className="form-label">
            Date of Birth
          </label>
          <Controller
            control={control}
            name="dob"
            render={({ field }) => (
              <DatePicker
                className="form-control"
                placeholderText="Select date of birth"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                dateFormat={"dd/MM/yyyy"}
                maxDate={moment().subtract(18, "years").toDate()}
              />
            )}
          />
        </div>
        {/* <div className="col-md-6 ">
          <label htmlFor="mobile" className="form-label">
            Contact Number
          </label>
          <input
            type="text"
            className="form-control"
            id="mobile"
            name="mobile"
            placeholder="+92 9887673456"
            {...register('mobile')}
          />
        </div> */}
        <div className="col-md-6">
          <label htmlFor="mobile" className="form-label">
            Contact Number
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
                min={1}
                {...register("mobile")}
              />
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="lyhxr@example.com"
            disabled
            {...register("email")}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="email" className="form-label">
            Referral Code
          </label>
          <input
            type="text"
            className="form-control"
            id="text"
            name="text"
            placeholder="Referral Code"
            disabled
            // {...register("referral_code")}
            value={preloadedValues?.referral_code}
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="email" className="form-label">
            Secret Answer
          </label>
          <input
            type="text"
            className="form-control"
            id="secret_answer"
            name="secret_answer"
            placeholder="XYZ..."
            {...register("secret_answer")}
          />
          {errors?.secret_answer?.message && (
            <div style={{ color: "red" }}>{errors?.secret_answer?.message}</div>
          )}
        </div>
        {/* <div className="col-md-6">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            className="form-control"
            id="city"
            name="city"
            placeholder="Birmingham"
            {...register('city')}
          />
        </div> */}
        <div className="mb-2">
          <label htmlFor="search_input" className="form-label">
            Select User Types
          </label>
          <Controller
            control={control}
            name="user_type"
            render={({ field: { value, onChange } }) => (
              <Multiselect
                options={data?.map((item) => item?.type) ?? []}
                isObject={false}
                showCheckbox
                hidePlaceholder
                closeOnSelect={false}
                onSelect={onChange}
                onRemove={onChange}
                selectedValues={value}
                placeholder="Select User Type"
                className="text"
                singleSelect
              />
            )}
          />
        </div>
        {/* <div className="mb-2">
          <label htmlFor="main_user_type" className="form-label">
            Select Main User Type
          </label>
          <div className="col-md-12">
            <select
              {...register("main_user_type")}
              className="form-select"
              id="main_user_type"
              name="main_user_type"
              style={{
                height: "48px",
              }}
            >
              <option value="">Select a type</option>
              {UserType
                ? UserType.map((item, idx) => (
                    <option key={idx} value={item}>
                      {item}
                    </option>
                  ))
                : ""}
            </select>
          </div>
        </div> */}
        <div className="text-end">
          <button
            onClick={handleSubmit(onSubmit)}
            type="button"
            className="btn btn-common"
            // disabled={isUpdateDetailsLoading}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;
