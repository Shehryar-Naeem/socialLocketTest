import React, { useContext, useEffect, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { AuthContext } from "../../context/authContext";
import useUsersById from "../../hooks/query/AllUserProfile/useUserById";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { getUserAddressById } from "../../services/addressApi";
import { getFilesByUserId } from "../../services/fileUploadApi";
const Progressbar = () => {
  const { auth } = useContext(AuthContext);
  const {
    isLoading: isUserDetailsLoading,
    error: userDetailsError,
    data: userDetailsData,
  } = useUsersById(auth?.userId);
  const { pathname } = useLocation();
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    const showList = ["/", "settings", "profile"];
    if (pathname?.length === 1) {
      setIsShow(true);
    } else {
      setIsShow(showList?.includes(pathname?.split("/")[1]));
    }
  }, [pathname]);

  const { data: addressData } = useQuery(
    [`address`, "progress", auth?.userId],
    () =>
      getUserAddressById({
        userId: auth?.userId,
      }),
    {
      enabled: !!auth?.userId,
    }
  );
  const [isVerificationRejected, setIsVerificationRejected] = useState(false);
  const { data: userDocument } = useQuery(
    [`user_document`, "progress", Number(auth?.userId)],
    () => getFilesByUserId(auth?.userId),
    {
      enabled: !!auth?.userId,
    }
  );
  const [percentage, setPercentage] = useState([]);
  useEffect(() => {
    const temp = percentage;
    if (!isUserDetailsLoading && userDetailsData) {
      const {
        main_user_type,
        dob,
        profile_image,
        gender,
        mobile,
        forename,
        surname,
        user_verification,
      } = userDetailsData;

      if (
        Number(user_verification) === 0 &&
        user_verification !== null &&
        user_verification !== ""
      ) {
        setIsVerificationRejected(true);
      }
      if (Number(user_verification) === 1) {
        if (!temp?.includes("verify")) {
          temp.push("verify");
        }
      }

      if (
        main_user_type &&
        dob &&
        profile_image &&
        gender &&
        mobile?.trim()?.length > 3
      ) {
        // setPercentage(50);
        // setPercentage((prev) => [...prev, "profile"]);
        if (!temp?.includes("profile")) {
          temp.push("profile");
        }
      }

      if (addressData?.length) {
        if (!temp?.includes("address")) {
          temp.push("address");
        }
      }
      if (userDocument?.length) {
        if (!temp?.includes("user_document")) {
          temp.push("user_document");
        }
      }
      setPercentage([...temp]);
    }
  }, [addressData, userDetailsData, userDocument]);

  if (!isShow || percentage?.length === 4) {
    return null;
  }

  return (
    <div className="">
      <div>
        <div className="progressbar mb-3">
          <div className="d-flex justify-content-between">
            <h5>Complete Your Profile</h5> <span>3 Steps to Complete</span>
          </div>

          {/* <ProgressBar now={percentage} label={`${percentage}%`} /> */}

          <div className="progress-flex">
            <div className="arrow-steps clearfix">
              <div
                className={`step ${
                  percentage.includes("profile") ? "current" : ""
                }`}
              >
                {" "}
                <span>
                  <Link to="/settings/details">Update Your profile</Link>
                </span>{" "}
              </div>
              <div
                className={`step ${
                  percentage.includes("address") ? "current" : ""
                }`}
              >
                {" "}
                <span>
                  {" "}
                  <Link to="/settings/address">Update Address</Link>
                </span>{" "}
              </div>
              <div
                className={`step ${
                  percentage.includes("user_document") ? "current" : ""
                }`}
              >
                <span>
                  {" "}
                  <Link to="/settings/update_documents">Upload Document</Link>
                </span>
              </div>
              <div
                className={`step ${
                  percentage.includes("verify") ? "current" : ""
                  } ${isVerificationRejected ? "rejected" : ""
                }`}
              >
                {" "}
                <span>
                  <Link to="/settings/update_documents">Verify</Link>
                </span>{" "}
              </div>
            </div>
            <div className="text-end">
              <Link to="/settings/details" className="btn btn-common ms-4">
                <i className="fa-regular fa-pen-to-square"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progressbar;
