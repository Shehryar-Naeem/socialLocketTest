import React, { useContext, useEffect, useRef, useState } from "react";

import { userService } from "../../../services/UserService";
import { AuthContext } from "../../../context/authContext";
import moment from "moment/moment";
import useMessage from "./useMessage";
function Message({ currentUser, handleClose }) {
  const { auth } = useContext(AuthContext);
  const [message, setMessage] = useState([]);
  const { data, isLoading, refetch } = useMessage({
    currentUserId: currentUser?.users_members_id ?? currentUser?.id,
    userId: auth?.userId,
  });
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  // useEffect(() => {
  //   getMessage();
  //   let temp = [...data, ...data2];

  //   temp.sort(function (a, b) {
  //     // Turn your strings into dates, and then subtract them
  //     // to get a value that is either negative, positive, or zero.
  //     return (
  //       new Date(moment(b.created).toDate()) -
  //       new Date(moment(a.created).toDate())
  //     );
  //   });
  //   setMessages(temp.reverse());
  // }, [currentUser]);
  // const getMessage = async () => {
  //   try {
  //     let res = await userService.getMessages({
  //       data: {
  //         to_user_id: currentUser?.id,
  //         from_user_id: auth?.userId,
  //       },
  //       userId: auth?.userId,
  //     });
  //     console.log({ messages: res });
  //   } catch (error) {}
  // };
  // const quesry

  const onSendMessage = async () => {
    message?.trim()?.length &&
      (await userService.createMessages({
        data: {
          to_user_id: currentUser?.users_members_id ?? currentUser?.id,
          from_user_id: auth?.userId,
          message,
        },
      }));
    refetch();

    setMessage("");

    // await getMessage();
  };

  return (
    <div className="chatbot-message">
      <div className="chatbot-message-header">
        <div className="chatbot-message-Profile">
          <figure>
            <picture>
              {/* <source
                type="image/webp"
                srcset="http://res.cloudinary.com/dzs0eyrnl/image/upload/v1682429808/zewn5p1rfzdkch4vw3gg.png"
              />
              <source
                type="image/png"
                srcset="http://res.cloudinary.com/dzs0eyrnl/image/upload/v1682429808/zewn5p1rfzdkch4vw3gg.png"
              /> */}
              {/* <img
                loading="lazy"
                src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                alt="user-img"
                className="img-fluid"
                width="120"
                height="120"
                data-src="http://res.cloudinary.com/dzs0eyrnl/image/upload/v1682429808/zewn5p1rfzdkch4vw3gg.png"
              /> */}
              (
              {currentUser?.profile_image ? (
                <img
                  loading="lazy"
                  src={
                    currentUser?.profile_image ??
                    "data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                  }
                  alt="user-img"
                  className="img-fluid"
                  width="120"
                  height="120"
                  data-src="http://res.cloudinary.com/dzs0eyrnl/image/upload/v1682429808/zewn5p1rfzdkch4vw3gg.png"
                />
              ) : (
                <div>{currentUser?.forename[0]}</div>
              )}
              )
            </picture>
          </figure>
          <figcaption>
            <div>
              <h6 className="mb-0">Chat with</h6>
              <h4 className="mb-0">
                {(currentUser?.forename ?? "") +
                  " " +
                  (currentUser?.surname ?? "")}
              </h4>
            </div>
          </figcaption>
        </div>
        <button onClick={handleClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      {isLoading ? (
        <div>Loading Messages...</div>
      ) : (
        <div className="chatbot-message-area">
          <div className="chatbot-message-area-scroll">
            {data?.map((item) => (
              <div
                key={item?.id}
                style={{
                  justifyContent:
                    auth?.userId !== item?.to_user_id
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <div className="chatbot-conversation">
                  <p>{item?.message}</p>
                  <div className="chatbot-conversation-timing">
                    <span>{moment(item?.created).format("DD MM YYYY")}</span>
                    <span>{moment(item?.created).format("hh:mm A")}</span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="d-flex chatbot-message-send">
            <input
              value={message}
              onChange={(event) => setMessage(event?.target?.value)}
              placeholder="Enter your message"
              onKeyDown={(event) => {
                if (event.keyCode === 13) {
                  onSendMessage();
                }
              }}
            />
            <button onClick={onSendMessage}>
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;
