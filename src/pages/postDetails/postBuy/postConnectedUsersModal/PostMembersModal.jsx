import React, { useEffect, useState } from "react";
import useGetGroupMembers from "./useGetGroupMembers";
import { Link } from "react-router-dom";
import { getInitials } from "../../../../helpers";
import useConnectedUsers from "../../../../hooks/query/AllUserProfile/useAllConnectedUsersList";
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from "../../../../components/messageModal/MessageModal";
import {
  addGroupMember,
  createPostGroupAdmin,
  deletePostGroupAdmin,
  getPostGroupAdmins,
  removeGroupMember,
} from "../../../../services/postGroupApi";
import { useQuery, useQueryClient } from "react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { searchService } from "../../../../services/SearchService";
import Swal from "sweetalert2";

function PostMembersModal({
  postId,
  handleClose,
  userId,
  postGroupDetail,
  postGroupAdmin,
}) {
  const [search, setSearch] = useState("");
  const { data: usersList, isLoading: all_users_isLoading } = useQuery(
    ["all_users"],
    searchService.GetUsers
  );
  // const { data: postGroupAdminData } = useQuery(
  //   ["groupAdminList", postGroupDetail?.id],
  //   () => getPostGroupAdmins({ groupId: postGroupDetail?.id })
  // );
  const { isError, isLoading, data, error } = useGetGroupMembers(
    postGroupDetail?.id
  );
  const {
    isLoading: isConnectedUserListLoading,
    error: connectedUserListError,
    data: connectedUserListData,
  } = useConnectedUsers(userId);
  const queryClient = useQueryClient();
  const [isLoadingOnClick, setIsLoadingOnClick] = useState({
    id: "",
    value: false,
  });
  const [isCreateGroupAdminLoading, setIsCreateGroupAdminLoading] = useState({
    id: null,
    value: false,
  });
  const [allUsersList, setaAllUsersList] = useState([]);
  useEffect(() => {
    if (!postGroupAdmin?.[userId]) {
      setaAllUsersList(
        usersList?.filter(
          (row) =>
            row?.id !== Number(userId) &&
            (data[row?.id] || postGroupAdmin?.[row?.id])
        )
      );
      return;
    } else if (search?.trim()) {
      let target = usersList?.filter(
        (row) =>
          (row.forename?.toLowerCase()?.includes(search) ||
            row.surname?.toLowerCase()?.includes(search)) &&
          row?.id !== Number(userId)
      );
      setaAllUsersList(target);
    } else {
      let tempConnectedUsers = {};
      connectedUserListData?.map((item) => {
        tempConnectedUsers = {
          ...tempConnectedUsers,
          [item?.users_members_id]: {
            ...item,
            id: item?.users_members_id,
          },
        };
      });
      console.log({ postGroupAdmin });
      let temp = usersList?.filter(
        (row) =>
          row?.id !== Number(userId) &&
          (postGroupAdmin?.[row?.id] ||
            tempConnectedUsers?.[row?.id] ||
            data?.[row?.id])
      );

      setaAllUsersList(temp);
    }
  }, [search, usersList, connectedUserListData, data]);
  if (isLoading || isConnectedUserListLoading || all_users_isLoading) {
    return <p>...Loading</p>;
  }
  const handleAddMemberInGroup = async (id) => {
    try {
      setIsLoadingOnClick({
        id: id,
        value: true,
      });
      await addGroupMember({
        user_id: id,
        post_group_id: postGroupDetail?.id,
        admin_id: userId,
        post_id: postId,
      });
      await queryClient?.invalidateQueries({
        queryKey: ["groupMember", postGroupDetail?.id],
      });
    } catch (error) {
    } finally {
      setIsLoadingOnClick({
        id: "",
        value: false,
      });
    }
  };

  const handleRemoveMemberInGroup = async (userId) => {
    try {
      setIsLoadingOnClick({
        id: userId,
        value: true,
      });
      await removeGroupMember({
        user_id: userId,
        admin_id: data?.[userId]?.id,
        post_id: postId,
        post_group_id: postGroupDetail?.id,
        id: data?.[userId]?.id,
      });
      await queryClient?.invalidateQueries({
        queryKey: ["groupMember", postGroupDetail?.id],
      });
    } catch (error) {
    } finally {
      setIsLoadingOnClick({
        id: "",
        value: false,
      });
    }
  };

  const handleMakeGroupAdmin = async (new_user_id) => {
    try {
      const data = {
        post_group_id: postGroupDetail?.id,
        user_id: new_user_id,
        admin_id: userId,
        post_id: postId,
      };
      setIsCreateGroupAdminLoading({
        id: new_user_id,
        value: true,
      });
      const res = await createPostGroupAdmin(data);
      await queryClient.invalidateQueries({
        queryKey: ["postGroupAdmin", postGroupDetail?.id],
      });
    } catch {
    } finally {
      setIsCreateGroupAdminLoading({
        id: "",
        value: false,
      });
    }
    // return null;
  };
  const handleRemoveGroupAdmin = async (new_user_id) => {
    console.log({ postGroupAdmin });
    try {
      let data = {
        id: postGroupAdmin?.[new_user_id]?.id,
        user_id: userId,
        post_group_id: postGroupDetail?.id,
        post_id: postId,
        admin_id: new_user_id,
      };
      setIsCreateGroupAdminLoading({
        id: new_user_id,
        value: true,
      });
      await deletePostGroupAdmin(data);
      await queryClient.invalidateQueries({
        queryKey: ["postGroupAdmin", postGroupDetail?.id],
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        titleText: "Something went wrong!",
        icon: "error",
      });
    } finally {
      setIsCreateGroupAdminLoading({
        id: "",
        value: false,
      });
    }
  };

  return (
    <div>
      {isError && <p>{connectedUserListError + ""}</p>}

      {!postGroupAdmin?.[userId] ? null : (
        <div className="search-add-user mb-4">
          <h5>Global Search</h5>
          <input
            type="search"
            placeholder="Search"
            className="form-control"
            onChange={(event) => {
              setSearch(event.target.value.toLowerCase());
            }}
          />
        </div>
      )}
      {/* <hr className="py-2"></hr> */}
      <h5 className="mb-3">Connected Users</h5>
      <ul className="connected-user">
        {allUsersList && allUsersList.length > 0 ? (
          allUsersList?.map((user) => (
            <li key={user.id} className="mb-3 pb-3 border-bottom">
              <div className="user-post search-user">
                <div
                  className="post-profile"
                  onClick={() => {
                    handleClose && handleClose();
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
                    {postGroupAdmin?.[user?.id] ? (
                      <div
                        style={{
                          fontSize: 13,
                          fontFamily: "bold",
                        }}
                      >
                        Admin
                      </div>
                    ) : null}
                    <h5 className="mb-0">
                      <Link
                        to={`/profile/${user.forename}${user.surname}_${user.users_members_id}`}
                      >{`${user.forename} ${user.surname}`}</Link>
                    </h5>
                    <span>{user.bio}</span>
                  </figcaption>
                </div>
                {!postGroupAdmin?.[userId] ? null : (
                  <div className="follow">
                    {postGroupAdmin[user?.id] ? (
                      <button
                        type="button"
                        className="unfollow-btn me-2"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveGroupAdmin(user?.id);
                        }}
                        disabled={isLoadingOnClick.id === user?.id}
                      >
                        {isCreateGroupAdminLoading.id === user?.id ? (
                          <ProgressSpinner
                            color="#fff"
                            style={{ width: "10px", height: "10px" }}
                            strokeWidth="4"
                          />
                        ) : (
                          "Remove Admin"
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="follow-btn mx-2"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMakeGroupAdmin(user?.id);
                        }}
                        disabled={isCreateGroupAdminLoading.id === user?.id}
                      >
                        {isCreateGroupAdminLoading.id === user?.id ? (
                          <ProgressSpinner
                            color="#fff"
                            style={{ width: "10px", height: "10px" }}
                            strokeWidth="4"
                          />
                        ) : (
                          "Make Admin"
                        )}
                      </button>
                    )}
                    {data?.[user?.id] ? (
                      <button
                        type="button"
                        className="unfollow-btn me-2"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveMemberInGroup(user?.id);
                        }}
                        disabled={isLoadingOnClick.id === user?.id}
                      >
                        {isLoadingOnClick.id === user?.id ? (
                          <ProgressSpinner
                            color="#fff"
                            style={{ width: "10px", height: "10px" }}
                            strokeWidth="4"
                          />
                        ) : (
                          "Remove as member"
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="follow-btn"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddMemberInGroup(user?.id);
                        }}
                        disabled={isLoadingOnClick.id === user?.id}
                      >
                        {isLoadingOnClick.id === user?.id ? (
                          <ProgressSpinner
                            color="#fff"
                            style={{ width: "10px", height: "10px" }}
                            strokeWidth="4"
                          />
                        ) : (
                          "Add as member"
                        )}
                      </button>
                    )}
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
}

export default PostMembersModal;
