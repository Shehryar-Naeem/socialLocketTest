import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getIdValue, getInitials } from "../../helpers";
import usePostsById from "../../hooks/query/Posts/usePostsById";
import "../../styles/globalStyles.css";
import { getUserFullName, getUserProfileImage } from "../../utils/Storage";
import { AuthContext } from "../../context/authContext";
import { PostDetailContext } from "./PostDetailContext";

function usePostDetails() {
  const { setPostDetail } = useContext(PostDetailContext);

  const { auth } = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();
  const [commentOpen, setCommentOpen] = useState(params?.isPostBuyCheck);
  const [isOpenForBuy, setIsOpenForBuy] = useState(params?.isPostBuyCheck);
  const id = getIdValue(params);
  const { pathname } = useLocation();
  const {
    isLoading: postsDetailsLoading,
    error: postsDetailsError,
    data: postsDetailsData,
  } = usePostsById(id);
  useEffect(() => {
    setIsOpenForBuy(pathname?.includes("/post-detail"));
  }, [params]);

  const userProfilePic = getUserProfileImage();
  const UserFullName = getUserFullName();
  const userProfileText = getInitials(UserFullName);
  useEffect(() => {
    setPostDetail(postsDetailsData?.[0]);
  }, [postsDetailsData]);

  return { postsDetailsData, navigate, isOpenForBuy, postId: id, auth };
}

export default usePostDetails;
