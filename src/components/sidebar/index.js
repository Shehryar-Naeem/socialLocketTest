import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "../../styles/globalStyles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faHeadset,
  faLink,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import mapIcon from "../../assets/images/map.png";
import { useContext, useEffect, useState } from "react";
import {
  getUserBio,
  getUserFullName,
  getUserProfileImage,
  hasUserDetails,
} from "../../utils/Storage";
import {
  formatOnlyDate,
  getIdValue,
  getInitials,
  isNonEmptyArray,
  isNumber,
  parseStringArray,
  removeWhitespaces,
  // parseStringArray,
} from "../../helpers";
import { AuthContext } from "../../context/authContext";
import usePostsById from "../../hooks/query/Posts/usePostsById";

import PostGroup from "../../pages/postDetails/postBuy/PostGroup";
// import { useQueryClient } from 'react-query';
import VerifiedIcon from "assets/svg/verificationTick.png";
import useUsersById from "hooks/query/AllUserProfile/useUserById";
import Logo from "../../assets/images/logo.png";
import Search from "../../assets/images/search-form.png";

const SideBar = () => {
  const [isProfileImageUpdate, setIsProfileImageUpdate] = useState(null);
  const handleCustomEvent = (event) => {
    const { profileImage } = event.detail;
    setIsProfileImageUpdate(profileImage);
  };
  useEffect(() => {
    window.addEventListener("profileImageUpdate", handleCustomEvent);

    return () => {
      window.removeEventListener("profileImageUpdate", handleCustomEvent);
    };
  }, []);

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
  const navigate = useNavigate();
  const {
    isLoading: isUserDetailsLoading,
    error: userDetailsError,
    data: userDetailsData,
  } = useUsersById(auth?.userId);

  const [isPostBuyCheck, setIsPostBuyCheck] = useState(false);
  useEffect(() => {
    if (pathname?.includes("/post-detail")) {
      setIsPostBuyCheck(true);
    } else {
      setIsPostBuyCheck(false);
    }
  }, [params]);

  const { data: postsDetailsData } = usePostsById(state?.id ? state?.id : id);
  return (
    <aside id="layoutSidenav_nav">
      <div className="mobile-logo mb-3">
        <Link to="/" className="logo navbar-brand">
          <picture>
            <img
              loading="lazy"
              src={Logo}
              alt="login logo"
              width={144}
              height={60}
            />
          </picture>
        </Link>
        <div onClick={() => setIsSideBarOpen((prev) => !prev)}>
          <i className="fa-solid fa-xmark" />
        </div>
      </div>
      <div className="user-profile" hidden={!hasUserData}>
        <NavLink to={`/profile/${removeWhitespaces(userProfileUrl)}`}>
          <figure>
            <span hidden={userProfilePic} className="text-uppercase">
              {userProfileText}
            </span>
            <picture hidden={!userProfilePic}>
              <source
                srcSet={isProfileImageUpdate ?? userProfilePic}
                type="image/webp"
              />
              <source
                srcSet={isProfileImageUpdate ?? userProfilePic}
                type="image/png"
              />
              <img
                loading="lazy"
                src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                data-src={isProfileImageUpdate ?? userProfilePic}
                alt="user-img"
                className="img-fluid"
                width={70}
                height={70}
              />
            </picture>
            {Number(userDetailsData?.user_verification) === 1 && (
              <img src={VerifiedIcon} className="verified_icon" />
            )}
          </figure>
          <figcaption>
            <h5 className="mb-0">{UserFullName}</h5>
            <p className="mb-0">{userBIO}</p>
          </figcaption>
        </NavLink>
      </div>
      <div
        className="w-100 search-form position-relative mobile-side-form"
        role="search"
      >
        <input
          type="text"
          className="form-control mb-0"
          placeholder="The search for your next property begins here"
          aria-label="Search"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              navigate("search", {
                state: {
                  postTitle: event?.target?.value,
                },
              });
              setIsSideBarOpen((prev) => !prev);
            }
          }}
        />
        <img src={Search} alt="search" width={24} height={24} />
      </div>

      <ul onClick={() => setIsSideBarOpen((prev) => !prev)}>
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

      <div className="bell-icon bell-icon-mobile">
        <Link
          to={hasUserData ? "/notifications" : "/login"}
          onClick={() => setIsSideBarOpen((prev) => !prev)}
        >
          <i className="fa-solid fa-bell">
            {/* <span className="badge">2</span> */}
          </i>
        </Link>
        <Link
          to={hasUserData ? "/settings/details" : "/login"}
          onClick={() => setIsSideBarOpen((prev) => !prev)}
        >
          <i className="fa-solid fa-user" />
        </Link>
      </div>
    </aside>
  );
};

export default SideBar;
