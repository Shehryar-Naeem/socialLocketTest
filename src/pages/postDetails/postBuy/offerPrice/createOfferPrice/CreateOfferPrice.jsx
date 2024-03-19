import React, { memo } from "react";
import CustomButton from "../../../../../components/customButton/CustomButton";
import useCreatePrice from "./useCreatePrice";
import CustomInput from "../../../../../components/customInput/CustomInput";
import { Form, InputGroup } from "react-bootstrap";
import useGetCurrency from "hooks/query/commonData/useGetCurrency";

function CreateOfferPrice({ handleClose }) {
  const {
    formik: {
      values: { currency, message, offer_price },
      handleChange,
      handleBlur,
      errors,
      handleSubmit,
      touched,
    },
    isLoading,
  } = useCreatePrice(handleClose);
  const getCurrency = useGetCurrency();
  return (
    <div>
      <div className="post-input mb-3">
        <label>Place your offer here</label>
        <InputGroup>
          <Form.Select
            style={{ flex: 0.1 }}
            id="basic-addon1"
            aria-label="Default select example"
            value={currency}
            onChange={handleChange}
            onBlur={handleBlur}
            name="currency"
          >
            <option disabled>Select Currency</option>
            {getCurrency?.data?.map((item) => (
              <option value={item?.currency_symbol} key={item?.id}>
                {item?.currency_code} {item?.currency_symbol}
              </option>
            ))}
          </Form.Select>
          <Form.Control
            placeholder="Price"
            aria-label="Price"
            aria-describedby="basic-addon1"
            type="number"
            name="offer_price"
            min={1}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </InputGroup>
        {errors?.offer_price && touched?.offer_price ? (
          <div className="post-validation" style={{ color: "red" }}>
            {errors?.offer_price}
          </div>
        ) : (
          ""
        )}
      </div>

      <CustomInput
        name={"message"}
        value={message}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched?.message ? errors?.message : ""}
        containerClassName={"mb-3"}
        label={"Message"}
        placeholder={"Please enter your message"}
      />
      <div className="d-flex align-items-center justify-content-end">
        <CustomButton
          title={"Submit"}
          onClick={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default memo(CreateOfferPrice);
