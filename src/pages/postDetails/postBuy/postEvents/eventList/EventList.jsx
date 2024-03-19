import React, { useState } from "react";
import useEventList from "./useEventList";
import LoadingSpinner from "components/messageModal/LoadingSpinner";
import { Link } from "react-router-dom";
import Avatar from "components/image/Avatar";
import { isNonEmptyString, removeWhitespaces } from "helpers";
import moment from "moment";
import CustomButton from "components/customButton/CustomButton";
import { useMutation, useQueryClient } from "react-query";
import { updateEvent } from "services/eventsApi";
import Swal from "sweetalert2";
import { useEffect } from "react";

function EventList({ isPostCreator, postData, userId, handleClose }) {
  const { data, isLoading } = useEventList(isPostCreator, userId);

  return isLoading ? (
    <LoadingSpinner />
  ) : !data?.length ? (
    <p>No Data</p>
  ) : (
    data?.map((item) => {
      return (
        <EventRow item={item} key={item?.id} isPostCreator={isPostCreator} />
      );
    })
  );
}

const EventRow = ({ item, isPostCreator }) => {
  console.log({ item });
  const FullName =
    isNonEmptyString(item?.forename) && isNonEmptyString(item?.surname)
      ? `${item?.forename}  ${item?.surname}`
      : "";
  const userProfileUrl = FullName.concat("_", item?.from_user_id);
  const [type, setType] = useState(null);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(updateEvent, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["eventList", item?.post_id + ""]);
    },
    onError: (err) =>
      Swal.fire({
        title: "Error",
        text: err?.response?.data?.message,
        icon: "error",
      }),
    onSettled: async () => {
      setType(null);
    },
  });

  const handleAccept = () => {
    setType("accept");
    mutate({
      ...item,
      event_accepted: "1",
    });
  };
  const handleReject = () => {
    setType("reject");

    mutate({
      ...item,
      event_accepted: "0",
    });
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
        <Link to={`/profile/${removeWhitespaces(userProfileUrl)}`}>
          <Avatar
            src={item?.profile_image}
            firstName={item?.forename}
            lastName={item?.surname}
          />
        </Link>

        <div className="mx-2  mb-0" style={{ flex: 1 }}>
          <p className="mb-0">{item?.title}</p>

          <p className="mb-0">{item?.description}</p>
        </div>

        <div className="">
          <p className="mb-0"><small>{item?.date}</small></p>

          <p className="mb-0">
            <small>
            {moment(item?.time, "HH:mm").format("hh:mm A")}
            </small>
          </p>
        </div>

        {!isPostCreator ? (
          <div>
            {item?.event_accepted == "1" && (
              <CustomButton title={"Accepted"} className={"ms-2 btn-sm"} disabled />
            )}
            {item?.event_accepted == "0" && (
              <CustomButton
                title={"Rejected"}
                className={"unfollow-btn btn-sm ms-2"}
                disabled
              />
            )}
          </div>
        ) : item?.event_accepted ? (
          <div>
            {item?.event_accepted == "1" && (
              <CustomButton title={"Accepted"} className={"ms-2 btn-sm"} disabled />
            )}
            {item?.event_accepted == "0" && (
              <CustomButton
                title={"Rejected"}
                className={"unfollow-btn btn-sm ms-2"}
                disabled
              />
            )}
          </div>
        ) : (
          <div>
            <CustomButton
              title={"Accept"}
              className={"ms-2 btn-sm"}
              isLoading={isLoading && type === "accept"}
              disabled={isLoading}
              onClick={handleAccept}
            />
            <CustomButton
              title={"Reject"}
              className={"unfollow-btn btn-sm"}
              isLoading={isLoading && type === "reject"}
              disabled={isLoading}
              onClick={handleReject}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
