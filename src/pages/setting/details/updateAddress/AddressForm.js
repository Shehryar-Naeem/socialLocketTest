import React, { useEffect, useState } from "react";
import AddressFormRow from "./AddressFormRow";
import useAddress from "./useAddress";
import AddressCard from "./AddressCard";
import { countryService } from "../../../../services/CountryService";
import ModalComponent from "../../../../components/modalComponent/ModalComponent";

const AddressForm = () => {
  const { handleDeleteAddress, data, isLoading, setData, getAllAddresses } =
    useAddress();

  const [countryList, SetCountryList] = useState([]);
  useEffect(() => {
    async function getCounties() {
      const countryData = await countryService.GetCountryCodes();
      SetCountryList(countryData);
    }
    getCounties();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  const handleAddNewAddress = (text) => {
    if (data?.length === 1 && data[0]?.address_line_1 === null) {
      if (text) {
        return "Add new address";
      }
      setIsModalOpen(true);
    } else {
      if (text) {
        return "Add Address";
      }
      setIsModalOpen(true);
    }
  };
  return (
    <div id="address">
      {data?.length < 20 && (
        <button
          type="button"
          className="btn btn-common"
          // onClick={() => setData((prev) => [{}, ...prev])}
          onClick={() => handleAddNewAddress()}
          style={{ marginBottom: 30 }}
        >
          {handleAddNewAddress(true)}
        </button>
      )}

      {data?.map((item, i) => {
        return (
          item?.address_line_1 !== null && (
            <AddressCard
              key={item?.id + ""}
              item={item}
              countryList={countryList}
              getAllAddresses={getAllAddresses}
            />
          )
        );
      })}

      {isModalOpen && (
        <ModalComponent
          show={isModalOpen}
          onHide={() => setIsModalOpen(false)}
          heading="Add Address"
          size="xs"
        >
          <AddressFormRow
            item={data?.[0]?.address_line_1 === null ? data?.[0] : undefined}
            countryList={countryList}
            getAllAddresses={getAllAddresses}
            isNewAddress={true}
            handleClose={() => setIsModalOpen(false)}
          />
        </ModalComponent>
      )}
    </div>
  );
};

export default AddressForm;
