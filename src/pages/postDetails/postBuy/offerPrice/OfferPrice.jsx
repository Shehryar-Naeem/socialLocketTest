import React from "react";
import CustomButton from "../../../../components/customButton/CustomButton";
import useOfferPrice from "./useOfferPrice";
import ModalComponent from "../../../../components/modalComponent/ModalComponent";
import CreateOfferPrice from "./createOfferPrice/CreateOfferPrice";
import OfferPriceList from "./offerPriceList/OfferPriceList";

function OfferPrice({ postData, userId }) {
  const {
    handleCreateOfferModalOpen,
    handleListModalOpen,
    isCreateOfferModalOpen,
    isListModalOpen,
  } = useOfferPrice();
  return (
    <>
      <div className="w-100 d-flex">
        <div className="d-flex align-items-center justify-content-between gap-10 w-100">
          <h6 className="mb-0">Offers List</h6>
          <div>
            {Number(postData?.user_id) !== Number(userId) && (
              <CustomButton
                title={"Create an Offer"}
                className={"btn-sm"}
                onClick={handleCreateOfferModalOpen}
              />
            )}
            {
              <CustomButton
                title={<i className="fas fa-list-ul"></i>}
                className={"btn-sm ms-2"}
                onClick={handleListModalOpen}
              />
            }
          </div>
        </div>
      </div>

      {isCreateOfferModalOpen && (
        <ModalComponent
          show={isCreateOfferModalOpen}
          onHide={handleCreateOfferModalOpen}
          size="lg"
          heading="Create an Offer"
        >
          <CreateOfferPrice handleClose={handleCreateOfferModalOpen} />
        </ModalComponent>
      )}

      {isListModalOpen && (
        <ModalComponent
          show={isListModalOpen}
          onHide={handleListModalOpen}
          size="lg"
          heading="Offer List"
        >
          <OfferPriceList
            userId={userId}
            isPostCreator={postData?.user_id == userId}
          />
        </ModalComponent>
      )}
    </>
  );
}

export default OfferPrice;
