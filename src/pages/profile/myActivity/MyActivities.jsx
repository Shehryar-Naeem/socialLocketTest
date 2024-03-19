import React, { useState } from "react";
import ModalComponent from "../../../components/modalComponent/ModalComponent";
import useMyActivity from "./useMyActivity";
import ActivityCard from "./ActivityCard";

function MyActivities() {
  const [activity, setActivity] = useState(null);
  const { data, isLoading, isError } = useMyActivity(activity);
  return (
    <>
      <button
        type="button"
        className="btn btn-common btn-follow px-3 "
        onClick={() => setActivity("myLikes")}
      >
        <i className="fa-regular fa-heart"></i>
      </button>
      <button
        type="button"
        className="btn btn-common btn-follow px-3 "
        onClick={() => setActivity("myComments")}
      >
        <i className="fa-regular fa-comments"></i>
      </button>
      <ModalComponent
        show={!!activity}
        onHide={() => setActivity(null)}
        heading={activity === "myLikes" ? "My Likes" : "My Comments"}
        size="xl"
      >
        <div className="notification">
          <ul>
            {isLoading ? (
              <div>Loading...</div>
            ) : !data?.length ? (
              <div>No data found</div>
            ) : (
              <>
                {data?.map((item) => (
                  <ActivityCard
                    item={item}
                    key={item?.id + ""}
                    type={activity}
                  />
                ))}
              </>
            )}
          </ul>
        </div>
      </ModalComponent>
    </>
  );
}

export default MyActivities;
