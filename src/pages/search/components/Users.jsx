import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import SearchImage from "../../../assets/images/search-form.png";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import { searchService } from "../../../services/SearchService";
import { getAddress, getInitials, isNonEmptyString } from "../../../helpers";
import { Link, useNavigate } from "react-router-dom";
import { removeWhitespaces } from "../../../helpers";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useMutation, useQueryClient } from "react-query";
import { API } from "../../../services/ApiClient";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { toast } from "react-toastify";
import useConnectedUsers from "../../../hooks/query/AllUserProfile/useAllConnectedUsersList";
import { userService } from "../../../services/UserService";
import useMaps from "./useMaps";
import FilterUserModal, { initialUserFilter } from "./FilterUserModal";
//  import 'stify.css';
import VerifiedIcon from "assets/svg/verificationTick.png";

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const {
    isLoaded,
    getMarkerIcon,
    markers,
    // filterMarkers,
    users,
    userPageNumber,
    userAdrress,
  } = useMaps({ type: "user", page: currentPage, limit: postsPerPage });

  // const { isLoaded, loadError } = useJsApiLoader({
  //   id: "google-map-script",
  //   googleMapsApiKey: "AIzaSyD3OC1Q1D4Yg1Y37z2l3VXGGENkhWhEsWQ",
  //   libraries: ["places"],
  // });
  // const [users, setUsers] = useState([]);
  // const [userAdrress, setUserAddress] = useState([]);
  //my states
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [inputValue, setInputValue] = useState(initialUserFilter);
  // const [allUsers, setAllUsers] = useState(users);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //
  const [filterStore, setFilterStore] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  // const [markers, setMarkers] = useState([]);
  // const [isFollowing, setIsFollowing] = useState(false);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  // const handleTabClick = (index) => {
  //   if (index == 0) {
  //     filterMarkers(users, userAdrress);
  //   }
  // };

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);
  const { data: connectedUserListData } = useConnectedUsers(auth?.userId);

  // const handleReset = () => {
  //   setInputValue(initialUserFilter);
  // };

  useEffect(() => {
    setFilterStore(users);
  }, [users]);

  useEffect(() => {
    let temp = users?.filter(
      (elm) =>
        elm?.forename
          ?.toLowerCase()
          .includes(inputValue?.firstName?.toLowerCase()) &&
        elm?.surname
          ?.toLowerCase()
          .includes(inputValue?.lastName?.toLowerCase()) &&
        elm?.email?.toLowerCase().includes(inputValue?.email.toLowerCase()) &&
        elm?.main_user_type
          ?.toLowerCase()
          .includes(inputValue?.main_user_type?.toLowerCase()) &&
        elm?.gender?.toLowerCase().includes(inputValue?.gender?.toLowerCase())
    );

    if (inputValue?.all?.trim()) {
      temp = temp?.filter(
        (elm) =>
          elm.forename.toLowerCase().includes(inputValue?.all?.toLowerCase()) ||
          elm.surname.toLowerCase().includes(inputValue?.all?.toLowerCase()) ||
          elm.email.toLowerCase().includes(inputValue?.all?.toLowerCase()) ||
          (elm?.address?.location &&
            elm?.address?.location
              .toLowerCase()
              .includes(inputValue?.all?.toLowerCase()))
      );
    }
    setFilterStore([...temp]);
    //
    // setFilteredUsers(temp)
  }, [inputValue]);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // useEffect(() => {
  //   const fetchInitials = async () => {
  //     try {
  //       const response1 = searchService.GetUserAddress();
  //       const response2 = searchService.GetUsers();
  //       const [result1, result2] = await Promise.all([response1, response2]);

  //       setUserAddress(result1);
  //       setUsers(result2);
  //       setFilteredUsers(result2);

  //       fetchData(result2, result1);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchInitials();
  // }, []);

  // useEffect(() => {
  //  if(user)
  // }, [userId]);

  // const fetchData = async (users, addresses) => {
  //   setMarkers([]);
  //   const newMarkers = await Promise.all(
  //     users.map(async (user) => {
  //       const userAddresses = addresses.filter((x) => x.id === user.id);
  //       if (
  //         userAddresses &&
  //         typeof userAddresses !== "undefined" &&
  //         userAddresses.length > 0
  //       ) {
  //         const markers = await Promise.all(
  //           userAddresses.map(async (address) => {
  //             const addr = getAddress(
  //               address.street_number,
  //               address.address_line_1,
  //               address.address_line_2,
  //               address.city,
  //               address.nick_name,
  //               address.postal_code
  //             );
  //             const { lat, lng } = await fetchLatLng(addr);
  //             return {
  //               id: user.id,
  //               position: { lat, lng },
  //               title: `${user.forename} ${user.surname}`,
  //               location: addr,
  //               profile_image: user.profile_image,
  //             };
  //           })
  //         );
  //         return markers;
  //       } else {
  //         return [];
  //       }
  //     })
  //   );
  //   const flattenedMarkers = newMarkers.flat();
  //   setMarkers(flattenedMarkers);
  // };
  //onChangeMultipleFilter
  //
  const onChangeMultipleFilter = (e) => {
    const { name, value } = e.target;

    setInputValue((prev) => {
      return { ...prev, [name]: value };
    });
  };
  //1
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    let temp = filterStore?.filter(
      (user) =>
        user.forename.toLowerCase().includes(value.toLowerCase()) ||
        user.surname.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(temp);
    // const ids = userAdrress
    //   .filter(
    //     (resp) =>
    //       resp.main_user_type?.toLowerCase()?.includes(value.toLowerCase()) &&
    //       resp?.user_id != null
    //   )
    //   ?.map((x) => x.user_id);
    // //
    //   filtered = users?.filter(
    //     (user) =>
    //       user.forename.toLowerCase().includes(value.toLowerCase()) ||
    //       user.surname.toLowerCase().includes(value.toLowerCase()) ||
    //       user.email.toLowerCase().includes(value.toLowerCase()) ||
    //       ids.includes(user.id)
    //   );

    setInputValue((prev) => {
      return { ...prev, [name]: value };
    });
    setShow(false);
  };

  //handleMultipleFilter
  // const handleMultipleFilter = () => {
  //   let temp = filterStore?.filter(
  //     (elm) =>
  //       elm?.forename
  //         ?.toLowerCase()
  //         .includes(inputValue?.firstName?.toLowerCase()) &&
  //       elm?.surname
  //         ?.toLowerCase()
  //         .includes(inputValue?.lastName?.toLowerCase()) &&
  //       elm?.email?.toLowerCase().includes(inputValue?.email.toLowerCase()) &&
  //       elm?.main_user_type
  //         ?.toLowerCase()
  //         .includes(inputValue?.main_user_type?.toLowerCase()) &&
  //       elm?.gender?.toLowerCase().includes(inputValue?.gender?.toLowerCase())
  //   );
  //   setFilteredUsers(temp);
  //   // setFilteredUsers(temp)
  //   filterMarkers(temp, userAdrress);
  // };
  // console.log('filteredUsers', filteredUsers)
  // async function fetchLatLng(address) {
  //   const encodedAddress = encodeURIComponent(`${address}`);
  //   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyD3OC1Q1D4Yg1Y37z2l3VXGGENkhWhEsWQ`;
  //   const response = await fetch(url);
  //   const data = await response.json();
  //   if (data.status === "OK") {
  //     return data.results[0].geometry.location;
  //   } else {
  //     throw new Error(
  //       `Error fetching latitude and longitude for address: ${address}`
  //     );
  //   }
  // }

  const handleMarkerClick = (event, marker) => {
    const url = `/profile/${removeWhitespaces(marker.title)}_${marker.id}`;
    navigate(url, { replace: true });
  };
  // const iconOptions = {
  //   scale: 0.1,
  //   anchor: { x: 15, y: 30 },
  // };
  // const getMarkerIcon = (data) => {
  //   const icon = document.createElement("div");
  //   const initials = getInitials(data?.title);
  //   const imgSrc = data?.profile_image;
  //   const imgTag = `<img loading="lazy" src="https://img.freepik.com/free-photo/happy-excited-tourist-shooting-landmarks_1262-18852.jpg" data-src="https://img.freepik.com/free-photo/happy-excited-tourist-shooting-landmarks_1262-18852.jpg" alt="${data?.title}" className="img-fluid" width="70" height="70" />`;

  //   icon.innerHTML = `<div className="post-profile" style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center;"><figure style=" margin: 0px; display: flex; align-items: center;">${
  //     imgSrc
  //       ? `<picture><source srcset="https://img.freepik.com/free-photo/happy-excited-tourist-shooting-landmarks_1262-18852.jpg" type="image/webp"><source srcset="https://img.freepik.com/free-photo/happy-excited-tourist-shooting-landmarks_1262-18852.jpg" type="image/png">${imgTag}</picture>`
  //       : `<span style="font-size:100%;">${initials}</span>`
  //   }</figure></div>`;

  //   const svgString = encodeURIComponent(
  //     // `<svg fill="#f00" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${icon.innerHTML}</div></foreignObject></svg>`
  //     `<svg style="width:40px; height:40px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><foreignObject width="100%" height="100%" style="background-color:#00c8c8; color:#fff; font-family: Roboto; border-radius:50%; font-size:50px; border: 3px solid #fff;"><div style="width:100%; height:100%;" xmlns="http://www.w3.org/1999/xhtml">${icon.innerHTML}</div></foreignObject></svg>`
  //   );

  //   const markerIcon = new window.google.maps.MarkerImage(
  //     `data:image/svg+xml;charset=UTF-8,${svgString}`,
  //     null,
  //     null,
  //     null,
  //     new window.google.maps.Size(40, 40)
  //   );

  //   return markerIcon;
  // };

  //https://green.app.sociallocket.com/api/v1/users-members

  const queryClient = useQueryClient();

  const { mutate, isLoading: isConnectLoading } = useMutation(
    async (payload) => {
      const res = await API.post("users-members", payload);
      toast.success("🦄 Wow so easy!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      if (isNonEmptyString(res?.data?.message)) {
        toast.success("connected Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      return res;
    },
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries(["users-member"]);
          queryClient.invalidateQueries(["connect-user"]);
        }
      },
    }
  );

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

  const onConnectClick = async (e, id) => {
    e.preventDefault();
    const connectPayload = {
      user_id: auth?.userId,
      users_members_id: id,
    };
    if (auth?.userId) {
      mutate(connectPayload);
    } else {
      navigate("/login");
    }
  };

  const followButton = (user) => {
    let followUser = connectedUserListData?.find(
      (row) => row?.users_members_id === user?.id
    );
    return !!!followUser ? (
      <button
        type="button"
        className="follow-btn"
        onClick={(e) => onConnectClick(e, user.id)}
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
        className="unfollow-btn"
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

  return (
    <>
      <div className="box-shadow filter-option">
        <form className="search-form position-relative" role="search">
          <input
            type="text"
            className="form-control"
            placeholder="eg. 'Name' "
            aria-label="Search"
            name="all"
            value={inputValue.all}
            onChange={handleFilterChange}
            // onKeyUp={handleFilterChange}
          />
          <img src={SearchImage} alt="search" width={24} height={24} />
        </form>
        <div className="filter-button">
          <button
            type="button"
            className="btn"
            //data-bs-toggle="modal"
            //href="/filter_modal"
            //   role="button"
            title="Filter"
            variant="primary"
            onClick={handleShow}
          >
            <i className="fa-solid fa-sliders" />
          </button>
        </div>
        {/* <div className="search-filter">
          <div className="filter-value">
            <select className="form-select" style={{ border: "none" }}>
              <option selected="" disabled="">
                Location
              </option>
              <option>Birmingham</option>
              <option>Birmingham</option>
              <option>Birmingham</option>
              <option>Birmingham</option>
            </select>

            <select className="form-select" style={{ border: "none" }}>
              <option selected="" disabled="">
                5 Miles
              </option>
              <option>5 miles</option>
              <option>10 miles</option>
              <option>15 miles</option>
            </select>

            <select className="form-select" style={{ border: "none" }}>
              <option selected="" disabled="">
                2 Pages
              </option>
              <option>2 Pages</option>
              <option>3 Pages</option>
              <option>5 Pages</option>
              <option>6 Pages</option>
            </select>

            <select className="form-select" style={{ border: "none" }}>
              <option selected="" disabled="">
                Price
              </option>
              <option>$ 100</option>
              <option>$ 200</option>
              <option>$ 300</option>
              <option>$ 400</option>
            </select>

            <select className="form-select" style={{ border: "none" }}>
              <option selected="" disabled="">
                Stakeholders
              </option>
              <option>Books</option>
              <option>Articles</option>
              <option>Blog</option>
            </select>
          </div>
          <div className="filter-button">
            <button
              type="button"
              className="btn"
              //data-bs-toggle="modal"
              //href="/filter_modal"
              //   role="button"
              title="Filter"
              variant="primary"
              onClick={handleShow}
            >
              <i className="fa-solid fa-sliders" />
            </button>
          </div>
        </div> */}
      </div>
      <div className="box-shadow p-0">
        <Tabs
          className="search common-tab"
          onSelect={() => setIsMapLoaded(false)}
        >
          <TabList className={"nav nav-tabs"}>
            <Tab className={"nav-link"} selectedClassName="active">
              Map View
            </Tab>
            <Tab className={"nav-link"} selectedClassName="active">
              List View
            </Tab>
          </TabList>
          <TabPanel>
            <div className="map-view pt-5">
              {isLoaded && (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "600px" }}
                  center={center}
                  zoom={3}
                  key="map"
                  onLoad={(map) => setTimeout(() => setIsMapLoaded(map))}
                >
                  {isMapLoaded &&
                    filterStore.map((marker, index) => {
                      if (!marker?.address || !marker?.address?.location) {
                        return null;
                      }

                      return (
                        <Marker
                          key={index + ""}
                          position={marker.address?.position}
                          icon={getMarkerIcon(marker?.address)}
                          title={marker?.address?.title}
                          className={"hello"}
                          onClick={(event) =>
                            handleMarkerClick(event, marker?.address)
                          }
                        ></Marker>
                      );
                    })}
                </GoogleMap>
              )}
              {!isLoaded && <div>Loading Google Maps API...</div>}
            </div>
          </TabPanel>
          <TabPanel className={"tab-content"}>
            <div
              className="tab-pane fade show active"
              id="listview"
              role="tabpanel"
              aria-labelledby="listview-tab"
            >
              <ul>
                {filterStore &&
                  filterStore.length > 0 &&
                  filterStore.map(
                    (user) =>
                      user.id !== auth?.userId && (
                        <li key={user.id}>
                          <div className="user-post user-list search-user">
                            <div className="post-profile">
                              <div style={{ position: "relative" }}>
                                {Number(user?.user_verification) === 1 && (
                                  <img
                                    src={VerifiedIcon}
                                    className="verified_icon"
                                    style={{ zIndex: 1 }}
                                  />
                                )}
                                <figure>
                                  <Link
                                    to={`/profile/${user.forename}${user.surname}_${user.id}`}
                                  >
                                    <span hidden={user.profile_image}>
                                      {getInitials(
                                        `${user.forename} ${user.surname}`
                                      )}
                                    </span>
                                    <picture hidden={!user.profile_image}>
                                      <source
                                        srcSet={user.profile_image}
                                        type="image/webp"
                                      />
                                      <source
                                        srcSet={user.profile_image}
                                        type="image/png"
                                      />
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
                              </div>
                              <figcaption>
                                <h5 className="mb-1">
                                  <Link
                                    to={`/profile/${user.forename}${user.surname}_${user.id}`}
                                  >{`${user.forename} ${user.surname}`}</Link>
                                </h5>
                                {/* <span>{user.bio}</span> */}
                                <ul>
                                  <li>
                                    <Badge bg="info">
                                      {user?.main_user_type}
                                    </Badge>
                                  </li>
                                  <li>{user?.mobile}</li>
                                </ul>
                                {/* <span>
                              <i className="fa fa-users" /> 200 followers
                            </span> */}
                              </figcaption>
                            </div>
                            <div className="follow">{followButton(user)}</div>
                          </div>
                        </li>
                      )
                  )}
              </ul>
              <div className="pagination">
                {/* Custom pagination links */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`pagination_btn ${
                    currentPage === 1 ? "disabled" : ""
                  }`}
                >
                  &lt; Prev
                </button>
                <span>Page {currentPage}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!userPageNumber?.next}
                  className={`pagination_btn ${
                    !userPageNumber?.next ? "disabled" : ""
                  }`}
                >
                  Next &gt;
                </button>
              </div>
              {/* <div className="people-search">
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination">
                                        <li className="page-item">
                                            <a className="page-link" href="/" aria-label="Previous">
                                                <span aria-hidden="true">«</span>
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link active" href="/">
                                                1
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="/">
                                                2
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="/">
                                                3
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="/" aria-label="Next">
                                                <span className="active" aria-hidden="true">
                                                    »
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div> */}
            </div>
            {filterStore && filterStore.length === 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 19,
                    fontWeight: "bold",
                    marginBottom: 40,
                  }}
                >
                  No Data Found
                </p>
              </div>
            )}
          </TabPanel>
        </Tabs>
      </div>
      {/* Filter modal */}
      <FilterUserModal
        initialState={inputValue}
        onSubmit={(value) => {
          setInputValue((prev) => ({
            ...prev,
            ...value,
          }));
        }}
        isShow={show}
        handleClose={handleClose}
      />
      {/* Filter modal */}
    </>
  );
};

export default Users;
