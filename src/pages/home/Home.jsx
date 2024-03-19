/* eslint-disable no-nested-ternary */
// import React from "react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserImage from "../../assets/images/empty-box.png";
import { getInitials } from "../../helpers";
import usePostComments from "../../hooks/query/Posts/usePostComments";
import usePosts from "../../hooks/query/Posts/usePosts";
import "../../styles/globalStyles.css";
import {
  getUserFullName,
  getUserProfileImage,
  hasUserDetails,
} from "../../utils/Storage";
import Posts from "./components/Posts";
import { AuthContext } from "../../context/authContext";
import useUsersById from "../../hooks/query/AllUserProfile/useUserById";
import Swal from "sweetalert2";
import { showMessage } from "components/messageModal/MessageModal";
import useGetVerification from "hooks/query/AllUserProfile/useGetVerification";
import PaymentLogo from "components/paymentLogo";
import Pagination from "react-js-pagination";

// import useAllUserProfile from "../../hooks/query/AllUserProfile/useAllUserProfile";

const Home = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const {
    isLoading: postsIsLoading,
    error: postsError,
    data: postsData,
  } = usePosts(currentPage, postsPerPage);
  const {
    isLoading: isallCommentsLLoading,
    error: allCommentsError,
    data: allCommentsData,
  } = usePostComments();
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const { auth } = useContext(AuthContext);

  const {
    isLoading: isUserDetailsLoading,
    error: userDetailsError,
    data: userDetailsData,
  } = useUsersById(auth?.userId);
  const [postTitle, setPostTitle] = useState("");
  const userProfilePic = getUserProfileImage();
  const UserFullName = getUserFullName();
  const userProfileText = getInitials(UserFullName);
  const hasUserData = hasUserDetails();
  const verificationBadge = useGetVerification();

  return (
    <div>
      {/* {hasUserData ? <Progressbar /> : null} */}
      {Number(userDetailsData?.user_verification) === 1 && (
        <div className="post-message" hidden={!hasUserData}>
          <div>
            <h5>
              <strong>List your next property</strong>
            </h5>
          </div>
          <div className="post-something">
            <figure>
              {verificationBadge}
              <span className="text-uppercase" hidden={userProfilePic}>
                {userProfileText}
              </span>
              <picture hidden={!userProfilePic}>
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
            </figure>
            <div>
              <input
                type="text"
                name="title"
                placeholder="Create a new listing"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    navigate("/create-post", {
                      state: {
                        title: event?.target?.value,
                      },
                    });
                  }
                }}
              />
              <Link to="/create-post" state={{ title: postTitle }}>
                <i className="fa-solid fa-pen" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* <div className="">
        {postsError
          ? "Something went wrong!"
          : postsIsLoading
          ? "loading"
          : postsData
          ? postsData.map((post) => <Posts post={post} key={post.id} />)
          : null}
      </div> */}

      <div
        className={
          postsError || (postsData && postsData.length === 0)
            ? "no-data-found"
            : ""
        }
      >
        {postsError ? (
          "Something went wrong!"
        ) : postsIsLoading ? (
          <div className="no-data-found">
            <div className="">
              <img
                loading="lazy"
                src={UserImage}
                alt=""
                width={200}
                height={200}
              />
              <h6 className="mt-3">Loading</h6>
            </div>
          </div>
        ) : Array.isArray(postsData.results) ? (
          postsData?.results?.map((post) => <Posts post={post} key={post.id} />)
        ) : (
          <p>No posts available</p>
        )}
        {postsData && postsData.results.length !== 0 && (
          <div className="pagination">
            {/* Custom pagination links */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`pagination_btn ${
                currentPage === 1 ? "disabled" : ""
              }`}
            >
              &lt; Prev
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!postsData?.next}
              className={`pagination_btn ${!postsData?.next ? "disabled" : ""}`}
            >
              Next &gt;
            </button>
          </div>
        )}
      </div>

      {hasUserData && (
        <div className="bottom-right">
          <Link
            to="/create-post"
            onClick={(event) => {
              if (Number(userDetailsData?.user_verification) !== 1) {
                event.preventDefault();
                event.stopPropagation();
                Swal.fire({
                  title: "Info",
                  text: "Please verify your account by completing the verification process before creating any listings.",
                  icon: "info",
                });
              }
            }}
          >
            <i className="fa-sharp fa-solid fa-plus" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
