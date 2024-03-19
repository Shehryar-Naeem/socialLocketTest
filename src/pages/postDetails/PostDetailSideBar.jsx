// import { Link, NavLink, useLocation, useParams } from "react-router-dom";
// import "../../styles/globalStyles.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faMagnifyingGlass,
//   faHeadset,
//   faLink,
//   faGear,
// } from "@fortawesome/free-solid-svg-icons";
// import mapIcon from "../../assets/images/map.png";
// import { useContext, useEffect, useState } from "react";
// import {
//   getUserBio,
//   getUserFullName,
//   getUserProfileImage,
//   hasUserDetails,
// } from "../../utils/Storage";
// import {
//   formatOnlyDate,
//   getIdValue,
//   getInitials,
//   isNonEmptyArray,
//   isNumber,
//   parseStringArray,
//   removeWhitespaces,
//   // parseStringArray,
// } from "../../helpers";
// import { AuthContext } from "../../context/authContext";
// import usePostsById from "../../hooks/query/Posts/usePostsById";

import { useContext, useEffect, useState } from "react";
import mapIcon from "../../assets/images/map.png";
import {
  faMagnifyingGlass,
  faHeadset,
  faLink,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import {
  formatOnlyDate,
  getIdValue,
  getInitials,
  isNonEmptyArray,
  isNumber,
  parseStringArray,
  removeWhitespaces,
} from "../../helpers";
import {
  getUserBio,
  getUserFullName,
  getUserProfileImage,
  hasUserDetails,
} from "../../utils/Storage";
import { AuthContext } from "../../context/authContext";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import usePostsById from "../../hooks/query/Posts/usePostsById";
import PostGroup from "./postBuy/PostGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreatePostDocument from "./postBuy/postDocument/createPostDocument/CreatePostDocument";
import { PostDetailContext } from "./PostDetailContext";
import PostDocumentList from "./postBuy/postDocument/postDocumentList/PostDocumentList";
import OfferPrice from "./postBuy/offerPrice/OfferPrice";
import PostEvents from "./postBuy/postEvents/PostEvents";
import Logo from "../../assets/images/logo.png";
import VerifiedIcon from "assets/svg/verificationTick.png";
import useGetVerification from "hooks/query/AllUserProfile/useGetVerification";

// import PostGroup from "../../pages/postDetails/postBuy/PostGroup";
// import { useQueryClient } from 'react-query';

const PostDetailSideBar = () => {
  const { isGroupMember } = useContext(PostDetailContext);

  const userProfilePic = getUserProfileImage();
  const userBIO = getUserBio();
  const UserFullName = getUserFullName();
  const userProfileText = getInitials(UserFullName);
  const hasUserData = hasUserDetails();
  const { auth, setIsSideBarOpen } = useContext(AuthContext);
  const userId = auth?.userId ? auth?.userId.toString() : "";
  const userProfileUrl = UserFullName ? UserFullName.concat("_", userId) : "";
  const { state, pathname } = useLocation();
  const params = useParams();
  const id = getIdValue(params);
  const [isPostBuyCheck, setIsPostBuyCheck] = useState(false);
  useEffect(() => {
    if (pathname?.includes("/post-detail")) {
      setIsPostBuyCheck(true);
    } else {
      setIsPostBuyCheck(false);
    }
  }, [params]);

  const { data: postsDetailsData } = usePostsById(state?.id ? state?.id : id);
  const verificationBadge = useGetVerification();
  return (
    <aside id="layoutSidenav_nav">
      <div className="mobile-logo mb-3 py-2">
        <a href="/" className="logo navbar-brand">
          <picture>
            <img
              loading="lazy"
              src={Logo}
              alt="login logo"
              width={144}
              height={60}
            />
          </picture>
        </a>
        <div onClick={() => setIsSideBarOpen((prev) => !prev)}>
          <i className="fa-solid fa-xmark" />
        </div>
      </div>
      <div className="user-profile" hidden={!hasUserData}>
        <NavLink to={`/profile/${removeWhitespaces(userProfileUrl)}`}>
          <figure>
            {/* {Number(userDetailsData?.user_verification) === 1 && (
              <img src={VerifiedIcon} className="verified_icon" />
            )} */}
            {verificationBadge}
            <span hidden={userProfilePic} className="text-uppercase">
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
                width={70}
                height={70}
              />
            </picture>
          </figure>
          <figcaption>
            <h5 className="mb-0">{UserFullName}</h5>
            <p className="mb-0">{userBIO}</p>
          </figcaption>
        </NavLink>
      </div>
      <form
        className="w-100 search-form position-relative mobile-side-form"
        role="search"
      >
        <input
          type="text"
          className="form-control mb-0"
          placeholder="The search for your next property begins here"
          aria-label="Search"
        />
        <img
          src="../../assets/images/search-form.png"
          alt="search"
          width={24}
          height={24}
        />
      </form>
      {isNumber(id) && isNonEmptyArray(postsDetailsData) ? (
        postsDetailsData.map((item, idx) => {
          return (
            <div key={idx} className="post-details-list py-3">
              <ul className="d-flex flex-column">
                {isPostBuyCheck && userId && (
                  <>
                    <li className="d-flex flex-column border-bottom pb-3 mb-0">
                      <div className="w-100">
                        <h5 className="mb-3">Group</h5>
                        <PostGroup />
                      </div>
                    </li>

                    <li className="d-flex flex-column border-bottom py-3 mb-0">
                      <div className="w-100">
                        <OfferPrice postData={item} userId={userId} />
                      </div>
                    </li>

                    <li className="d-flex flex-column py-3 mb-5">
                      <div className="w-100">
                        <PostEvents postData={item} userId={userId} />
                      </div>
                    </li>

                    {/* <li className="d-flex  border-bottom py-3 px-2">
                      <PostEvents postData={item} userId={userId} />
                    </li> */}
                  </>
                )}

                <li className="d-flex align-items-start border-bottom py-1">
                  <div>
                    <h5>Address</h5>
                    <span className="small">
                      {item?.location ? item?.location : ""}
                    </span>
                  </div>

                  <Link
                    to={{
                      pathname: "/search",
                    }}
                    state={{
                      postTitle: item?.title,
                    }}
                  >
                    <img
                      src={mapIcon}
                      alt="no_image"
                      style={{
                        height: 30,
                        width: 30,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  </Link>
                </li>
                <li className="d-flex border-bottom py-1 px-2">
                  <h5>Type</h5>
                  <span>{item?.type ? item?.type : ""}</span>
                </li>
                <li className="d-flex border-bottom py-1 px-2">
                  <h5>Number of Rooms</h5>
                  {console.log({ item })}
                  <span>{item?.pages ? item?.pages : ""}</span>
                </li>
                <li className="d-flex border-bottom py-1 px-2">
                  <h5>Price</h5>
                  <span>
                    {item?.price ? `${item?.currency}${item?.price}` : ""}
                  </span>
                </li>
                <li className="d-flex border-bottom py-1 px-2">
                  <h5>Available</h5>
                  <span>
                    {item?.created ? formatOnlyDate(item?.created) : ""}
                  </span>
                </li>
                <li className="d-flex flex-column align-items-start border-bottom py-1 px-2">
                  <h5>keywords</h5>
                  <span>
                    {item?.keywords
                      ? parseStringArray(item?.keywords).map((tag, index) => (
                          <span className="badge bg-common me-1" key={index}>
                            {tag}
                          </span>
                        ))
                      : ""}
                  </span>
                </li>
                <li className="d-flex border-bottom py-1 px-2">
                  <h5>Status</h5>
                  <span>{item?.status ? item?.status : "Available"}</span>
                </li>
                <li className="d-flex flex-column align-items-start border-bottom py-1 px-2">
                  <h5>Reference ID</h5>
                  <span>
                    <span className="badge bg-common me-1 whiteSpace-none">
                      {item?.sl_reference_id ? item?.sl_reference_id : ""}
                    </span>
                  </span>
                </li>
                {isPostBuyCheck && isGroupMember && (
                  <li className="d-flex flex-wrap border-bottom py-1 px-2">
                    <h5 className="w-100">Documents</h5>
                    <div className="w-100 d-flex justify-content-between gap-10 py-1 list-of-document">
                      <CreatePostDocument />
                      <PostDocumentList />
                    </div>
                  </li>
                )}
              </ul>
            </div>
          );
        })
      ) : (
        <ul>
          <li>
            <NavLink activeclassname="active" to="/">
              <i className="fa fa-home" /> Home
            </NavLink>
          </li>
          <li>
            <NavLink activeclassname="active" to="/search">
              <i>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </i>{" "}
              Search
            </NavLink>
          </li>
          <li>
            <NavLink activeclassname="active" to="/support">
              <i>
                <FontAwesomeIcon icon={faHeadset} />
              </i>{" "}
              Support
            </NavLink>
          </li>
          <li>
            <NavLink activeclassname="active" to="/connect">
              <i>
                <FontAwesomeIcon icon={faLink} />
              </i>{" "}
              Connect
            </NavLink>
          </li>
          <li>
            <NavLink activeclassname="active" to="/settings/details">
              <i>
                <FontAwesomeIcon icon={faGear} />
              </i>{" "}
              Settings
            </NavLink>
          </li>
        </ul>
      )}

      <div className="bell-icon bell-icon-mobile">
        <a href="/">
          <i className="fa-solid fa-bell">
            <span className="badge">2</span>
          </i>
        </a>
        <a href="/">
          <i className="fa-solid fa-user" />
        </a>
      </div>
    </aside>
  );
};

export default PostDetailSideBar;
