import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  parseStringArray,
  removeQuestionAndForwardSlash,
  removeWhitespaces,
} from "../../../helpers";
import moment from "moment";
import parse from "html-react-parser";
import Placeholder from "../../../assets/images/user-img.png";
import { useMutation, useQueryClient } from "react-query";
import { API } from "../../../services/ApiClient";
import { AuthContext } from "../../../context/authContext";
import LoadingSpinner from "../../../components/messageModal/LoadingSpinner";
import Image from "../../../components/image/Image";
import PostStatus from "pages/profile/components/postStatus/PostStatus";

const MAX_LENGTH = 200;

function PostSearchCard({ post, fetchInitialsPost, postLikedData }) {
  const { auth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const { titleLink, postId } = useMemo(() => {
    const postId = post?.id ? post?.id.toString() : "";
    const userTitle = post?.title ? post?.title : "";
    const titleLink = postId.concat("_", userTitle);

    return { titleLink, postId };
  }, [post]);

  useEffect(() => {
    const userLiked =
      postLikedData &&
      postLikedData.some(
        (like) =>
          like.user_id === Number(auth?.userId) &&
          like.post_id === Number(postId)
      );
    setIsLiked(userLiked);
  }, [postLikedData, auth.userId, postId]);
  const queryClient = useQueryClient();
  const { mutate: likePost, isLoading: isLikePostLoading } = useMutation(
    async (payload) => {
      // if (payload.newIsLiked)
      return API.post("post-likes", payload);
    },
    {
      onSuccess: async (data) => {
        if (data) {
          fetchInitialsPost();
          // await queryClient.invalidateQueries(["posts-id", data?.postId]);
          // queryClient.invalidateQueries(["posts"]);
          // queryClient.invalidateQueries(["post-likes"]);
        }
      },
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
          fetchInitialsPost();

          // await queryClient.invalidateQueries(["posts-id", data?.postId]);
          // queryClient.invalidateQueries(["posts"]);
          // queryClient.invalidateQueries(["post-likes"]);
        }
      },
    }
  );
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const handleLike = (post) => {
    if (!auth?.userId) {
      return navigate("/login");
    }
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    const payloadData = {
      user_who_triggered_notify_id: auth?.userId,
      post_id: post?.id,
      likes: newIsLiked ? 1 : 0,
      user_id: auth?.userId,
      opened: 0,
      user_to_notify_id: post?.user_id,
    };
    setIsLoading(true);
    if (newIsLiked) {
      likePost(payloadData, {
        onSettled: () => {
          setIsLoading(false);
        },
      });
    } else if (newIsLiked === false) {
      disLikePost(payloadData, {
        onSettled: () => {
          setIsLoading(false);
        },
      });
    }
  };

  return (
    <li key={post.id}>
      <div className="user-post search-user list-view-post">
        <div className="post-profile">
          <figure>
            <Link
              to={`/post/${removeWhitespaces(
                removeQuestionAndForwardSlash(titleLink)
              )}`}
              state={{ id: post?.id }}
            >
              <Image
                // src={
                //   post.images
                //     ? parseStringArray(post.images)?.[0] ?? Placeholder
                //     : Placeholder
                // }
                src={parseStringArray(post.images)?.[0]}
                errorImageStyle={{
                  objectFit: "contain",
                }}
              />
              {/* <img
                className="mb-2"
                src={
                  post.images
                    ? parseStringArray(post.images)?.[0] ?? Placeholder
                    : Placeholder
                }
                alt="isdage"
                width=""
                height=""
              /> */}
            </Link>
          </figure>
          <figcaption>
            <div className="d-flex justify-content-between mb-2">
              <h5>
                <Link
                  to={`/post/${post.id}_${removeWhitespaces(
                    removeQuestionAndForwardSlash(post.title)
                  )}`}
                >
                  {post.title}
                </Link>
              </h5>
              {/* <Link
                to={
                  // navigate(
                  // `/post-detail/${removeQuestionAndForwardSlash(
                  //   params?.title
                  // )}`
                  //           )
                  `/post-detail/${post.id}_${removeWhitespaces(
                    removeQuestionAndForwardSlash(post.title)
                  )}`
                }
              >
                <p className="mb-1 btn btn-common btn-sm">{post?.price}</p>
              </Link> */}

              <PostStatus item={post} />
            </div>

            {post?.description?.length > MAX_LENGTH ? (
              <p
                className="mb-2 post-short-des"
                dangerouslySetInnerHTML={{
                  __html: `${post?.description.substring(0, MAX_LENGTH)}...`,
                }}
              />
            ) : (
              <p>{post?.description ? parse(post?.description) : ""}</p>
            )}
            <Link
              to={`/post/${removeWhitespaces(
                removeQuestionAndForwardSlash(titleLink)
              )}`}
              state={{ id: post?.id }}
            >
              Please click here for more information
            </Link>

            <div className="search-post-type">
              <div className="d-flex mb-1">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <p
                    className="mb-0 me-4 cursor-pointer "
                    style={{ cursor: "pointer" }}
                    onClick={() => handleLike(post)}
                  >
                    <i
                      className="fa fa-thumbs-up"
                      style={{
                        color: isLiked ? "var(--brand-color)" : "#bbb",
                      }}
                    ></i>{" "}
                    {post?.total_likes}
                  </p>
                )}
                <p className="mb-0 me-4">
                  <i className="fa fa-message"></i> {post?.total_comments}
                </p>
              </div>
              <p className="mb-1">
                <i className="fa fa-calendar"></i>{" "}
                {moment(post?.created).format("DD-MMMM-YYYY")}
              </p>
            </div>
          </figcaption>
        </div>
      </div>
    </li>
  );
}

export default PostSearchCard;
