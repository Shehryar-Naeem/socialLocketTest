import React, { useContext } from "react";
import ShareCommentImage from "../../../assets/images/share-icon.png";
import { getUserFullName, getUserProfileImage } from "../../../utils/Storage";
import usePostCommentsById from "../../../hooks/query/Posts/usePostCommentsById";
import {
  getInitials,
  isNonEmptyArray,
  isNonEmptyString,
} from "../../../helpers";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { API } from "../../../services/ApiClient";
import { AuthContext } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import {
  createLikeForAPostComment,
  deletePostLikeComment,
  getPostCommentLikesByPostId,
} from "services/postLikeComment";
import LoadingSpinner from "components/messageModal/LoadingSpinner";
import useGetVerification from "hooks/query/AllUserProfile/useGetVerification";

const MAX_LENGTH = 500;
const Comments = ({ postId, post }) => {
  const { auth } = useContext(AuthContext);
  const userProfilePic = getUserProfileImage();
  const UserFullName = getUserFullName();
  const userProfileText = getInitials(UserFullName);
  const { data: commentsData, error, isLoading } = usePostCommentsById(postId);
  const navigate = useNavigate();

  const { register, handleSubmit, setValue } = useForm();

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return API.post("post-comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments-id"]);
      },
    }
  );
  const { data: commentLikeData, isLoading: commentIsLoading } = useQuery(
    ["post_comment"],
    () =>
      getPostCommentLikesByPostId({
        postId: postId,
        userId: auth?.userId,
      }),
    {
      enabled: !!auth?.userId,
    }
  );
  const verificationBadge = useGetVerification();
  const onSubmit = async (data, event) => {
    event.preventDefault();
    // const commentPayload = {
    //   user_id: auth?.userId,
    //   post_id: postId,
    //   comment: data.comment,
    // };
    const commentPayload = {
      user_who_triggered_notify_id: auth?.userId,
      post_id: post?.id,
      user_id: auth?.userId,
      opened: 0,
      comment: data.comment,
      user_to_notify_id: post?.user_id,
    };
    if (auth?.userId) {
      mutation.mutate(commentPayload);
      setValue("comment", "");
    } else {
      navigate("/login");
    }
  };

  if (error) {
    return <div>Something went wrong</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="comment-section">
      {isNonEmptyArray(commentsData?.result)
        ? commentsData?.result?.map((comment, idx) => (
            <CommentRow key={idx} comment={comment} userId={auth?.userId} />
          ))
        : ""}
      <div className="share-comment">
        <figure>
          {verificationBadge}
          {userProfilePic ? (
            <picture>
              <source srcSet={userProfilePic} type="image/webp" />
              <source srcSet={userProfilePic} type="image/png" />
              <img
                loading="lazy"
                src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                data-src={userProfilePic}
                alt="user-img"
                className="img-fluid"
                width={50}
                height={50}
              />
            </picture>
          ) : (
            <span className="text-uppercase  text-white">
              {userProfileText}
            </span>
          )}
        </figure>
        <span>
          <input
            type="text"
            name="comment"
            {...register("comment")}
            placeholder="Please enter your comment...."
          />
          <button type="button" onClick={handleSubmit(onSubmit)}>
            <img src={ShareCommentImage} alt="share" width={24} height={24} />
          </button>
        </span>
      </div>
    </div>
  );
};

export default Comments;

const CommentRow = ({ comment, isLiked, userId }) => {
  const { mutate: updateMutate, isLoading: isUpdateLoading } = useMutation(
    createLikeForAPostComment
  );
  const { mutate: removeLikeMutate, isLoading: isRemoveLoading } = useMutation(
    deletePostLikeComment
  );

  const handleCommentLike = () => {
    const { user_id: comment_user_id, post_id, id } = comment;
    let likeData = {
      user_id: userId,
      post_id: post_id,
      post_comment_id: id,
      likes: 1,
      user_who_triggered_notify_id: userId,
      user_to_notify_id: comment_user_id,
      opened: 1,
    };
    updateMutate(likeData);
  };

  const handleRemoveCommentLike = () => {
    const { user_id: comment_user_id, post_id, id } = comment;

    let removeLikeData = {
      id: 1,
      user_id: userId,
      post_id: post_id,
      post_comment_id: id,
    };
    removeLikeMutate(removeLikeData);
  };

  return (
    <div className="comment-posted">
      <figure>
        {comment?.profile_image ? (
          <picture>
            <source srcSet={comment?.profile_image} type="image/webp" />
            <source srcSet={comment?.profile_image} type="image/png" />
            <img
              loading="lazy"
              src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
              data-src={comment.profile_image}
              alt="user-img"
              className="img-fluid"
              width={55}
              height={55}
            />
          </picture>
        ) : (
          <span>
            {" "}
            {isNonEmptyString(comment?.forename) &&
            isNonEmptyString(comment?.surname)
              ? getInitials(`${comment?.forename}  ${comment?.surname}`)
              : ""}
          </span>
        )}
      </figure>
      <figcaption>
        <h6>
          <strong>
            {isNonEmptyString(comment?.forename) &&
            isNonEmptyString(comment?.surname)
              ? `${comment?.forename}  ${comment?.surname}`
              : "User"}
          </strong>
        </h6>
        {isNonEmptyString(comment?.comment) ? (
          <p>
            {`${comment?.comment.substring(0, MAX_LENGTH)}`}

            {/* <a href="/">See More</a> */}
          </p>
        ) : (
          "No comment"
        )}
      </figcaption>

      <button
        disabled={isUpdateLoading || isRemoveLoading}
        style={{ cursor: "pointer", background: "transparent", border: "none" }}
        className={`d-flex align-items-center cursor-pointer like-count ${
          isLiked ? "unlike" : ""
        }`}
        onClick={handleCommentLike}
      >
        {/* <a href="/" className="like-button"> */}
        <i className="fa-solid fa-thumbs-up" /> {/* </a> */}
        {/* <span>36k Likes</span> */}
        <span className="me-2">
          &nbsp;
          {comment?.total_likes == null ? 0 : comment?.total_likes}
        </span>
        {(isUpdateLoading || isRemoveLoading) && <LoadingSpinner size={8} />}
      </button>
    </div>
  );
};
