import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

export const initialUserFilter = {
  email: "",
  firstName: "",
  lastName: "",
  gender: "",
  main_user_type: "",
  all: "",
};

const FilterUserModal = ({ initialState, onSubmit, isShow, handleClose }) => {
  const [filterState, setFilterState] = useState(
    initialState ?? initialUserFilter
  );

  useEffect(() => {
    setFilterState(initialState ?? initialUserFilter);
  }, [initialState]);

  const handleReset = () => {
    setFilterState(initialUserFilter);
  };

  const onChangeMultipleFilter = (e) => {
    const { name, value } = e.target;

    setFilterState((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleMultipleFilter = () => {
    let temp = {};
    for (let key in filterState) {
      temp = {
        ...temp,
        [key]: filterState[key]?.trim(),
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
        <div>
          <form className="row g-3">
            <div className="col-12">
              <label className="form-label">Email ID</label>
              <input
                onChange={onChangeMultipleFilter}
                value={filterState.email}
                name="email"
                type="email"
                className="form-control"
                placeholder="Enter Your Email ID"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input
                onChange={onChangeMultipleFilter}
                value={filterState.firstName}
                name="firstName"
                type="text"
                className="form-control"
                placeholder="First Name"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input
                onChange={onChangeMultipleFilter}
                value={filterState.lastName}
                name="lastName"
                type="text"
                className="form-control"
                placeholder="Last Name"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">User Type</label>
              <select
                className="form-select"
                onChange={onChangeMultipleFilter}
                value={filterState.main_user_type}
                name="main_user_type"
              >
                <option value="" selected>
                  Choose...
                </option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="landlord">Landlord</option>
                <option value="tenant">Tenant</option>
                <option value="agent">Agent</option>
                <option value="agency">Agency</option>
                <option value="developer">Developer</option>
                <option value="local_authority">Local Authority</option>
                <option value="registration_trustee_centre">Registration Trustee Centre</option>
                <option value="Legal">Legal</option>
                <option value="finance">Finance</option>
                <option value="accountant">Accountant</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                onChange={onChangeMultipleFilter}
                value={filterState.gender}
                name="gender"
              >
                <option value="" selected>
                  Choose...
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            {/* <div className="col-md-12">
            <label className="form-label">User Type</label>
            <select className="form-select">
              <option selected>Choose...</option>
              <option>...</option>
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label">Main User Type</label>
            <select className="form-select">
              <option selected>Choose...</option>
              <option>...</option>
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label">Status</label>
            <select className="form-select">
              <option selected>Choose...</option>
              <option>...</option>
            </select>
          </div> */}
          </form>
        </div>
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
};

export default FilterUserModal;
