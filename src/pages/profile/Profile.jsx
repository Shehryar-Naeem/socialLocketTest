import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { getAfterUnderScoreValue, isNonEmptyArray } from "../../helpers";
import useUsersById from "../../hooks/query/AllUserProfile/useUserById";
import useUserPosts from "../../hooks/query/AllUserProfile/useUserPostById";
import CoverProfileDetails from "./components/CoverProfileDetails";
import Tabs from "../../components/tabs/Tabs";
import UserBio from "./components/UserDetailBio";
import UserPosts from "./components/UserPosts";
import Events from "pages/setting/details/events/Events";

const Profile = () => {
  const params = useParams();
  const id = getAfterUnderScoreValue(params);
  const { auth } = useContext(AuthContext);

  const {
    isLoading: isUserDetailsLoading,
    error: userDetailsError,
    data: userDetailsData,
  } = useUsersById(id);
  const { data: usersPost } = useUserPosts(id);
  const currentUserId = auth?.userId;

  let tabs = [
    {
      title: "Bio",
      content: (
        <UserBio
          userDetailsData={userDetailsData}
          isUserDetailsLoading={isUserDetailsLoading}
          userDetailsError={userDetailsError}
        />
      ),
    },
    {
      title: "Listings",
      content: (
        <UserPosts usersPost={usersPost} userId={Number(auth?.userId)} />
      ),
    },
    {
      title: "Events",
      content: <Events usersPost={usersPost} userId={Number(auth?.userId)} />,
    },
  ];
  // const tabs =
  //   currentUserId === userDetailsData?.id
  //     ? [
  //         ...commonTab,
  //         {
  //           title: "Events",
  //           content: (
  //             <Events usersPost={usersPost} userId={Number(auth?.userId)} />
  //           ),
  //         },
  //       ]
  //     : commonTab;

  return (
    <div>
      <div className="box-shadow">
        <div className="profile">
          <div className="cover-profile">
            <CoverProfileDetails
              currentUserId={currentUserId}
              userDetailsData={userDetailsData}
            />
          </div>
          <Tabs tabs={tabs} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
