import React, { useContext } from "react";
import VerifiedIcon from "assets/svg/verificationTick.png";
import { useQueryClient } from "react-query";
import { AuthContext } from "context/authContext";

const useGetVerification = (isVerified, style) => {
  const value = useContext(AuthContext);
  const user_verification = value?.loginUserDetail?.user_verification;
  return (Number(user_verification) && isVerified === undefined) ||
    isVerified ? (
      <div className="verified_with_text">
      <img
        src={VerifiedIcon}
        style={{
          zIndex: 1,
          ...style,
        }}
        className="verified_icon"
      />
        <span>Verify</span>
      </div>
  ) : null;
};

export default useGetVerification;
