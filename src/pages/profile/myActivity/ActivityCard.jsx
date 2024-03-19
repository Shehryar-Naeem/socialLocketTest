import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import {
  parseStringArray,
  removeQuestionAndForwardSlash,
  removeWhitespaces,
} from "../../../helpers";
import Badge from "react-bootstrap/Badge";
import Image from "../../../components/image/Image";

function ActivityCard({ item, type }) {
  const titleLink = removeWhitespaces(
    removeQuestionAndForwardSlash(item?.post_id + "".concat("_", item?.title))
  );

  return (
    <li>
      <div className="user-post">
        <Link
          to={`/post/${titleLink}`}
          className="active cursor-pointer"
          style={{ cursor: "pointer" }}
        >
          <figure>
            {/* <img className="img-fluid" src={firstImageUrl} alt="First Image" /> */}
            <Image
              imageClassName="img-fluid"
              src={parseStringArray(item?.images)?.[0]}
              imageStyle={{
                height: 220,
              }}
              errorImageStyle={{
                objectFit: "contain",
              }}
            />
          </figure>
          <figcaption>
            <p className="mb-0">
              {/* <strong>You</strong>{" "}
            {!!item?.comment ? "commented on" : "liked on"}{" "}
            <strong>
              {item?.comment || item?.forename}
              {""} {item?.comment || item?.surname}
            </strong>{" "}
            :{" "} */}
            </p>

            <h5>{item?.title}</h5>
            {type === "myComments" && (
              <h6 className="my-comments">
                <small>
                  <strong>Your Comments:</strong> {item?.comment}
                </small>
              </h6>
            )}
            <div className="d-flex justify-content-between align-items-center">
              {/* <Badge bg="success">{item?.comment || item?.price}</Badge> */}
              <Badge bg="success">{item?.currency + "" + item?.price}</Badge>
              <div className="flex-shrink-0 dropdown">
                <span>
                  {!!item?.created && moment(item?.created).fromNow()}
                </span>
              </div>
            </div>
          </figcaption>
        </Link>
      </div>
    </li>
  );
}

export default ActivityCard;
