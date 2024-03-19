// import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../styles/globalStyles.css";
import Header from "../components/header";
import SideBar from "../components/sidebar";
import { useContext, useState } from "react";
import { hasUserDetails } from "../utils/Storage";
import Progressbar from "../pages/Progressbar/progressbar";
import { AuthContext } from "../context/authContext";

const Layout = () => {
  const hasUserData = hasUserDetails();
  const { isSideBarOpen } = useContext(AuthContext);

  const location = useLocation();
  const hideSideBar =
    location.pathname === "/inventory" || location.pathname.startsWith("/post");

  return (
    <>
      <div
        className={`dashboard  ${
          isSideBarOpen ? "nav-fixed sidenav-toggled" : "nav-fixed"
        }`}
      >
        <Header />

        <section>
          <div className="container">
            <div className="" id="layoutSidenav">
              {!hideSideBar && <SideBar />}

              <main id="layoutSidenav_content">
                {hasUserData ? <Progressbar /> : null}
                <Outlet />
              </main>
            </div>
          </div>
        </section>
        {/* <button onClick={handleSidebarToggle}>qwqw</button> */}
      </div>
      {/* Bottom right-side-sticky */}
      {/* <div className="bottom-right">
        <a href="/">
          <i className="fa-sharp fa-solid fa-plus" />
        </a>
      </div> */}
      {/* Bottom right-side-sticky */}
      {/* Mobile bottom bar */}
      <div className="mobile-bottom">
        <div className="container">
          <ul>
            <li className="active">
              <a href="/">
                <i className="fa-sharp fa-solid fa-house" />
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="/search">
                <i className="fa fa-magnifying-glass" />
                <span>Search</span>
              </a>
            </li>
            <li>
              <a href="/settings/details">
                <i className="fa fa-gear" />
                <span>Settings</span>
              </a>
            </li>

            <li>
              <a href="/">
                <i className="fa-solid fa-user" />
                <span>User</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Layout;
