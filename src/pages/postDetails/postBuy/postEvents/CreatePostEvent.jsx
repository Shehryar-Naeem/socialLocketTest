import CustomButton from "components/customButton/CustomButton";
import CustomInput from "components/customInput/CustomInput";
import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import useCreatePostEvent from "./useCreatePostEvent";

function CreatePostEvent({ postData, userId, handleClose }) {
  const {
    createMutate: { isLoading },
    formik: {
      values: { date, description, time, title },
      handleChange,
      handleSubmit,
      handleBlur,
      errors,
      touched,
      setFieldValue,
    },
  } = useCreatePostEvent({ postData, userId, handleClose });
  return (
    <div>
      <CustomInput
        placeholder={"Title"}
        containerClassName={"mb-3"}
        name="title"
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors?.title || touched?.title}
      />
      <div className="w-100 mb-3">
        <DatePicker
          value={date}
          name="date"
          inputclassName="form-control "
          containerClassName="w-100 "
          editable={false}
          placeholder="Select a date"
          minDate={new Date()}
          format="DD-MMM-YYYY"
          onChange={(value) => setFieldValue("date", value)}
        />
        {errors?.date && touched?.date && (
          <p style={{ color: "red", fontSize: 12, textAlign: "right" }}>
            {errors?.date}
          </p>
        )}
      </div>
      <div className="w-100 mb-3">
        <DatePicker
          inputMode="time"
          value={time}
          onChange={(value) => setFieldValue("time", value)}
          inputclassName="form-control "
          containerClassName="w-100 "
          editable={false}
          placeholder="Select a time"
          minDate={new Date()}
          disableDayPicker
          format="hh:mm A"
          plugins={[<TimePicker hideSeconds />]}
        />
        {errors?.time && touched?.time && (
          <p style={{ color: "red", fontSize: 12, textAlign: "right" }}>
            {errors?.time}
          </p>
        )}
      </div>

      <div className="w-100 mb-3">
        <textarea
          className="form-control"
          placeholder="Enter description"
          onChange={handleChange}
          onBlur={handleBlur}
          name="description"
          value={description}
        />
        {errors?.description && touched?.description && (
          <p style={{ color: "red", fontSize: 12, textAlign: "right" }}>
            {errors?.description}
          </p>
        )}
      </div>
      <div className="d-flex align-items-center justify-content-end">
        <CustomButton
          title={"Save"}
          onClick={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default CreatePostEvent;
