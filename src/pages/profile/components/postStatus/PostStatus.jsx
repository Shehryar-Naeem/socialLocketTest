import { AuthContext } from "context/authContext";
import { removeQuestionAndForwardSlash, removeWhitespaces } from "helpers";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function PostStatus({ item }) {
  const params = useParams();
  const navigate = useNavigate();
  const [isOpenForBuy, setIsOpenForBuy] = useState(params?.isPostBuyCheck);
  // console.log({ params });

  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname?.includes("/post-detail")) {
      setIsOpenForBuy(true);
    } else {
      setIsOpenForBuy(false);
    }
  }, [params]);

  const { auth } = useContext(AuthContext);

  const userId = Number(auth?.userId);
  const postId = item?.id ? item?.id.toString() : "";
  const postUserId = item?.user_id ? item?.user_id.toString() : "";
  const userTitle = item?.title ? item?.title : "";

  const titleLink = removeQuestionAndForwardSlash(
    postId.concat("_", userTitle)
  );

  return (
    //     <div className="post-grid-image">
    //     <Image src={parseStringArray(item?.images)?.[0]} />
    // {item?.offer_price ? (
    //   <span
    //     className="status under_offer"
    //     style={{ background: "orange" }}
    //   >
    //     Under offer
    //   </span>
    // ) : item?.purchased_price &&
    //   Number(item?.customer_user_id) === Number(userId) ? (
    //   <span className="status purchased">Purchased</span>
    // ) : item?.purchased_price &&
    //   Number(item?.customer_user_id) !== Number(userId) ? (
    //   <span className="status sold">Sold</span>
    // ) : (
    //   <span className="status available">Available</span>
    // )}
    //   </div>

    <div className="price-btn">
      <button
        type="button"
        className="border-0 p-0 scale_up"
        onClick={() => navigate(`/post-detail/${removeWhitespaces(titleLink)}`)}
        disabled={isOpenForBuy}
      >
        {/* {item?.price ? `${item.price}` : ""} */}

        {item?.status === "Under Offer" ? (
          <span className="btn btn-warning">Under Offer</span>
        ) : item?.purchased_price &&
          Number(item?.customer_user_id) === Number(userId) ? (
          <span className="status purchased">Purchased</span>
        ) : item?.purchased_price &&
          Number(item?.customer_user_id) !== Number(userId) ? (
          <span className="btn btn-danger">Sold</span>
        ) : (
          <span className="btn btn-common">
            {item.price ? `${item?.currency}${item?.price}` : "$ 0"}
          </span>
        )}
      </button>
    </div>
  );
}

export default PostStatus;
