import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import Slider, { Range } from "rc-slider";
import TooltipSlider from "./TooltipSlider";
import useGetInventory from "hooks/query/commonData/useGetInventory";
import useGetBedrooms from "hooks/query/commonData/useGetBedroom";
export const initialPostFilter = {
  title: "",
  firstName: "",
  lastName: "",
  pages: "",
  type: "",
  status: "",
  all: "",
  keywords: "",
  maxPage: "",
  minPage: "",
  minPrice: "",
  maxPrice: "",
};

export default function FilterPostModal({
  initialState,
  onSubmit,
  isShow,
  handleClose,
}) {
  const getInventory = useGetInventory();
  const getBedroom = useGetBedrooms();

  const [minValue, set_minValue] = useState(0);
  const [maxValue, set_maxValue] = useState(0);
  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  };
  const [filterState, setFilterState] = useState(
    initialState ?? initialPostFilter
  );
  const handleReset = () => {
    setFilterState(initialPostFilter);
  };

  const onChangeMultipleFilter = (e) => {
    const { name, value } = e.target;

    setFilterState((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleMultipleFilter = () => {
    let temp = {};
    const { maxPage, minPage } = filterState;
    // console.log({
    //   minPage,
    //   maxPage,
    // });
    let minPageTemp = Number(minPage);
    let maxPageTemp = Number(maxPage);
    if (minPageTemp > maxPageTemp && minPageTemp && maxPageTemp) {
      return Swal.fire({
        text: "Maximum page must be less than minimum page",
        icon: "error",
      });
    } else if (maxPageTemp < minPageTemp && maxPageTemp && minPageTemp) {
      return Swal.fire({
        text: "Minimum page must be less than maximum page",
        icon: "error",
      });
    }

    for (let key in filterState) {
      temp = {
        ...temp,
        [key]:
          typeof filterState[key] === "string"
            ? filterState[key]?.trim()
            : filterState[key],
      };
    }
    onSubmit && onSubmit(temp);
    handleClose();
  };
  return (
    <Modal show={isShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <button type="button" className="btn btn-common" onClick={handleReset}>
          Reset
        </button>
        <h5 className="modal-title m-auto">Filter your result</h5>
      </Modal.Header>
      <Modal.Body>
        <form className="row g-3">
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input
              name="firstName"
              onChange={onChangeMultipleFilter}
              value={filterState.firstName}
              type="text"
              className="form-control"
              placeholder="First Name"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              name="lastName"
              onChange={onChangeMultipleFilter}
              value={filterState.lastName}
              type="text"
              className="form-control"
              placeholder="Last Name"
            />
          </div>
          <div className="col-12">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              onChange={onChangeMultipleFilter}
              value={filterState.title}
              className="form-control"
              placeholder="Please enter title"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Number of Rooms</label>
            {/* <input
              type="text"
              name="pages"
              onChange={onChangeMultipleFilter}
              value={filterState.pages}
              className="form-control"
              placeholder="Pages"
            /> */}
            <div className="mt-3">
              <TooltipSlider
                range
                min={getBedroom?.data?.[0]?.bedrooms ?? 0}
                max={
                  getBedroom?.data?.[getBedroom?.data?.length - 1]?.bedrooms ??
                  12
                }
                // defaultValue={[filterState.minPag, filterState.maxPage]}
                onChange={(value) => {
                  setFilterState((prev) => ({
                    ...prev,
                    minPage: value[0],
                    maxPage: value[1],
                  }));
                }}
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Property Type</label>
            {/* <input
              type="text"
              name="type"
              onChange={onChangeMultipleFilter}
              value={filterState.type}
              className="form-control"
              placeholder="Type"
            /> */}
            <select
              type="select"
              name="type"
              className="form-select"
              onChange={onChangeMultipleFilter}
              value={filterState.type}
            >
              <option value="" disabled>
                Select type
              </option>
              {getInventory?.data?.map((item) => (
                <option value={item?.type} key={item?.id}>
                  {item?.type}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Minimum Price</label>
            <input
              type="number"
              name="minPrice"
              onChange={onChangeMultipleFilter}
              value={filterState.minPrice}
              className="form-control"
              min={0}
              placeholder="Minimum Page"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Maximum Price</label>
            <input
              type="number"
              name="maxPrice"
              onChange={onChangeMultipleFilter}
              value={filterState.maxPrice}
              className="form-control"
              placeholder="Maximum Page"
              min={0}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Keywords</label>
            <input
              type="text"
              onChange={onChangeMultipleFilter}
              value={filterState.keywords}
              className="form-control"
              placeholder="Keywords"
              name="keywords"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <input
              type="text"
              name="status"
              onChange={onChangeMultipleFilter}
              value={filterState.status}
              className="form-control"
              placeholder="Status"
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-common"
          onClick={handleMultipleFilter}
        >
          Submit
        </button>
      </Modal.Footer>
    </Modal>
  );
}
