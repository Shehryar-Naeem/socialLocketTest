import parse from "html-react-parser";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import {
  getInitials,
  isNonEmptyString,
  parseStringArray,
  removeQuestionAndForwardSlash,
  removeWhitespaces,
} from "../../../helpers";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { API } from "../../../services/ApiClient";
import { AuthContext } from "../../../context/authContext";
import LoadingSpinner from "../../../components/messageModal/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";
import Image from "components/image/Image";
import PostStatus from "pages/profile/components/postStatus/PostStatus";

function PostMainCard({ item, type }) {
  const { auth } = useContext(AuthContext);
  const userId = auth?.userId;

  const { data } = useQuery(["post-likes"], () =>
    API.get(`post-likes`).then((res) => {
      return res.data.result;
    })
  );
  const queryClient = useQueryClient();
  const { mutate: likePost, isLoading: isLikePostLoading } = useMutation(
    async (payload) => {
      return API.post("post-likes", payload);
    },
    {
      onSuccess: async (data) => {
        if (data) {
          try {
            await queryClient.invalidateQueries(["posts-id", item?.id]);
            await queryClient.invalidateQueries(["posts", type]);
            await queryClient.invalidateQueries(["post-likes"]);
            await queryClient.invalidateQueries(["users-posts", userId, type]);
          } catch (error) {
            console.error(error);
          }
        }
      },
    }
  );

  const { mutate: disLikePost, isLoading: isDisLikePostLoading } = useMutation(
    async (payload) => {
      return API.delete(`post-likes/${payload?.post_id}`, {
        data: payload,
      });
    },
    {
      onSuccess: async (data) => {
        if (data) {
          try {
            await queryClient.invalidateQueries(["posts-id", item?.id]);
            await queryClient.invalidateQueries(["posts", type]);
            await queryClient.invalidateQueries(["post-likes"]);
            await queryClient.invalidateQueries(["users-posts", userId, type]);
          } catch (error) {
            console.error(error);
          }
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
          like.post_id === Number(item?.id)
      );
    setIsLiked(userLiked);
  }, [data, auth.userId]);

  const [isLiked, setIsLiked] = useState(false);
  const handleLike = () => {
    if (!auth?.userId) {
      return navigate("/login");
    }
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    const payloadData = {
      user_who_triggered_notify_id: auth?.userId,
      post_id: item?.id,
      likes: newIsLiked ? 1 : 0,
      user_id: auth?.userId,
      opened: 0,
      user_to_notify_id: item?.user_id,
    };

    if (newIsLiked) {
      likePost(payloadData);
    } else if (newIsLiked === false) {
      disLikePost(payloadData);
    }
  };

  const titleLink = removeQuestionAndForwardSlash(
    (item?.id + "")?.concat("_", item?.title)
  );
  const navigate = useNavigate();
  const onCommentsClick = () => {
    return navigate(`/post-detail/${removeWhitespaces(titleLink)}`);
  };
  return !item ? (
    <div className="box-shadow"></div>
  ) : (
    <div className="box-shadow" style={{ position: "relative" }}>
      {item?.offer_price && type === "potential" ? (
        <div
          className="box-shadow"
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            background: "red",
            color: "#fff",
            padding: 10,
          }}
        >
          Offered Price {item?.offer_price}
        </div>
      ) : null}
      <div className="user-post">
        <a href="/" className="post-profile">
          {/* <figure>
            <span>RJ</span>
            <picture>
              <source
                srcSet="../../assets/images/user-img.webp"
                type="image/webp"
              />
              <source
                srcSet="../../assets/images/user-img.png"
                type="image/png"
              />
              <img
                loading="lazy"
                src="assets/images/user-img.png"
                data-src="../../assets/images/user-img.png"
                alt="user-img"
                className="img-fluid"
                width={50}
                height={50}
              />
            </picture>
          </figure> */}
          <figure>
            {isNonEmptyString(item?.profile_image) ? (
              <picture>
                <source srcSet={item?.profile_image} type="image/webp" />
                <source srcSet={item?.profile_image} type="image/png" />
                <img
                  loading="lazy"
                  src={item?.profile_image}
                  data-src={item?.profile_image}
                  alt="user-img"
                  className="img-fluid"
                  width={50}
                  height={50}
                />
              </picture>
            ) : (
              <span>
                {isNonEmptyString(item?.forename) &&
                isNonEmptyString(item?.surname)
                  ? getInitials(`${item?.forename}  ${item?.surname}`)
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
              {moment(item?.created).format("MMM DD")} at{" "}
              {moment(item?.created).format("hh:MM A")}
            </span>
          </figcaption>
        </a>
        {/* <Link
          className="inventory-price"
          to={`/post-detail/${removeWhitespaces(titleLink)}`}
        >
          <div>{item?.price}</div>
        </Link> */}

        <PostStatus item={item} />
      </div>
      <div className="mt-3">
        <h1>{item?.title}</h1>
      </div>
      {/* <img
        loading="lazy"
        src={PostImage}
        data-src={PostImage}
        alt="post"
        className="img-fluid"
        width=""
        height=""
      /> */}
      {console.log({
        images: item?.images,
        ss: parseStringArray(item?.images ?? ""),
      })}
      {item?.images !== null ? (
        <OwlCarousel
          items={1}
          margin={2}
          autoplay={true}
          autoplayTimeout={5000}
          className="owl-carousel owl-theme post-slider"
          dots={false}
          loop
        >
          {item?.images ? (
            parseStringArray(item?.images)?.length ? (
              parseStringArray(item?.images)?.map((imgItem, idx) => (
                <div key={idx} className="item">
                  <picture>
                    <source srcSet={imgItem} type="image/webp" />
                    <source srcSet={imgItem} type="image/png" />
                    <img
                      loading="lazy"
                      srcSet={imgItem}
                      
                      className="img-fluid"
                      width="670"
                      height="440"
                    />
                  </picture>
                </div>
              ))
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
      <p> {parse(item?.description)}</p>
      <div className="like-comment-count">
        <button type="button" onClick={() => handleLike()}>
          {isLikePostLoading || isDisLikePostLoading ? (
            <LoadingSpinner />
          ) : (
            <span className={`like-count ${isLiked ? "unlike" : ""}`}>
              {/* <a href="/" className="like-button"> */}
              <i
                className="fa-solid fa-thumbs-up"
                style={{
                  color: isLiked ? "var(--brand-color)" : "#bbb",
                }}
              />{" "}
              {/* </a> */}
              {/* <span>36k Likes</span> */}
              <span>
                {item?.total_likes == null ? 0 : item?.total_likes}{" "}
                {/* {isLiked ? "Unlike" : "Like"} */}
              </span>
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={onCommentsClick}
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
      {/* <div className="comment-section">
        <div className="comment-posted">
          <figure>
            <span>DR</span>
            <picture>
              <source srcSet="assets/images/user-img.webp" type="image/webp" />
              <source srcSet="assets/images/user-img.png" type="image/png" />
              <img
                loading="lazy"
                src="assets/images/user-img.png"
                data-src="assets/images/user-img.png"
                alt="user-img"
                className="img-fluid"
                width={55}
                height={55}
              />
            </picture>
          </figure>
          <figcaption>
            <h6>
              <strong>Dorenshie Ree</strong>
            </h6>
            <p>
              Create a blog brief using our hassle-free, guided flow. Get a
              preliminary quote and estimated delivery...
              <a href="/">See More</a>
            </p>
          </figcaption>
        </div>
        <div className="share-comment">
          <figure>
            <span />
            <picture>
              <source srcSet="assets/images/user-img.webp" type="image/webp" />
              <source srcSet="assets/images/user-img.png" type="image/png" />
              <img
                loading="lazy"
                src="assets/images/user-img.png"
                data-src="assets/images/user-img.png"
                alt="user-img"
                className="img-fluid"
                width={50}
                height={50}
              />
            </picture>
          </figure>
          <span>
            <input type="text" name="" placeholder="Write your comment...." />
            <button type="button">
              <img
                src="assets/images/share-icon.png"
                alt="share"
                width={24}
                height={24}
              />
            </button>
          </span>
        </div>
      </div> */}
    </div>
  );
}

export default PostMainCard;
