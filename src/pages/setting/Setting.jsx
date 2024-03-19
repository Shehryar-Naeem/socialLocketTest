import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
// import Select from "react-select";
import ProfileBannerImage from "../../assets/images/profile-banner.jpg";
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from "../../components/messageModal/MessageModal";
import { AuthContext } from "../../context/authContext";
import {
  getInitials,
  isNonEmptyString,
  removeWhitespaces,
} from "../../helpers";
import useSelectedTypesBy from "../../hooks/query/AllUserProfile/useSelectedUserTypes";
import useUsersById from "../../hooks/query/AllUserProfile/useUserById";
import { authService } from "../../services/AuthApi";
import {
  getUserBio,
  getUserFullName,
  getUserProfileImage,
} from "../../utils/Storage";
import DetailsForm from "./components/DetailsForm";
import VerifiedIcon from "assets/svg/verificationTick.png";

const Setting = () => {
  const userProfilePic = getUserProfileImage();
  const userBIO = getUserBio();
  const userFullName = getUserFullName();
  const userProfileText = getInitials(userFullName);
  const value = useContext(AuthContext);
  // const Id = value?.auth?.userId;
  const userId = value?.auth?.userId ? value?.auth?.userId.toString() : "";
  const userProfileUrl = userFullName ? userFullName.concat("_", userId) : "";
  const navigate = useNavigate();
  const logOut = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      showLoadingSpinner({});
      await authService.logout(userId);
    } catch (error) {
    } finally {
      await value?.logout();
      navigate("/login");
      hideLoadingSpinner();
    }
  };
  // console.log(value);
  const {
    isLoading: isUserDetailsLoading,
    error: userDetailsError,
    data: userDetailsData,
  } = useUsersById(value?.auth?.userId);
  const { data: userSelectedTypesData } = useSelectedTypesBy(
    value?.auth?.userId
  );
  useEffect(() => {
    if (value?.auth?.isAuthenticated === false) {
      navigate("/login");
    }
  }, [value?.auth?.isAuthenticated]);
  // useEffect(() => {
  //   if (userDetailsData && !isUserDetailsLoading) {
  //     save("userDetails", userDetailsData);
  //   }
  // }, [userDetailsData, isUserDetailsLoading]);

  const [isModalOpen, setIsModal] = useState(false);

  // console.log({
  //   userDetailsError,
  //   userDetailsData,
  //   isUserDetailsLoading,
  //   userSelectedTypesData,
  // });

  return (
    <div>
      <div className="box-shadow p-0">
        <div className="setting">
          <div className="cover-profile">
            <div
              className="cover-photo"
              style={{
                backgroundImage: `url(${
                  userDetailsData?.banner || ProfileBannerImage
                })`,
              }}
            />

            <div className="setting-profile">
              <div className="edit-profile">
                <div className="setting-left">
                  <figure className="position-relative">
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
                        width={150}
                        height={150}
                      />
                    </picture>
                    {Number(userDetailsData?.user_verification) === 1 && (
                      <img
                        src={VerifiedIcon}
                        className="verified_icon"
                        style={{
                          height: 30,
                          width: 30,
                          right: 10,
                        }}
                      />
                    )}
                  </figure>
                  <figcaption>
                    <div>
                      <h4 className="mb-0 mt-2 text-center">
                        {isNonEmptyString(userDetailsData?.forename) &&
                        isNonEmptyString(userDetailsData?.surname)
                          ? `${userDetailsData?.forename}  ${userDetailsData?.surname}`
                          : ""}
                      </h4>
                      <p className="mb-0 text-center">{userBIO}</p>
                    </div>
                    <div className="setting-post" style={{ display: "none" }}>
                      <a href="/" className="">
                        <span>Posts</span>
                        <strong>121</strong>
                      </a>
                      {/* <a href="/" className="">
                        <span>Followers</span>
                        <strong>123</strong>
                      </a>
                      <a href="/" className="">
                        <span>Following</span>
                        <strong>134</strong>
                      </a> */}
                    </div>
                  </figcaption>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={logOut}
                    className="btn btn-common w-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
              <div className="setting-right" id="#profile">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item">
                    <Link to="" className="nav-link active">
                      Details
                    </Link>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to={`/profile/${removeWhitespaces(userProfileUrl)}`}
                    >
                      Profile
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/notifications">
                      Notification
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/privacy">
                      Privacy
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/inventory">
                      Inventory
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                      Dashboard
                    </Link>
                  </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                  <div
                    className="tab-pane fade show active"
                    id="home"
                    role="tabpanel"
                    aria-labelledby="home-tab"
                  >
                    <DetailsForm
                      preloadedValues={userDetailsData}
                      userSelectedTypesData={userSelectedTypesData}
                    />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="profile"
                    role="tabpanel"
                    aria-labelledby="profile-tab"
                  >
                    ...
                  </div>
                  <div
                    className="tab-pane fade"
                    id="contact"
                    role="tabpanel"
                    aria-labelledby="contact-tab"
                  >
                    ...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
