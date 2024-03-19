/* eslint-disable react/no-danger */
import OwlCarousel from "react-owl-carousel";
import { Link, useNavigate } from "react-router-dom";
// import { useQuery } from "react-query";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthContext } from "../../../context/authContext";
import {
  formatDate,
  getInitials,
  isNonEmptyString,
  parseStringArray,
  removeQuestionAndForwardSlash,
  removeWhitespaces,
} from "../../../helpers";
import { API } from "../../../services/ApiClient";
import Comments from "./Comments";
import Image from "../../../components/image/Image";
import PostStatus from "pages/profile/components/postStatus/PostStatus";
import useGetVerification from "hooks/query/AllUserProfile/useGetVerification";
import PaymentLogo from "components/paymentLogo";

const MAX_LENGTH = 150;

const Posts = (props) => {
  const verificationBadge = useGetVerification(
    props?.post?.user_verification == "1"
  );
  const postId = props?.post?.id ? props?.post?.id.toString() : "";
  const userId = props?.post?.user_id ? props?.post?.user_id.toString() : "";
  const { auth } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  // user_id
  const userTitle = props?.post?.title ? props?.post?.title : "";
  const titleLink = removeQuestionAndForwardSlash(
    postId.concat("_", userTitle)
  );
  const FullName =
    isNonEmptyString(props?.post?.forename) &&
    isNonEmptyString(props?.post?.surname)
      ? `${props?.post?.forename}  ${props?.post?.surname}`
      : "";
  const userProfileUrl = FullName.concat("_", userId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data } = useQuery(["post-likes"], () =>
    API.get(`post-likes`).then((res) => {
      return res.data.result;
    })
  );
  // console.log("PostLikes", PostLikes);
  const { mutate: likePost, isLoading: isLikePostLoading } = useMutation(
    async (payload) => {
      // if (payload.newIsLiked)
      return API.post("post-likes", payload);
    },
    {
      onSuccess: async (data) => {
        if (data) {
          await queryClient.invalidateQueries(["posts"]);
          await queryClient.invalidateQueries(["post-likes"]);
        }
      },
    }
  );

  useEffect(() => {
    const userLiked =
      data &&
      data.some(
        (like) =>
          like.user_id === Number(auth?.userId) &&
          like.post_id === Number(props?.post?.id)
      );
    setIsLiked(userLiked);
  }, [data, auth.userId, props.post.id, props?.post?.total_likes]);

  const { mutate: disLikePost } = useMutation(
    async (payload) => {
      return API.delete(`post-likes/${payload?.post_id}`, {
        data: payload,
      });
    },
    {
      onSuccess: async (data) => {
        if (data) {
          await queryClient.invalidateQueries(["posts"]);
          await queryClient.invalidateQueries(["post-likes"]);
        }
      },
    }
  );

  const handleLike = (postId) => {
    // const userLiked =
    //   data &&
    //   data.some(
    //     (like) => like.user_id === auth?.userId && like.post_id === props?.post?.id,
    //   );
    if (!auth?.userId) {
      return navigate("/login");
    }
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    const payloadData = {
      user_who_triggered_notify_id: auth?.userId,
      post_id: postId,
      likes: newIsLiked ? 1 : 0,
      //user_id: props?.post?.user_id,
      user_id: auth?.userId,
      opened: 0,
      user_to_notify_id: props?.post?.user_id,
    };
    if (newIsLiked) {
      likePost(payloadData);
    } else if (newIsLiked === false) {
      disLikePost(payloadData);
    }
    // setIsLiked(!isLiked);
  };
  const onCommentsClick = (isBuy) => {
    if (isBuy) {
      return navigate(`post-detail/${removeWhitespaces(titleLink)}`);
    }
    navigate(`post/${removeWhitespaces(titleLink)}`);
  };

  const extractFirstParagraph = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const paragraphs = doc.getElementsByTagName("p");

    if (paragraphs.length > 0) {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = paragraphs[0].innerHTML;
      return tempElement.innerText;
    }

    return "";
  };

  // Usage
  const MAX_LENGTH = 200;
  const firstParagraph = extractFirstParagraph(props?.post?.description);

  // Like animation
  const [liked, setLiked] = useState(false);
  const [usingMouse, setUsingMouse] = useState(false);

  const handleHeartIt = (e) => {
    const hearts = document.createElement("div");
    hearts.innerHTML = `
      <svg className="heart heart-pop one" viewBox="0 0 32 29.6">
        <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
      </svg>
      <svg className="heart heart-pop two" viewBox="0 0 32 29.6">
        <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
      </svg>
      <svg className="heart heart-pop three" viewBox="0 0 32 29.6">
        <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
      </svg>
      <svg className="heart heart-pop four" viewBox="0 0 32 29.6">
        <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
      </svg>
      <svg className="heart heart-pop five" viewBox="0 0 32 29.6">
        <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
      </svg>
      <svg className="heart heart-pop six" viewBox="0 0 32 29.6">
        <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
      </svg>
      <svg className="heart heart-pop seven" viewBox="0 0 32 29.6">
        <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
      </svg>
      <svg className="heart heart-pop eight" viewBox="0 0 32 29.6">
        <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
      </svg>
      <svg className="heart heart-pop nine" viewBox="0 0 32 29.6">
        <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
      </svg>
    `;
    e.target.appendChild(hearts);
    setLiked(!liked);
    setTimeout(function () {
      e.target.removeChild(hearts);
    }, 3000);
  };

  useEffect(() => {
    const handleMouseDown = () => {
      setUsingMouse(true);
    };

    const handleKeyDown = () => {
      setUsingMouse(false);
    };

    document.body.addEventListener("mousedown", handleMouseDown);
    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.removeEventListener("mousedown", handleMouseDown);
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  // Like animation

  return (
    <div className="post">
      <ul>
        <li>
          <div className="post-section">
            <div className="user-post">
              <Link
                to={`/profile/${removeWhitespaces(userProfileUrl)}`}
                className="post-profile"
              >
                <figure>
                  {verificationBadge}
                  {isNonEmptyString(props?.post?.profile_image) ? (
                    <picture>
                      <source
                        srcSet={props?.post?.profile_image}
                        type="image/webp"
                      />
                      <source
                        srcSet={props?.post?.profile_image}
                        type="image/png"
                      />
                      <img
                        loading="lazy"
                        src={props?.post?.profile_image}
                        data-src={props?.post?.profile_image}
                        alt="user-img"
                        className="img-fluid"
                        width={50}
                        height={50}
                      />
                    </picture>
                  ) : (
                    <span>
                      {isNonEmptyString(props?.post?.forename) &&
                      isNonEmptyString(props?.post?.surname)
                        ? getInitials(
                            `${props?.post?.forename}  ${props?.post?.surname}`
                          )
                        : ""}
                    </span>
                  )}
                </figure>
                <figcaption>
                  <h5 className="mb-0">
                    {isNonEmptyString(props?.post?.forename) &&
                    isNonEmptyString(props?.post?.surname)
                      ? `${props?.post?.forename}  ${props?.post?.surname}`
                      : "User"}
                  </h5>
                  <span>
                    {isNonEmptyString(props?.post?.created)
                      ? formatDate(props?.post?.created)
                      : ""}
                  </span>
                </figcaption>
              </Link>
              {/* <div className="price-btn">
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => onCommentsClick(true)}
                >
                  Buy This Post
                </button>
              </div> */}
              <div className="post-purchasing">
                <PostStatus item={props?.post} />
                <PaymentLogo />
              </div>
            </div>
            <div className="post-image">
              <div className="post-title">
                <h5>
                  <Link
                    to={`post/${removeWhitespaces(titleLink)}`}
                    state={{ id: props?.post?.id }}
                  >
                    {props?.post?.title}
                  </Link>
                </h5>

                <p>
                  {props?.post?.description.length > MAX_LENGTH ? (
                    <>
                      {firstParagraph.substring(0, MAX_LENGTH)}
                      {firstParagraph.length > MAX_LENGTH && "..."}
                    </>
                  ) : (
                    firstParagraph
                  )}
                </p>

                {/* {props?.post?.description.length > MAX_LENGTH ? (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: `${props?.post?.description.substring(
                        0,
                        MAX_LENGTH
                      )}...`,
                    }}
                  />
                ) : (
                  <p>
                    {props?.post?.description
                      ? parse(props?.post?.description)
                      : ""}
                  </p>
                )} */}
                <Link
                  to={`post/${removeWhitespaces(titleLink)}`}
                  state={{ id: props?.post?.id }}
                >
                  Please click here for more information
                </Link>
              </div>
              {props?.post.images !== null ? (
                <OwlCarousel
                  items={1}
                  margin={2}
                  autoplay={true}
                  autoplayTimeout={5000}
                  className="owl-carousel owl-theme post-slider"
                  dots={false}
                  loop
                >
                  {props?.post?.images ? (
                    parseStringArray(props?.post?.images)?.length ? (
                      parseStringArray(props?.post?.images)?.map(
                        (imgItem, idx) => (
                          <div key={idx} className="item">
                            <picture>
                              {/* <source srcSet={imgItem} type="image/webp" />
                              <source srcSet={imgItem} type="image/png" /> */}
                              <img
                                loading="lazy"
                                srcSet={imgItem}
                                alt="post"
                                className="post-img"
                                // width="670"
                                // height="440"
                              />
                            </picture>
                          </div>
                        )
                      )
                    ) : (
                      <Image />
                    )
                  ) : (
                    <Image src={""} />
                  )}
                </OwlCarousel>
              ) : (
                ""
              )}
            </div>
            <div className="like-comment-count">
              <button onClick={() => handleLike(props?.post?.id)} type="button">
                <span className={`like-count ${isLiked ? "unlike" : ""}`}>
                  {/* <a href="/" className="like-button"> */}
                  <i className="fa-solid fa-thumbs-up" /> {/* </a> */}
                  {/* <span>36k Likes</span> */}
                  <span>
                    {props?.post.total_likes == null
                      ? 0
                      : props?.post.total_likes}
                    {isLiked ? " Unlike" : " Likes"}
                  </span>
                </span>
              </button>
              <button
                type="button"
                // disabled={!isNumber(auth?.userId)}
                onClick={onCommentsClick}
              >
                <span className="comment-count">
                  <i className="fa fa-message" />
                  {/* <img src="../../assets/images/comment-icon.png" alt="comment" width="20" height="18"> */}{" "}
                  {/* <span>12k Comments</span> */}
                  {props?.post?.total_comments == null ? (
                    "Be First to Comment"
                  ) : (
                    <span>{props?.post?.total_comments} Comments</span>
                  )}
                </span>
              </button>
            </div>
          </div>
          {commentOpen && (
            <Comments post={props?.post} postId={props?.post?.id} />
          )}
        </li>
      </ul>
    </div>
  );
};

export default Posts;
