// import React from "react";

import { Link, useNavigate } from "react-router-dom";
import { getInitials, isNonEmptyString } from "../../../helpers";
import { useContext, useRef, useState } from "react";
import ModalComponent from "../../../components/modalComponent/ModalComponent";
import ConnectionList from "./ConnectionList";
import useConnectedUsers from "../../../hooks/query/AllUserProfile/useAllConnectedUsersList";
import { userService } from "../../../services/UserService";
import { AuthContext } from "../../../context/authContext";
import { useMutation, useQueryClient } from "react-query";
import { API } from "../../../services/ApiClient";
import Message from "../message/Message";
import BannerImage from "../../../assets/images/profile-banner.jpg";
import { Dialog } from "primereact/dialog";
import Avatar from "react-avatar-edit";
import { postsService } from "../../../services/ImageUploadApi";
import {
  hideLoadingSpinner,
  showLoadingSpinner,
} from "../../../components/messageModal/MessageModal";
import MyActivities from "../myActivity/MyActivities";
import {
  getBannerImageByUserId,
  getProfileImageByUserId,
  uploadBannerApi,
  uploadFileDocument,
  uploadProfileImageApi,
} from "../../../services/fileUploadApi";
import { getUrlExtension } from "../../../components/customFileIcon/CustomFileIcon";
import VerifiedIcon from "assets/svg/verificationTick.png";
import imageCompression from "browser-image-compression";

const CoverProfileDetails = ({ userDetailsData, currentUserId }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const { auth } = useContext(AuthContext);
  const [dialogs, setDialogs] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: updateMutate } = useMutation(
    async (payload) => {
      const res = API.put(`users/${auth?.userId}`, payload);
      if (res) {
        return res;
      }

      return null;
    },
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries("users", auth?.userId);
        }
      },
      onSettled: () => {
        hideLoadingSpinner({});
      },
    }
  );
  const fileInputRef = useRef(null);
  const ProfileInputRef = useRef(null);

  const [isModalOpen, setIsModal] = useState(false);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const {
    isLoading: isConnectedUserListLoading,
    error: connectedUserListError,
    data: connectedUserListData,
  } = useConnectedUsers(currentUserId);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(userDetailsData);

  const handleDeleteUserMembers = async (item) => {
    try {
      await userService.deleteUserMembers({
        userId: auth?.userId,
        data: {
          id: item?.id,
          user_id: item?.user_id,
          users_members_id: item?.users_members_id,
        },
      });
      await queryClient.invalidateQueries(["connect-user"]);
    } catch (error) {}
  };

  const onConnectClick = async (e) => {
    e.preventDefault();

    if (auth?.userId) {
      const connectPayload = {
        user_id: auth?.userId,
        users_members_id: userDetailsData?.id,
      };
      // mutate(connectPayload);
      try {
        const res = await API.post("users-members", connectPayload);
        await queryClient.invalidateQueries(["connect-user"]);
      } catch (error) {}
    } else {
      navigate("/login");
    }
  };

  const followButton = () => {
    let followUser = connectedUserListData?.find(
      (row) => row?.users_members_id === userDetailsData?.id
    );

    return !!!followUser ? (
      <button
        type="button"
        className="btn btn-common btn-follow px-3 "
        onClick={onConnectClick}
        // disabled={
        //   isConnectLoading ||
        //   connectedUserListData.filter(
        //     (user) => user.users_members_id === user.id
        //   )
        // }
      >
        Add
      </button>
    ) : (
      <button
        type="button"
        className="btn btn-common unfollow-btn px-3 "
        onClick={(e) => handleDeleteUserMembers(followUser)}
        // disabled={
        //   isConnectLoading ||
        //   connectedUserListData.filter(
        //     (user) => user.users_members_id === user.id
        //   )
        // }
      >
        Remove
      </button>
    );
  };
  const openMessagePopup = (user) => {
    setIsModal(false);
    setSelectedUser(user);
    setIsMessageBoxOpen(true);
  };
  const handleFileOpenClick = (type) => {
    type === "profile"
      ? ProfileInputRef.current.click()
      : fileInputRef.current.click();
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];

    console.log("called");
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      console.log(file);
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        showLoadingSpinner({});
        const compressedFile = await imageCompression(file, options);
        console.log(compressedFile);
        const formData = new FormData();
        formData.append("file", compressedFile);
        // formData.append("upload_preset", "social_locket");
        // formData.append("cloud_name", "dzs0eyrnl");
        formData.append("name", file?.name);
        formData.append("user_id", currentUserId);
        // formData.append("name", file?.name);
        // formData.append("user_id", currentUserId);

        await uploadBannerApi(formData);
        // console.log({ res });
        const response = await getBannerImageByUserId(currentUserId);

        updateMutate({
          ...userDetailsData,
          banner: response?.[0]?.images,
          id: currentUserId,
        });
        setSelectedProfileImage(response?.[0]?.images);
        return response.data;
      } catch (err) {
        console.error(err);
        hideLoadingSpinner();
      }
    } else {
      setSelectedImage(null);
      if (file) {
        alert("Please select an image file.");
      }
    }
  };

  const handleProfileInputChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedProfileImage(file);
    } else {
      setSelectedProfileImage(null);
      if (file) {
        alert("Please select an image file.");
      }
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    fileInputRef.current.value = "";
  };

  const onClose = () => {
    setSelectedProfileImage(null);
  };
  const onCrop = (view) => {
    setSelectedProfileImage(view);
  };

  const saveCropImage = async () => {
    // setStoreImage([...storeImage, { imageCrop }]);
    setDialogs(false);
    try {
      showLoadingSpinner({});
      let file = await convertToFile(selectedProfileImage);
      const formData = new FormData();
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      showLoadingSpinner({});
      const compressedFile = await imageCompression(file, options);
      console.log(compressedFile);
      console.log(file);
      formData.append("file", compressedFile);
      formData.append("name", file.name);
      formData.append("user_id", currentUserId);

      // formData.append("upload_preset", "social_locket");
      // formData.append("cloud_name", "dzs0eyrnl");
      // const response = await postsService.uploadProfile(formData);
      await uploadProfileImageApi(formData);
      const response = await getProfileImageByUserId(currentUserId);
      updateMutate({
        ...userDetailsData,
        profile_image: response?.[0]?.images,
        id: currentUserId,
      });
      console.log(response?.[0]?.images);
      setSelectedProfileImage(response?.[0]?.images);
      const customEvent = new CustomEvent("profileImageUpdate", {
        detail: { profileImage: response?.[0]?.images },
      });

      // Dispatch the custom event
      window.dispatchEvent(customEvent);
      return response.data;
    } catch (err) {
      console.error(err);
    } finally {
      
      hideLoadingSpinner();
    }
  };

  const onBeforeFileLoad = async (elem) => {
    // if (elem.target.files[0].size > 3500000) {
    //   alert("File is too big!");
    //   // eslint-disable-next-line no-param-reassign
    //   elem.target.value = "";
    // }

    setSelectedProfileImage(elem.target.files[0]);
  };

  const convertToFile = async (dataUrl) => {
    // const pictureType = getUrlExtension(dataUrl);
    // const res = await fetch(dataUrl);
    // const blob = await res.blob();
    // let newFile = new File([blob], "pictureName", { type: pictureType });
    // return newFile;
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];

    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  };

  return (
    <>
      <Dialog
        visible={dialogs}
        header={() => (
          <p htmlFor="" className="text-2xl font-semibold textColor">
            Update Profile
          </p>
        )}
        onHide={() => setDialogs(false)}
      >
        <div className="confirmation-content flex flex-column align-items-center">
          <Avatar
            width={500}
            height={400}
            onCrop={onCrop}
            onClose={onClose}
            //   src={src}
            onBeforeFileLoad={onBeforeFileLoad}
            shadingColor="#474649"
            backgroundColor="#474649"
          />
          <div className="flex flex-column align-items-center mt-5 w-12">
            <div className="flex justify-content-around w-12 mt-4">
              <button
                type="button"
                onClick={saveCropImage}
                // label='Save'
                icon="pi pi-check"
                className="btn btn-common"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
        accept="image/*"
        onClick={() => {
          fileInputRef.current.value = "";
        }}
      />
      <input
        type="file"
        ref={ProfileInputRef}
        style={{ display: "none" }}
        onChange={handleProfileInputChange}
        accept="image/*"
        onClick={() => {
          ProfileInputRef.current.value = "";
        }}
      />
      <div
        className="cover-photo"
        style={{
          backgroundImage: selectedImage
            ? `url(${URL.createObjectURL(selectedImage)})`
            : `url(${
                userDetailsData?.banner ? userDetailsData?.banner : BannerImage
              })`,
          backgroundRepeat: "no-repeat",
        }}
      >
        {currentUserId === userDetailsData?.id ? (
          <span onClick={handleFileOpenClick}>
            <i className="fa-solid fa-camera"></i>
          </span>
        ) : null}
      </div>
      <div className="edit-profile">
        <figure className="position-relative">
          {!userDetailsData?.profile_image ? (
            <span className="text-uppercase">
              {isNonEmptyString(userDetailsData?.forename) &&
              isNonEmptyString(userDetailsData?.surname)
                ? getInitials(
                    `${userDetailsData?.forename}  ${userDetailsData?.surname}`
                  )
                : ""}
            </span>
          ) : (
            <picture>
              <source
                srcSet={userDetailsData?.profile_image}
                type="image/webp"
              />
              <source
                srcSet={userDetailsData?.profile_image}
                type="image/png"
              />
              <img
                loading="lazy"
                src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                data-src={userDetailsData?.profile_image}
                alt="user-img"
                className="img-fluid"
                width={120}
                height={120}
              />
            </picture>
          )}
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

        {currentUserId === userDetailsData?.id ? (
          <i
            className="fa fa-camera change-img"
            onClick={() => setDialogs(true)}
          />
        ) : null}

        <figcaption>
          <div>
            <h4 className="mb-0 mt-2">
              {userDetailsData &&
              isNonEmptyString(userDetailsData?.forename) &&
              isNonEmptyString(userDetailsData?.surname)
                ? `${userDetailsData?.forename}  ${userDetailsData?.surname}`
                : ""}

              {currentUserId === userDetailsData?.id ? (
                <Link
                  to="/settings/details"
                  state={userDetailsData || null}
                  className=""
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </Link>
              ) : null}
            </h4>
            <p className="mb-0">
              {isNonEmptyString(userDetailsData?.bio)
                ? `${userDetailsData?.bio}`
                : ""}
            </p>
          </div>
          <div
            className="post-count justify-content-center"
            style={{ display: "none" }}
          >
            <div className="post">
              <strong>121</strong>
              <span>Posts</span>
            </div>
            <div className="follower">
              <strong>123</strong>
              <span>Followers</span>
            </div>
            <div className="following">
              <strong>134</strong>
              <span>Following</span>
            </div>
          </div>

          {currentUserId === userDetailsData?.id ? (
            <div className="edit-btn">
              <button
                type="button"
                className="btn btn-common btn-follow px-3 "
                // style={{ display: 'none' }}
                onClick={() => setIsModal(!isModalOpen)}
              >
                <i className="fa-regular fa-user"></i> Connections
              </button>
              <MyActivities />
            </div>
          ) : null}
          {currentUserId !== userDetailsData?.id ? (
            <div className="edit-btn">
              {/* <button
                type="button"
                className="btn btn-common btn-follow px-3 "
                // style={{ display: 'none' }}
                // onClick={() => setIsModal(!isModalOpen)}
              >
                Add
              </button> */}
              {followButton()}
              <button
                type="button"
                className="btn btn-common btn-follow px-3 "
                // style={{ display: 'none' }}
                onClick={() => {
                  setIsMessageBoxOpen((prev) => !prev);
                  setSelectedUser(userDetailsData);
                }}
              >
                Message
              </button>
            </div>
          ) : null}
        </figcaption>
      </div>
      <ModalComponent
        show={isModalOpen}
        onHide={() => setIsModal(false)}
        heading="Contacts"
        size="xs"
      >
        <ConnectionList
          userId={currentUserId}
          handleClose={() => setIsModal(false)}
          handleDeleteUserMembers={handleDeleteUserMembers}
          openMessagePopup={openMessagePopup}
        />
      </ModalComponent>

      {isMessageBoxOpen && (
        <Message
          handleClose={() => {
            setIsMessageBoxOpen(false);
            setSelectedUser(userDetailsData);
          }}
          currentUser={selectedUser}
        />
      )}
    </>
  );
};

export default CoverProfileDetails;
