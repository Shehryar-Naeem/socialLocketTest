import React from "react";
import { Link } from "react-router-dom";
import { getInitials } from "../../../helpers";
import useConnectedUsers from "../../../hooks/query/AllUserProfile/useAllConnectedUsersList";

const ConnectionList = (props) => {
  const {
    isLoading: isConnectedUserListLoading,
    error: connectedUserListError,
    data: connectedUserListData,
  } = useConnectedUsers(props?.userId);

  if (isConnectedUserListLoading) {
    return <p>...Loading</p>;
  }

  // const handleDeleteUserMembers = async (item) => {
  //   try {
  //     await userService.deleteUserMembers({
  //       userId: auth?.userId,
  //       data: {
  //         id: item?.id,
  //         user_id: item?.user_id,
  //         users_members_id: item?.users_members_id,
  //       },
  //     });
  //     await queryClient.invalidateQueries(["connect-user"]);
  //   } catch (error) {}
  // };

  return (
    <div>
      {connectedUserListError && <p>{connectedUserListError}</p>}
      <ul className="connected-user">
        {connectedUserListData && connectedUserListData.length > 0 ? (
          connectedUserListData.map((user) => (
            <li key={user.id}>
              <div className="user-post search-user">
                <div
                  className="post-profile"
                  onClick={() => {
                    props?.handleClose && props.handleClose();
                  }}
                >
                  <figure>
                    <Link
                      to={`/profile/${user.forename}${user.surname}_${user.id}`}
                    >
                      <span hidden={user.profile_image}>
                        {getInitials(`${user.forename} ${user.surname}`)}
                      </span>
                      <picture hidden={!user.profile_image}>
                        <source srcSet={user.profile_image} type="image/webp" />
                        <source srcSet={user.profile_image} type="image/png" />
                        <img
                          loading="lazy"
                          src="assets/images/user-img.png"
                          data-src="assets/images/user-img.png"
                          alt="user-img"
                          className="img-fluid"
                          width={70}
                          height={70}
                        />
                      </picture>
                    </Link>
                  </figure>
                  <figcaption>
                    <h5 className="mb-0">
                      <Link
                        to={`/profile/${user.forename}${user.surname}_${user.users_members_id}`}
                      >{`${user.forename} ${user.surname}`}</Link>
                    </h5>
                    <span>{user.bio}</span>
                  </figcaption>
                </div>
                {props?.postId ? (
                  <div className="follow">
                    {/* <button
                    type="button"
                    className="follow-btn me-2"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      props?.openMessagePopup(user);
                    }}
                  >
                    Message
                  </button> */}

                    <button
                      type="button"
                      className="follow-btn"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        props?.handleDeleteUserMembers(user);
                      }}
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <div className="follow">
                    <button
                      type="button"
                      className="follow-btn me-2"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        props?.openMessagePopup(user);
                      }}
                    >
                      Message
                    </button>

                    <button
                      type="button"
                      className="unfollow-btn"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        props?.handleDeleteUserMembers(user);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>User's not connect yet</p>
        )}
      </ul>
    </div>
  );
};

export default ConnectionList;
