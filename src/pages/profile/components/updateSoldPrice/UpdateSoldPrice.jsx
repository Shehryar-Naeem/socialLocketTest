import CustomButton from "components/customButton/CustomButton";
import CustomInput from "components/customInput/CustomInput";
import useGetCurrency from "hooks/query/commonData/useGetCurrency";
import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { updatePost } from "services/PostApi";
import Swal from "sweetalert2";

function UploadSoldPrice({ handleClose, postData }) {
  const [value, setValue] = useState({
    price: "",
    currency: "$",
  });
  const getCurrency = useGetCurrency();

  const queryClient = useQueryClient();
  const { mutate: updateMutate, isLoading } = useMutation(updatePost, {
    onSuccess: async (res) => {
      await queryClient.invalidateQueries(["posts-id", postData?.user_id]);
      Swal.fire({
        title: "Success",
        text: res?.data?.message,
        icon: "success",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          handleClose && handleClose();
        }
      });
    },
    onError: (err, data) => {
      Swal.fire({
        title: "Update Post",
        text: err?.response?.data?.message,
        icon: "error",
      });
    },
  });
  const [error, setError] = useState("");
  const handleChange = (event) => {
    const { value, name } = event?.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
    error && setError("");
  };
  const handleSubmit = () => {
    if (!value?.price) {
      return setError("Price must be required");
    } else if (Number(value?.price) <= 0) {
      return setError("Price must be greater than zero");
    }
    updateMutate({
      ...postData,
      purchased_price: `${value?.currency} ${value?.price}`,
    });
  };
  return (
    <div>
      <div className="post-input mb-3">
        <label>Sale Price</label>
        <InputGroup>
          <Form.Select
            style={{ flex: 0.1 }}
            id="basic-addon1"
            aria-label="Default select example"
            value={value?.currency}
            onChange={handleChange}
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
            placeholder="Enter sale price for this listing"
            aria-label="Price"
            aria-describedby="basic-addon1"
            type="number"
            name="price"
            min={1}
            onChange={handleChange}
            value={value?.price}
          />
        </InputGroup>
        {error ? (
          <div className="post-validation" style={{ color: "red" }}>
            {error}
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="d-flex align-items-center justify-content-center">
        <CustomButton
          title={"Complete Sale"}
          onClick={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default UploadSoldPrice;
