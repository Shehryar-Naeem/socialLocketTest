/* eslint-disable react/jsx-no-useless-fragment */
import parse from "html-react-parser";
import { useContext, useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import {
  formatDate,
  getInitials,
  isNonEmptyArray,
  isNonEmptyString,
  parseStringArray,
  removeQuestionAndForwardSlash,
  removeWhitespaces,
} from "../../helpers";
import { API } from "../../services/ApiClient";
import "../../styles/globalStyles.css";
import Comments from "../home/components/Comments";
import usePostDetails from "./usePostDetails";
import { PostDetailContext } from "./PostDetailContext";
import PostStatus from "pages/profile/components/postStatus/PostStatus";
import useGetVerification from "hooks/query/AllUserProfile/useGetVerification";
import PaymentLogo from "components/paymentLogo";

const PostDetailMain = () => {
  const { isGroupMember } = useContext(PostDetailContext);

  const { postsDetailsData, navigate, isOpenForBuy, postId, auth } =
    usePostDetails();
  const queryClient = useQueryClient();
  const params = useParams();
  const { mutate: likePost, isLoading: isLikePostLoading } = useMutation(
    async (payload) => {
      // if (payload.newIsLiked)
      return API.post("post-likes", payload);
    },
    {
      onSuccess: async (data) => {
        if (data) {
          await queryClient.invalidateQueries(["posts-id", postId]);
          queryClient.invalidateQueries(["posts"]);
          queryClient.invalidateQueries(["post-likes"]);
        }
      },
    }
  );

  const verificationBadge = useGetVerification(
    postsDetailsData?.[0]?.user_verification == "1"
  );

  const postVerificationBadge = useGetVerification(
    postsDetailsData?.[0]?.post_verification == "1",
    {
      // top: -10,
      // right: -10,
      // height: 30,
      // width: 30,
    }
  );

  const { mutate: disLikePost } = useMutation(
    async (payload) => {
      return API.delete(`post-likes/${payload?.post_id}`, {
        data: payload,
      });
    },
    {
      onSuccess: async (data) => {
        if (data) {
          await queryClient.invalidateQueries(["posts-id", postId]);
          queryClient.invalidateQueries(["posts"]);
          queryClient.invalidateQueries(["post-likes"]);
        }
      },
    }
  );

  const { data } = useQuery(["post-likes"], () =>
    API.get(`post-likes`).then((res) => {
      return res.data.result;
    })
  );

  useEffect(() => {
    const userLiked =
      data &&
      data.some(
        (like) =>
          like.user_id === Number(auth?.userId) &&
          like.post_id === Number(postId)
      );

    setIsLiked(userLiked);
  }, [data, auth.userId, postId]);

  const [isLiked, setIsLiked] = useState(false);
  const handleLike = () => {
    if (!auth?.userId) {
      return navigate("/login");
    }
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    const payloadData = {
      user_who_triggered_notify_id: auth?.userId,
      post_id: postId,
      likes: newIsLiked ? 1 : 0,
      user_id: auth?.userId,
      opened: 0,
      user_to_notify_id: postsDetailsData?.[0]?.user_id,
    };
    if (newIsLiked) {
      likePost(payloadData);
    } else if (newIsLiked === false) {
      disLikePost(payloadData);
    }
  };
  // const [commentOpen, setCommentOpen] = useState(true);
  // const id = getIdValue(params);
  // const {
  //   isLoading: postsDetailsLoading,
  //   error: postsDetailsError,
  //   data: postsDetailsData,
  // } = usePostsById(id);

  const FullName =
    isNonEmptyString(postsDetailsData?.[0]?.forename) &&
    isNonEmptyString(postsDetailsData?.[0]?.surname)
      ? `${postsDetailsData?.[0]?.forename}  ${postsDetailsData?.[0]?.surname}`
      : "";
  const userProfileUrl = FullName.concat("_", postsDetailsData?.[0]?.user_id);

  return (
    <>
      {isNonEmptyArray(postsDetailsData)
        ? postsDetailsData.map((item, idx) => (
            <main id="layoutSidenav_content" key={item?.id}>
              {/* <div className="">
                <div>
                  <div className="progressbar mb-3">
                    <div className="d-flex justify-content-between">
                      <h5>Payment Process</h5> <span>4 Steps to Complete</span>
                    </div>
                    <div className="progress-flex">
                      <div className="arrow-steps clearfix">
                        <div className="step current">
                          {" "}
                          <span>
                            <a href="#">Document Uploaded</a>
                          </span>{" "}
                        </div>
                        <div className="step current">
                          {" "}
                          <span>
                            <a href="#">Initial Payment Made</a>
                          </span>{" "}
                        </div>
                        <div className="step current">
                          {" "}
                          <span>
                            {" "}
                            <a href="#">Final Payment</a>
                          </span>{" "}
                        </div>
                        <div className="step ">
                          {" "}
                          <span>Complete</span>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              <div key={idx} className="post position-relative">
                <ul>
                  <li>
                    <div className="post-section post-section-inner-page">
                      <div className="user-post">
                        <Link
                          to={`/profile/${removeWhitespaces(userProfileUrl)}`}
                          className="post-profile"
                        >
                          <figure>
                            {verificationBadge}

                            {isNonEmptyString(item?.profile_image) ? (
                              <picture>
                                <source
                                  srcSet={item?.profile_image}
                                  type="image/webp"
                                />
                                <source
                                  srcSet={item?.profile_image}
                                  type="image/png"
                                />
                                <img
                                  loading="lazy"
                                  src={item?.profile_image}
                                  data-src={item?.profile_image}
                                  alt="user-img"
                                  style={{width:"100%",height:"100%"}}  
                                  width={50}
                                  height={50}
                                />
                              </picture>
                            ) : (
                              <span>
                                {isNonEmptyString(item?.forename) &&
                                isNonEmptyString(item?.surname)
                                  ? getInitials(
                                      `${item?.forename}  ${item?.surname}`
                                    )
                                  : ""}
                              </span>
                            )}
                          </figure>
                          <figcaption>
                            <h5 className="mb-0">
                              {isNonEmptyString(item?.forename) &&
                              isNonEmptyString(item?.surname)
                                ? `${item?.forename}  ${item?.surname}`
                                : ""}
                            </h5>
                            <span>
                              {isNonEmptyString(item?.created)
                                ? formatDate(item?.created)
                                : ""}
                            </span>
                          </figcaption>
                        </Link>
                        {/* <div className="price-btn">
                          <button
                            type="button"
                            className="btn btn-outline-success"
                            onClick={() =>
                              navigate(
                                `/post-detail/${removeQuestionAndForwardSlash(
                                  params?.title
                                )}`
                              )
                            }
                            disabled={isOpenForBuy}
                          >
                            {item?.price ? `${item.price}` : ""}
                          </button>
                        </div> */}
                        <div className="post-purchasing">
                          <PostStatus item={item} />
                          <PaymentLogo />
                        </div>
                      </div>
                      <div className="post-image">
                        {postVerificationBadge}
                        <div className="post-title">
                          <h2>{item?.title}</h2>
                        </div>
                        {item?.images !== null ? (
                          <OwlCarousel
                            items={1}
                            margin={8}
                            autoplay
                            className="owl-carousel owl-theme post-slider"
                            loop
                          >
                            {parseStringArray(item.images ?? "")?.map(
                              (imgItem, idx) => (
                                <div key={idx} className="item">
                                  <picture>
                                    <source
                                      srcSet={imgItem}
                                      type="image/webp"
                                    />
                                    <source srcSet={imgItem} type="image/png" />
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
                            )}
                          </OwlCarousel>
                        ) : (
                          ""
                        )}
                        <div className="inner-page-content">
                          {parse(item?.description)}
                        </div>
                      </div>
                      <div className="like-comment-count">
                        <button type="button" onClick={() => handleLike()}>
                          <span
                            className={`like-count ${isLiked ? "unlike" : ""}`}
                          >
                            {/* <a href="/" className="like-button"> */}
                            <i className="fa-solid fa-thumbs-up" /> {/* </a> */}
                            {/* <span>36k Likes</span> */}
                            <span>
                              {item?.total_likes == null
                                ? 0
                                : item?.total_likes}{" "}
                              {isLiked ? "Unlike" : "Like"}
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          // onClick={() => setCommentOpen(!commentOpen)}
                        >
                          <span className="comment-count">
                            <i className="fa fa-message" />

                            {item?.total_comments == null ? (
                              "Be First to Comment"
                            ) : (
                              <span>{item?.total_comments} Comments</span>
                            )}
                          </span>
                        </button>
                      </div>
                    </div>
                    {isOpenForBuy && isGroupMember && (
                      <Comments post={item} postId={postId} />
                    )}
                  </li>
                </ul>
              </div>
            </main>
          ))
        : null}
    </>
  );
};

export default PostDetailMain;
