/* eslint-disable jsx-a11y/img-redundant-alt */
import Badge from "react-bootstrap/Badge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import {
  parseStringArray,
  removeQuestionAndForwardSlash,
  removeWhitespaces,
} from "../../../helpers";
import Placeholder from "../../../assets/images/user-img.png";
import useDeletePost from "../../createPost/useDeletePost";
import Image from "../../../components/image/Image";
import ModalComponent from "components/modalComponent/ModalComponent";
import { useState } from "react";
import CustomInput from "components/customInput/CustomInput";
import UpdateSoldPrice from "./updateSoldPrice/UpdateSoldPrice";
const UserPosts = ({ usersPost, userId }) => {
  // console.log('usersPost', usersPost);
  // const navigate = useNavigate();
  //  const userTitle = props?.post?.title? props?.post?.title : "";
  //  const titleLink = postId.concat("_", userTitle);
  // const onImageClick = (postId, title) => {
  //   console.log(postId, title);
  //   const id = postId.toString();
  //   const userTitle= title;
  //    const titleLink = id.concat("_", userTitle);
  //     navigate(`/postDetails/${removeWhitespaces(titleLink)}`);
  // }
  const { mutate } = useDeletePost(userId);
  const [isUpdatePrice, setIsUpdatePrice] = useState(null);

  const customTooltipStyle = {
    padding: "5px", // Adjust padding as needed
    margin: "0", // Adjust margin as needed
  };

  // console.log({ usersPost });
  return (
    <div className="post-grid">
      <ul className="box-container three-cols">
        {usersPost !== null ? (
          usersPost?.map((item, idx) => (
            <li key={idx} className="box show">
              <div className="inner">
                <Link
                  to={`/post/${removeWhitespaces(
                    removeQuestionAndForwardSlash(
                      item?.id?.toString()?.concat("_", item?.title)
                    )
                  )}`}
                  // onClick={() => onImageClick(item?.id, item?.title)}
                  className="glightbox"
                >
                  <div className="post-grid-image">
                    <Image src={parseStringArray(item?.images)?.[0]} />
                    {/* {item?.offer_price && !item?.purchased_price ? (
                      <span
                        className="status under_offer"
                        style={{ background: "orange" }}
                      >
                        Under offer
                      </span>
                    ) */}
                    {item?.status === "Under Offer" ? (
                      <span
                        className="status under_offer"
                        style={{ background: "orange" }}
                      >
                        Under Offer
                      </span>
                    ) : item?.purchased_price &&
                      Number(item?.customer_user_id) === Number(userId) ? (
                      <span className="status purchased">Purchased</span>
                    ) : item?.purchased_price &&
                      Number(item?.customer_user_id) !== Number(userId) ? (
                      <span className="status sold">Sold</span>
                    ) : (
                      <span className="status available">Available</span>
                    )}
                  </div>
                  <h5>{item?.title ? item?.title : ""}</h5>
                </Link>
                {/* <div className="d-flex justify-content-between">
                  <p className="post-price mb-0">
                    {item?.price ? `${item.price}` : ""}
                  </p>
                </div> */}
                <div className="d-flex justify-content-between align-items-center">
                  <Badge bg="success">
                    {item?.price ? `${item?.currency}${item?.price}` : ""}
                  </Badge>
                  {userId === item?.user_id && (
                    <div className="d-flex justify-content-end align-items-center">
                      {!item?.purchased_price && !item?.customer_user_id && (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip style={customTooltipStyle}>
                              Purchase Price
                            </Tooltip>
                          }
                        >
                          <div
                            onClick={() => setIsUpdatePrice(item)}
                            className="btn btn-warning btn-sm me-2"
                          >
                            <i
                              className="fa fa-tags"
                              style={{ color: "white" }}
                            ></i>{" "}
                          </div>
                        </OverlayTrigger>
                      )}

                      {!item?.purchased_price && !item?.customer_user_id && (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip style={customTooltipStyle}>
                              Edit Property
                            </Tooltip>
                          }
                        >
                          <Link
                            to="/update-post"
                            className="btn btn-common btn-sm me-2"
                            state={{
                              post: item,
                              title: item?.title,
                            }}
                          >
                            <i className="fa fa-edit"></i>{" "}
                          </Link>
                        </OverlayTrigger>
                      )}

                      {!item?.purchased_price && !item?.customer_user_id && (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip style={customTooltipStyle}>
                              Delete Property
                            </Tooltip>
                          }
                        >
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              mutate({
                                id: item.id,
                              })
                            }
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </OverlayTrigger>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No Posts</p>
        )}
      </ul>

      <ModalComponent
        show={!!isUpdatePrice}
        onHide={() => setIsUpdatePrice(null)}
        size="xs"
        heading="Enter Sale Price"
      >
        <UpdateSoldPrice
          handleClose={() => setIsUpdatePrice(null)}
          postData={isUpdatePrice}
        />
      </ModalComponent>
    </div>
  );
};

export default UserPosts;
