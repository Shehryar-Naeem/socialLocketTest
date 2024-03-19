// import React from "react";
import "../../styles/globalStyles.css";

import Dropdown from "react-bootstrap/Dropdown";
// import 'font-awesome/css/font-awesome.min.css';
// import "font-awesome/6.3.0/css/all.min.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.webp";
import LogoImage from "../../assets/images/logo.png";
import SearchImage from "../../assets/images/search-form.png";
import {
  getUserEmail,
  getUserFullName,
  getUserProfileImage,
  hasUserDetails,
} from "../../utils/Storage";
import {
  getInitials,
  isNonEmptyString,
  isNumber,
  removeWhitespaces,
} from "../../helpers";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import useGetVerification from "hooks/query/AllUserProfile/useGetVerification";

const Header = () => {
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
  const verificationBadge = useGetVerification();
  const userProfilePic = getUserProfileImage();
  const UserFullName = getUserFullName();
  const userEmail = getUserEmail();
  const hasUserData = hasUserDetails();
  const userProfileText = getInitials(UserFullName);
  const value = useContext(AuthContext);
  const navigate = useNavigate();
  const logOut = () => {
    value?.logout();
    navigate("/login");
  };
  const userProfileUrl = UserFullName
    ? UserFullName.concat("_", value?.auth?.userId ?? "")
    : "";

  return (
    <header>
      {/* Top-header */}
      <div className="container">
        <div className="row">
          <nav
            className="topnav navbar navbar-expand justify-content-between justify-content-sm-start navbar-light bg-white"
            id="sidenavAccordion"
          >
            {/* Sidenav Toggle Button */}
            <button
              type="button"
              className="btn btn-icon btn-transparent-dark order-1 order-lg-0 "
              id="sidebarToggle"
              onClick={() => value?.setIsSideBarOpen((prev) => !prev)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-menu"
              >
                <line x1={3} y1={12} x2={21} y2={12} />
                <line x1={3} y1={6} x2={21} y2={6} />
                <line x1={3} y1={18} x2={21} y2={18} />
              </svg>
            </button>
            {/* Navbar Brand */}
            {/* <a className="navbar-brand pe-3 ps-4 ps-lg-2" href="#">Winyway</a> */}
            <Link to="/" className="logo navbar-brand">
              <picture>
                <source srcSet={Logo} type="image/webp" />
                <source srcSet={LogoImage} type="image/png" />
                <img
                  loading="lazy"
                  src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                  data-src={LogoImage}
                  alt="login logo"
                  width={144}
                  height={60}
                />
              </picture>
            </Link>
            {/* Navbar Search Input */}
            <div
              className="w-50 mx-5 ms-auto search-form position-relative"
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
                  }
                }}
              />
              <img src={SearchImage} alt="search" width={24} height={24} />
            </div>
            {/* Navbar Items */}
            <ul className="navbar-nav align-items-center">
              <li className="bell-icon">
                <Link to="/notifications">
                  <i className="fa-solid fa-bell">
                    {/* <span className="badge">2</span> */}
                  </i>
                </Link>
              </li>
              {/* <FontAwesomeIcon icon={faCoffee} size="4x" /> */}
              {/* <FontAwesomeIcon
                size={24}
                icon={["fas", "coffee"]}
                // color={props?.state?.index === 0 ? miscBlue[600] : blueGray[300]}
              /> */}

              <li className="bell-icon" hidden={hasUserData}>
                <NavLink className="bell-icon" to="/login">
                  <i className="fa-solid fa-user" />
                </NavLink>
              </li>

              {isNumber(value?.auth?.userId) ? (
                <Dropdown>
                  <Dropdown.Toggle
                    id="Profile-dropdown-button"
                    variant="white"
                    className="header-profile"
                  >
                    <figure>
                      {verificationBadge}
                      <span className="text-uppercase" hidden={userProfilePic}>
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
                          width={50}
                          height={50}
                        />
                      </picture>
                    </figure>
                  </Dropdown.Toggle>

                  <Dropdown.Menu variant="light" className="p-0 m-0">
                    <Dropdown.Item
                      className="py-3 px-3"
                      onClick={() =>
                        navigate(
                          `/profile/${removeWhitespaces(userProfileUrl)}`
                        )
                      }
                    >
                      <h6 className="dropdown-header d-flex align-items-center header-profile p-0">
                        <figure className="me-3">
                          {verificationBadge}
                          <span
                            className="text-uppercase"
                            hidden={userProfilePic}
                          >
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
                        <div className="dropdown-user-details">
                          <div className="dropdown-user-details-name">
                            {isNonEmptyString(UserFullName) ? UserFullName : ""}
                          </div>
                          <div className="dropdown-user-details-email">
                            {isNonEmptyString(userEmail) ? userEmail : ""}
                          </div>
                        </div>
                      </h6>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      className="py-3 px-3"
                      onClick={() => navigate("/settings/details")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-settings"
                      >
                        <circle cx={12} cy={12} r={3} />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      {""}
                      <span>Account</span>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={logOut} className="py-3 px-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-log-out"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1={21} y1={12} x2={9} y2={12} />
                      </svg>
                      <span>Logout</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                ""
              )}
            </ul>
          </nav>
        </div>
      </div>
      {/* Top-header */}
    </header>
  );
};

export default Header;
