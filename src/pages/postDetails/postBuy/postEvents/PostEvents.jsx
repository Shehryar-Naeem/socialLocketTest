import CustomButton from "components/customButton/CustomButton";
import ModalComponent from "components/modalComponent/ModalComponent";
import React, { useState } from "react";
import CreatePostEvent from "./CreatePostEvent";
import EventList from "./eventList/EventList";

function PostEvents({ postData, userId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const handleListModalOpen = () => setIsListModalOpen((prev) => !prev);
  return (
    <>
      {/* <CustomButton
        title={"Create an event"}
        onClick={() => setIsModalOpen((prev) => !prev)}
      /> */}
      <div className="w-100 d-flex">
        <div className="d-flex align-items-center justify-content-between gap-10 w-100">
          <h6 className="mb-0">Events List</h6>
          <div>
            {Number(postData?.user_id) !== Number(userId) && (
              <CustomButton
                title={"Create Event"}
                className={"btn-sm"}
                onClick={() => setIsModalOpen((prev) => !prev)}
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

      <ModalComponent
        show={isModalOpen}
        onHide={() => setIsModalOpen((prev) => !prev)}
        size="lg"
        heading={"Create an event"}
      >
        <CreatePostEvent
          postData={postData}
          userId={userId}
          handleClose={() => setIsModalOpen((prev) => !prev)}
        />
      </ModalComponent>

      <ModalComponent
        show={isListModalOpen}
        onHide={handleListModalOpen}
        size="lg"
        heading={"Event List"}
      >
        <EventList
          postData={postData}
          userId={userId}
          handleClose={() => setIsModalOpen((prev) => !prev)}
          isPostCreator={postData?.user_id == userId}
        />
      </ModalComponent>
    </>
  );
}

export default PostEvents;
