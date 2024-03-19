import React, { useState } from "react";
import ModalComponent from "../../../../components/modalComponent/ModalComponent";
import AddressFormRow from "./AddressFormRow";
import Form from "react-bootstrap/Form";
import useAddressUpdate from "./useAddressUpdate";

function AddressCard({ item, countryList, getAllAddresses }) {
  //   const getFullAddress = () => {
  //     const {
  //       address_line_1,
  //       address_line_2,
  //       region,
  //       street_number,
  //       postal_code,
  //       city,
  //       unit_number,
  //       country_id,
  //     } = item;
  //     return address_line_1||"" + ','
  //   };

  const country = countryList?.find(
    (row) => row?.id === Number(item?.country_id)
  );
  const [isOpen, setIsOpen] = useState(false);
  const { handleChangeAddressType } = useAddressUpdate(item, getAllAddresses);
  return (
    <>
      <div
        className={`card mb-3 ${
          item?.user_address_status === "active" ? "active" : "inactive"
        }`}
      >
        <div className="card-body">
          <Form>
            <Form.Check // prettier-ignore
              type="switch"
              id="custom-switch"
              checked={item?.user_address_status === "active"}
              onClick={() =>
                handleChangeAddressType(
                  item?.user_address_status === "active"
                    ? "inactive"
                    : "active",
                  item?.address_type
                )
              }
            />
          </Form>
          <div className="">
            <h5 className="card-title">
              {item?.address_type
                ? item?.address_type === "Personal"
                  ? "Secondary"
                  : "Primary"
                : "Not Set Yet!"}
            </h5>
            <p className="card-text">{item?.unit_number}</p>
            <p className="card-text">{item?.street_number}</p>
            <p className="card-text">{item?.address_line_1}</p>
            {item?.address_line_2 && (
              <p className="card-text">{item?.address_line_2}</p>
            )}
            <p className="card-text">{item?.region}</p>
            <p className="card-text">
              {item?.city}, {item?.postal_code}, {country?.name}
            </p>
            {/* <p className="card-text">{item?.postal_code}</p> */}
            {/* <p className="card-text">{country?.name}</p> */}
            <div className="d-flex">
              <button
                type="button"
                className="btn btn-common me-2 update-add"
                style={{ marginEnd: 10 }}
                onClick={() => setIsOpen(true)}
              >
                Update Address
              </button>
              {/* <button
                type="button"
                className="btn btn-common"
                style={{ marginEnd: 10 }}
                onClick={() => setIsOpen(true)}
              >
                {item?.address_type === "Personal"
                  ? "Set As Primary"
                  : "Set As Secondary"}
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <ModalComponent
        show={isOpen}
        onHide={() => setIsOpen(false)}
        heading="Update Address"
        size="xs"
      >
        <AddressFormRow
          item={item}
          countryList={countryList}
          getAllAddresses={getAllAddresses}
        />
      </ModalComponent>
    </>
  );
}

export default AddressCard;
