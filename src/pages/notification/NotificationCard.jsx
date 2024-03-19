import React from "react";
import {
  removeQuestionAndForwardSlash,
  removeWhitespaces,
} from "../../helpers";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../components/image/Avatar";
import moment from "moment";
import { Badge } from "react-bootstrap";

function NotificationCard({ item }) {
  const userTitle = item?.notification_message
    ? item?.notification_message
    : "";
  const titleLink = removeQuestionAndForwardSlash(
    (item?.id + "")?.concat("_", userTitle)
  );
  const navigate = useNavigate();
  const getUserUrl = ({ forename, surName, userId }) => {
    const fullName = forename + " " + surName;
    const userProfileUrl = fullName.concat("_", userId);
    return removeWhitespaces(userProfileUrl);
  };
  return (
    <li className="p-3">
      {/* <Link to={`/post/${removeWhitespaces(titleLink)}`} className="d-flex"> */}
      <div className="w-100 d-flex">
        <div className="w-100">
          <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
            <h5>
              <Link to={`/post/${removeWhitespaces(titleLink)}`}>
                {item?.notification_message}
              </Link>{" "}
            </h5>
            <div className="">
              <Badge bg="success">{item?.currency + "" + item?.price}</Badge>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-between align-items-center">
              <Link
                to={`/profile/${getUserUrl({
                  forename: item?.forename,
                  surName: item?.surname,
                  userId: item?.user_id_who_triggered_notification,
                })}`}
              >
                <Avatar
                  firstName={item?.forename}
                  lastName={item?.surname}
                  src={item?.profile_image}
                />
              </Link>
              <div className="ms-2">
                <h6
                  className="mb-0"
                  onClick={() =>
                    navigate(
                      `/profile/${getUserUrl({
                        forename: item?.forename,
                        surName: item?.surname,
                        userId: item?.user_id_who_triggered_notification,
                      })}`
                    )
                  }
                >
                  {item?.forename} {item?.surname}
                </h6>
                <p className="mb-0">
                  <small>{item?.text}</small>
                </p>
              </div>
            </div>
            <span className="ms-2">
              {!!item?.created && moment(item?.created).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}

export default NotificationCard;
