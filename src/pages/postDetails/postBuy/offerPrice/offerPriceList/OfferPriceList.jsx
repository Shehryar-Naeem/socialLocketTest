import React, { memo, useState } from "react";
import useOfferList from "./useOfferList";
import LoadingSpinner from "../../../../../components/messageModal/LoadingSpinner";
import Avatar from "components/image/Avatar";
import CustomButton from "components/customButton/CustomButton";
import { useMutation, useQueryClient } from "react-query";
import { updatePostOffer } from "services/postOfferApi";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { isNonEmptyString, removeWhitespaces } from "helpers";

function OfferPriceList({ userId, isPostCreator }) {
  const { data, isLoading } = useOfferList(isPostCreator, userId);
  return isLoading ? (
    <LoadingSpinner />
  ) : !data?.data?.length ? (
    <p>No Data</p>
  ) : (
    data?.data?.map((item) => (
      <OfferListRow
        key={item?.id}
        item={item}
        isPostCreator={isPostCreator}
        isOfferAccepted={data?.isOfferAccepted}
      />
    ))
  );
}

const OfferListRow = ({ item, isPostCreator, isOfferAccepted }) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(updatePostOffer, {
    onError: (err) =>
      Swal.fire({
        title: "Error",
        text: err?.response?.data?.message,
        icon: "error",
      }),
    onSettled: async () => {
      await queryClient.invalidateQueries(["offerList", item?.post_id + ""]);
      setType(null);
    },
  });
  const [type, setType] = useState(null);
  const handleAccept = () => {
    setType("accept");
    mutate({
      ...item,
      offer_accepted: "1",
    });
  };
  const handleReject = () => {
    setType("reject");

    mutate({
      ...item,
      offer_accepted: "0",
    });
  };

  const FullName =
    isNonEmptyString(item?.forename) && isNonEmptyString(item?.surname)
      ? `${item?.forename}  ${item?.surname}`
      : "";
  const userProfileUrl = FullName.concat("_", item?.from_user_id);
  console.log(item?.message, "==", item?.offer_accepted, item);

  return (
    <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
      <Link to={`/profile/${removeWhitespaces(userProfileUrl)}`}>
        <Avatar
          src={item?.profile_image}
          firstName={item?.forename}
          lastName={item?.surname}
        />
      </Link>

      <div className="mx-2  mb-0" style={{ flex: 1 }}>
        <p className="mb-0">{item?.message}</p>

        <p className="mb-0">Offer Price :-{item?.offer_price}</p>
      </div>

      {!isPostCreator ||
      (isOfferAccepted?.offer_accepted == 1 &&
        isOfferAccepted?.id !== item?.id) ? null : item?.offer_accepted ? (
        <div>
          {item?.offer_accepted == 1 && (
            <CustomButton
              title={"Accepted"}
              className={"me-2 btn-sm"}
              disabled
            />
          )}
          {item?.offer_accepted == 0 && (
            <CustomButton
              title={"Rejected"}
              className={"unfollow-btn"}
              disabled
            />
          )}
        </div>
      ) : (
        // <p className="mx-2">
        //   {item?.offer_accepted === 1 ? "Accepted" : "Rejected"}
        // </p>
        <div>
          <CustomButton
            title={"Accept"}
            className={"me-2"}
            isLoading={isLoading && type === "accept"}
            disabled={isLoading}
            onClick={handleAccept}
          />
          <CustomButton
            title={"Reject"}
            className={"unfollow-btn"}
            isLoading={isLoading && type === "reject"}
            disabled={isLoading}
            onClick={handleReject}
          />
        </div>
      )}
    </div>
  );
};

export default memo(OfferPriceList);
