import React, { useEffect, useState } from "react";
import AddressAutoComplete from "./AddressAutoComplete";
import useAddressUpdate from "./useAddressUpdate";
import { countryService } from "../../../../services/CountryService";

let type = {
  Business: "Primary Address",
  Personal: "Secondary Address",
};
let typeChange = {
  Business: "Set as secondary ",
  Personal: "Set as primary",
};
const AddressFormRow = ({
  item,
  isNewAddress,
  getAllAddresses,
  countryList,
  handleClose,
}) => {
  const { formik, addressTye, handleChangeAddressType } = useAddressUpdate(
    item,
    getAllAddresses,
    handleClose
  );

  // const [countryList, SetCountryList] = useState([]);
  // useEffect(() => {
  //   async function getCounties() {
  //     const countryData = await countryService.GetCountryCodes();
  //     SetCountryList(countryData);
  //   }
  //   getCounties();
  // }, []);

  return (
    <div>
      {/* {item?.address_type === "Business" ? (
        <div>
          <h5>Primary Address</h5>
        </div>
      ) : (
        <div>
          <h5>Secondary Address</h5>
        </div>
      )} */}
      <h5>{type[addressTye]}</h5>

      <AddressAutoComplete
        onChange={(value) =>
          formik.setValues({
            ...formik.values,
            street_number: value?.unit,
            address_line_1: value?.formattedAddress,
            city: value?.city,
            region: value?.state,
            postal_code: value?.zip,
            longitude: value?.longitude,
            latitude: value?.latitude,
            country_id: countryList?.find(
              (el) => el?.nick_name === value.country
            )?.id,
          })
        }
      />
      <form className="row g-3 mb-5" id="address">
        {/* <div className="col-md-6">
          <label htmlFor="unit_number" className="form-label">
            Unit Number
          </label>
          <input
            name="unit_number"
            id="unit_number"
            className="form-control"
            // onFocus={() => setIsFocus(true)}
            onChange={formik?.handleChange("unit_number")}
            onBlur={formik?.handleBlur("unit_number")}
            value={formik?.values?.unit_number}
          />
          <p style={{ color: "red", fontSize: 12 }}>
            {formik.errors.unit_number}
          </p>
        </div> */}
        <div className="col-12">
          <label htmlFor="street_number" className="form-label">
            Street Number/ Unit Number
          </label>
          <input
            name="street_number"
            id="street_number"
            className="form-control"
            onChange={formik?.handleChange("street_number")}
            onBlur={formik?.handleBlur("street_number")}
            value={formik?.values.street_number}
          />
          <p style={{ color: "red", fontSize: 12 }}>
            {formik.errors.street_number}
          </p>
        </div>
        <div className="col-md-6">
          <label htmlFor="address_line_1" className="form-label">
            Address Line 1
          </label>
          <textarea
            rows={4}
            name="street_number"
            type="text"
            id="address_line_1"
            className="form-control"
            onChange={formik?.handleChange("address_line_1")}
            onBlur={formik?.handleBlur("address_line_1")}
            value={formik?.values.address_line_1}
          />
          <p style={{ color: "red", fontSize: 12 }}>
            {formik.errors.address_line_1}
          </p>
        </div>
        <div className="col-md-6">
          <label htmlFor="address_line_2" className="form-label">
            Address Line 2
          </label>
          <textarea
            rows={4}
            name="street_number"
            type="text"
            id="address_line_2"
            className="form-control"
            onChange={formik?.handleChange("address_line_2")}
            onBlur={formik?.handleBlur("address_line_2")}
            value={formik?.values?.address_line_2}
          />
          <p style={{ color: "red", fontSize: 12 }}>
            {formik.errors.address_line_2}
          </p>
        </div>
        <div className="col-md-6 ">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            name="city"
            id="city"
            className="form-control"
            onChange={formik?.handleChange("city")}
            onBlur={formik?.handleBlur("city")}
            value={formik?.values.city}
          />
          <p style={{ color: "red", fontSize: 12 }}>{formik.errors.city}</p>
        </div>
        <div className="col-md-6 ">
          <label htmlFor="region" className="form-label">
            Region
          </label>
          <input
            name="region"
            id="region"
            className="form-control"
            onChange={formik?.handleChange("region")}
            onBlur={formik?.handleBlur("region")}
            value={formik?.values.region}
          />
          <p style={{ color: "red", fontSize: 12 }}>{formik.errors.region}</p>
        </div>
        <div className="col-md-6 ">
          <label htmlFor="Postal code" className="form-label">
            Postal Code/ P.O Box
          </label>
          <input
            name="postal_code"
            id="postal_code"
            className="form-control"
            onChange={formik?.handleChange("postal_code")}
            onBlur={formik?.handleBlur("postal_code")}
            value={formik?.values.postal_code}
          />
          <p style={{ color: "red", fontSize: 12 }}>
            {formik.errors.postal_code}
          </p>
        </div>
        {/* <div className="col-md-6 ">
          <label htmlFor="region" className="form-label">
            country
          </label>
          <input
            name="country_id"
            id="country_id"
            placeholder="country_id"
            className="form-control"
            onChange={formik?.handleChange("country_id")}
            onBlur={formik?.handleBlur("country_id")}
            value={formik?.values.country_id}
          />
        </div> */}
        {countryList?.length > 0 ? (
          <div className="col-md-6 ">
            <label htmlFor="country_id" className="form-label">
              Country
            </label>
            <select
              id="country_id"
              value={formik?.values?.country_id || null}
              className="form-select"
              onChange={(e) =>
                formik.setValues({
                  ...formik.values,
                  country_id: e.target.value,
                })
              }
            >
              <option disabled selected value>
                Select Country
              </option>
              {countryList
                ? countryList?.map((el) => (
                    <option key={el?.id} value={el?.id}>
                      {el?.nick_name}
                    </option>
                  ))
                : null}
            </select>
            <p style={{ color: "red", fontSize: 12 }}>
              {formik.errors.country_id}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        <div className="text-end">
          {!isNewAddress && (
            <>
              {!isNewAddress && (
                <>
                  <button
                    onClick={() =>
                      handleChangeAddressType(
                        item?.user_address_status === "active"
                          ? "inactive"
                          : "active",
                        item?.address_type
                      )
                    }
                    type="button"
                    className={`btn btn-common me-3 ${
                      item?.user_address_status === "active" ? "bg-danger" : ""
                    }`}
                    // disabled={isUpdateDetailsLoading}
                  >
                    {item?.user_address_status === "inactive" ? (
                      <>
                        <i className="fas fa-eye me-1"></i>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-eye-slash me-1"></i>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleChangeAddressType()}
                    // onClick={() => alert("Coming Soon")}
                    type="button"
                    className="btn btn-common bg-success me-3"

                    // disabled={isUpdateDetailsLoading}
                  >
                    {typeChange[addressTye] ?? "Set as Primary"}
                  </button>
                </>
              )}

              {/* <button
                onClick={handleDeleteAddress}
                type="button"
                className="btn btn-common"

                // disabled={isUpdateDetailsLoading}
              >
                Delete Address
              </button> */}
            </>
          )}
          <button
            onClick={() => {
              formik?.handleSubmit();
              // setIsNewAddress((prev) => !prev)
            }}
            type="button"
            className="btn btn-common"
            // disabled={isUpdateDetailsLoading}
          >
            {!item?.id ? "Add" : "Update"} Address
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressFormRow;
