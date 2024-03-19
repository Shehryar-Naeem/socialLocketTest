import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import SearchImage from "../../../assets/images/search-form.png";
import { searchService } from "../../../services/SearchService";
import {
  removeQuestionAndForwardSlash,
  removeWhitespaces,
} from "../../../helpers";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { parseStringArray } from "../../../helpers";
import Placeholder from "../../../assets/images/user-img.png";

import parse from "html-react-parser";
import moment from "moment/moment";
import useMaps from "./useMaps";
import FilterPostModal, { initialPostFilter } from "./FilterPostModal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { API } from "../../../services/ApiClient";
import { AuthContext } from "../../../context/authContext";
import PostSearchCard from "./PostSearchCard";

const Posts = ({ defaultTitle }) => {
  const { auth } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const { isLoaded, getMarkerIcon, posts, fetchInitialsPost, postPageNumber } =
    useMaps({
      type: "post",
      page: currentPage,
      limit: postsPerPage,
    });
  const [tabIndex, setTabIndex] = useState(0);
  const [inputValue, setInputValue] = useState(initialPostFilter);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  useEffect(() => {
    setFilteredPosts(posts ?? []);
  }, [posts]);

  const { data: postLikedData } = useQuery(["post-likes"], () =>
    API.get(`post-likes`).then((res) => {
      return res.data.result;
    })
  );

  // const [markers, setMarkers] = useState([]);
  // const { isLoaded } = useMaps();

  const navigate = useNavigate();
  const handleTabClick = (index) => {
    setIsMapLoaded(false);
    setTabIndex(index);
    fetchInitialsPost(currentPage,postsPerPage);

  };

  // useEffect(() => {
  //   searchService
  //     .GetPosts()
  //     .then((data) => {
  //       setPosts(data);
  //       setFilteredPosts(data);
  //       // fetchData(data);
  //     })
  //     .catch((error) => console.error(error));
  // }, []);

  // const fetchData = async (posts) => {
  //   setMarkers([]);
  //   const newMarkers = await Promise.all(
  //     posts.map(async (post) => {
  //       const { lat, lng } = await fetchLatLng(post.location);
  //       return {
  //         id: post.id,
  //         position: { lat, lng },
  //         title: `${post.title}`,
  //         location: post.location,
  //       };
  //     })
  //   );
  //   setMarkers(newMarkers);
  // };
  // console.log({ users, posts });
  ///
  useEffect(() => {
    if (defaultTitle) {
      setTabIndex(1);
    }
  }, []);

  useEffect(() => {
    // if (defaultTitle) {
    //   setTabIndex(1);
    // }
    defaultTitle &&
      posts &&
      setInputValue((prev) => ({
        ...prev,
        all: defaultTitle,
      }));
  }, [posts, defaultTitle]);
  useEffect(() => {
    // let temp = posts?.filter(
    //   (elm) =>
    //     elm?.forename
    //       ?.toLowerCase()
    //       .includes(inputValue?.firstName?.toLowerCase()) &&
    //     elm?.surname
    //       ?.toLowerCase()
    //       .includes(inputValue?.lastName?.toLowerCase()) &&
    //     elm?.title?.toLowerCase().includes(inputValue?.title.toLowerCase()) &&
    //     elm?.pages?.toLowerCase().includes(inputValue?.pages?.toLowerCase()) &&
    //     elm?.type?.toLowerCase().includes(inputValue?.type?.toLowerCase()) &&
    //     elm?.status?.toLowerCase().includes(inputValue?.status?.toLowerCase())
    // );
    const {
      all,
      firstName,
      lastName,
      pages,
      status,
      title,
      type,
      keywords,
      maxPage,
      minPage,
      minPrice,
      maxPrice,
    } = inputValue;
    let temp = posts;
    if (
      firstName ||
      lastName ||
      pages ||
      status ||
      title ||
      type ||
      keywords ||
      maxPage ||
      minPage ||
      minPrice ||
      maxPrice
    ) {
      temp = posts?.filter((item) => {
        const pageNumber = parseInt(item.pages, 10);

        // Check if the page number is within the desired range

        const isMinPageValid =
          minPage && !maxPage && (isNaN(minPage) || pageNumber >= minPage);
        const isMaxPageValid =
          maxPage && !minPage && (isNaN(maxPage) || pageNumber <= maxPage);
        const isBetween =
          minPage && maxPage && pageNumber >= minPage && pageNumber <= maxPage;

        const priceNumber = parseInt(item.price, 10);

        const isMinPriceValid =
          minPrice && !maxPrice && (isNaN(minPrice) || priceNumber >= minPrice);
        const isMaxPriceValid =
          maxPrice && !minPrice && (isNaN(maxPrice) || priceNumber <= maxPrice);
        const isPriceBetween =
          minPrice &&
          maxPrice &&
          priceNumber >= minPrice &&
          priceNumber <= maxPrice;

        return (
          item?.user?.forename
            ?.toLowerCase()
            ?.includes(firstName.toLowerCase() || null) ||
          item?.user?.surname
            ?.toLowerCase()
            ?.includes(lastName.toLowerCase() || null) ||
          item?.title?.toLowerCase()?.includes(title.toLowerCase() || null) ||
          // item?.pages?.toLowerCase()?.includes(pages.toLowerCase() || null) ||
          item?.type?.toLowerCase()?.includes(type.toLowerCase() || null) ||
          item?.status?.toLowerCase()?.includes(status.toLowerCase() || null) ||
          (!isNaN(pageNumber) && (isMinPageValid || isMaxPageValid)) ||
          isBetween ||
          (!isNaN(priceNumber) && (isMinPriceValid || isMaxPriceValid)) ||
          isPriceBetween ||
          // Number(item?.pages || 0) <= Number(minPage) ||
          // (maxPage && Number(item?.pages || 0) <= Number(maxPage)) ||
          (item?.keywords &&
            !!parseStringArray(item?.keywords).filter((row) =>
              row?.toLowerCase()?.includes(keywords?.toLowerCase() || null)
            ).length)
        );
      });

      console.log(temp);
    }
    if (all?.trim()) {
      let search = all?.toLowerCase();
      temp = temp?.filter(
        (elm) =>
          elm?.user?.forename?.toLowerCase()?.includes(search.toLowerCase()) ||
          elm?.user?.surname?.toLowerCase()?.includes(search.toLowerCase()) ||
          elm?.title?.toLowerCase()?.includes(search.toLowerCase()) ||
          // elm?.pages?.toLowerCase()?.includes(search.toLowerCase()) ||
          elm?.type?.toLowerCase()?.includes(search.toLowerCase()) ||
          elm?.status?.toLowerCase()?.includes(search.toLowerCase()) ||
          (elm?.keywords &&
            parseStringArray(elm?.keywords).filter((row) =>
              row?.toLowerCase()?.includes(search?.toLowerCase())
            )?.length) ||
          (elm?.location &&
            elm?.location.toLowerCase().includes(search?.toLowerCase()))
      );
    }
    setFilteredPosts(temp);
    //
    // setFilteredUsers(temp)
  }, [inputValue]);
  ///
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prev) => {
      return { ...prev, [name]: value };
    });
    // const temp = posts.filter(
    //   (post) =>
    //     post?.forename?.toLowerCase()?.includes(value.toLowerCase()) ||
    //     post?.surname?.toLowerCase()?.includes(value.toLowerCase()) ||
    //     post?.title?.toLowerCase()?.includes(value.toLowerCase()) ||
    //     post?.pages?.toLowerCase()?.includes(value.toLowerCase()) ||
    //     post?.type?.toLowerCase()?.includes(value.toLowerCase()) ||
    //     post?.status?.toLowerCase()?.includes(value.toLowerCase()) ||
    //     post?.location?.toLowerCase()?.includes(value.toLowerCase()) //phle se tha location key
    // );
    // console.log({ filtered });
    // setFilteredPosts([...temp]);
    //

    // console.log("input value", inputValue);
    // //
    // const filterMarkerss = temp
    //   ?.map((item) =>
    //     users?.filter((row) => row?.user_id === item?.user_id).flat()
    //   )
    //   .flat();
    // console.log({ filterMarkerss });
    // filterMarkers(filterMarkerss, userAdrress);

    // fetchData(filtered);
  };

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
    const url = `/post/${marker.id}_${removeWhitespaces(
      removeQuestionAndForwardSlash(marker.title)
    )}`;
    navigate(url, { replace: true });
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { mutate: likePost, isLoading: isLikePostLoading } = useMutation(
    async (payload) => {
      // if (payload.newIsLiked)
      return API.post("post-likes", payload);
    },
    {
      onSuccess: async (data) => {
        if (data) {
          fetchInitialsPost(currentPage,postsPerPage);

          // await queryClient.invalidateQueries(["posts-id", data?.postId]);
          // queryClient.invalidateQueries(["posts"]);
          // queryClient.invalidateQueries(["post-likes"]);
        }
      },
    }
  );

  const { mutate: disLikePost } = useMutation(
    async (payload) => {
      return API.delete(`post-likes/${payload?.post_id}`, {
        data: payload,
      });
    },
    {
      onSuccess: async (data) => {
        if (data) {
          fetchInitialsPost(currentPage,postsPerPage);

          // await queryClient.invalidateQueries(["posts-id", data?.postId]);
          // queryClient.invalidateQueries(["posts"]);
          // queryClient.invalidateQueries(["post-likes"]);
        }
      },
    }
  );

  // const [isLiked, setIsLiked] = useState(false);
  // const handleLike = (post) => {
  //   const newIsLiked = !isLiked;
  //   setIsLiked(newIsLiked);
  //   const payloadData = {
  //     user_who_triggered_notify_id: auth?.userId,
  //     post_id: post?.id,
  //     likes: newIsLiked ? 1 : 0,
  //     user_id: post?.user_id,
  //     opened: 0,
  //   };
  //   if (newIsLiked) {
  //     likePost(payloadData);
  //   } else if (newIsLiked === false) {
  //     disLikePost(payloadData);
  //   }
  // };

  const renderMarker = () => {
    // let tempArray =  filteredPosts.filter((marker, index) => marker?.latitude  marker?.longitude );
    return filteredPosts.map((marker, index) => {
      if (!marker?.latitude || !marker?.longitude) {
      } else {
        return (
          <Marker
            key={index + ""}
            position={{
              lat: Number(marker.latitude),
              lng: Number(marker.longitude),
            }}
            icon={getMarkerIcon(marker)}
            title={marker?.title}
            className={"hello"}
            onClick={(event) =>
              handleMarkerClick(event, {
                ...marker?.address,
                title: marker?.title,
              })
            }
          ></Marker>
        );
      }
    });
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="box-shadow filter-option">
        <form className="search-form position-relative" role="search">
          <input
            name="all"
            value={inputValue.all}
            type="text"
            className="form-control"
            placeholder="eg. 'Dubai'"
            aria-label="Search"
            onChange={handleFilterChange}
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
            <select className="form-select" style={{ border: 'none' }}>
              <option selected="" disabled="">
                Location
              </option>
              <option>Birmingham</option>
              <option>Birmingham</option>
              <option>Birmingham</option>
              <option>Birmingham</option>
            </select>

            <select className="form-select" style={{ border: 'none' }}>
              <option selected="" disabled="">
                5 Miles
              </option>
              <option>5 miles</option>
              <option>10 miles</option>
              <option>15 miles</option>
            </select>

            <select className="form-select" style={{ border: 'none' }}>
              <option selected="" disabled="">
                2 Pages
              </option>
              <option>2 Pages</option>
              <option>3 Pages</option>
              <option>5 Pages</option>
              <option>6 Pages</option>
            </select>

            <select className="form-select" style={{ border: 'none' }}>
              <option selected="" disabled="">
                Price
              </option>
              <option>$ 100</option>
              <option>$ 200</option>
              <option>$ 300</option>
              <option>$ 400</option>
            </select>

            <select className="form-select" style={{ border: 'none' }}>
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

        {/* {console.log({ markers, filteredPosts, filterMarkers })} */}
      </div>
      <div className="box-shadow p-0">
        <Tabs
          selectedIndex={tabIndex}
          onSelect={handleTabClick}
          className="search common-tab"
        >
          <TabList className="nav nav-tabs">
            <Tab className="nav-link" selectedClassName="active">
              Map View
            </Tab>
            <Tab className="nav-link" selectedClassName="active">
              List View
            </Tab>
          </TabList>
          {tabIndex === 0 && (
            <>
              {isLoaded && (
                <div className="map-view pt-5">
                  <GoogleMap
                    mapContainerStyle={{
                      width: "100%",
                      height: "600px",
                    }}
                    center={center}
                    zoom={3}
                    // onLoad={(map) => setIsMapLoaded(map)}
                    onLoad={(map) => setTimeout(() => setIsMapLoaded(map))}
                  >
                    {isMapLoaded && renderMarker()}
                  </GoogleMap>
                </div>
              )}

              {!isLoaded && <div>Loading Google Maps API...</div>}
            </>
          )}
          <TabPanel>
            {/* <>
              {isLoaded && (
                <div className="map-view pt-5">
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "600px" }}
                    center={center}
                    zoom={3}
                  >
                    {renderMarker()}
                  </GoogleMap>
                </div>
              )}

              {!isLoaded && <div>Loading Google Maps API...</div>}
            </> */}
          </TabPanel>
          <TabPanel className="tab-content">
            <div
              className="tab-pane fade show active"
              id="listview"
              role="tabpanel"
              aria-labelledby="listview-tab"
            >
              <ul>
                {filteredPosts.reverse().map((post) => {
                  // const postId = post?.id ? post?.id.toString() : "";
                  // const userTitle = post?.title ? post?.title : "";
                  // const titleLink = postId.concat("_", userTitle);
                  // return (
                  //   <li key={post.id}>
                  //     <div className="user-post search-user list-view-post">
                  //       <div className="post-profile">
                  //         <figure>
                  //           <Link
                  //             to={`/post/${removeWhitespaces(
                  //               removeQuestionAndForwardSlash(titleLink)
                  //             )}`}
                  //             state={{ id: post?.id }}
                  //           >
                  //             <img
                  //               className="mb-2"
                  //               src={
                  //                 post.images
                  //                   ? parseStringArray(post.images)?.[0] ??
                  //                     Placeholder
                  //                   : Placeholder
                  //               }
                  //               alt="isdage"
                  //               width=""
                  //               height=""
                  //             />
                  //           </Link>
                  //         </figure>
                  //         <figcaption>
                  //           <div className="d-flex justify-content-between mb-2">
                  //             <h5>
                  //               <Link
                  //                 to={`/post/${post.id}_${removeWhitespaces(
                  //                   removeQuestionAndForwardSlash(post.title)
                  //                 )}`}
                  //               >
                  //                 {post.title}
                  //               </Link>
                  //             </h5>
                  //             <p className="mb-1 btn btn-common btn-sm">
                  //               {post?.price}
                  //             </p>
                  //           </div>

                  //           {post?.description?.length > MAX_LENGTH ? (
                  //             <p
                  //               className="mb-2 post-short-des"
                  //               dangerouslySetInnerHTML={{
                  //                 __html: `${post?.description.substring(
                  //                   0,
                  //                   MAX_LENGTH
                  //                 )}...`,
                  //               }}
                  //             />
                  //           ) : (
                  //             <p>
                  //               {post?.description
                  //                 ? parse(post?.description)
                  //                 : ""}
                  //             </p>
                  //           )}
                  //           <Link
                  //             to={`/post/${removeWhitespaces(
                  //               removeQuestionAndForwardSlash(titleLink)
                  //             )}`}
                  //             state={{ id: post?.id }}
                  //           >
                  //             Read this article
                  //           </Link>

                  //           <div className="search-post-type">
                  //             <div className="d-flex mb-1">
                  //               <p
                  //                 className="mb-0 me-4 cursor-pointer "
                  //                 style={{ cursor: "pointer" }}
                  //                 onClick={() => handleLike(post)}
                  //               >
                  //                 <i className="fa fa-thumbs-up"></i>{" "}
                  //                 {post?.total_likes}
                  //               </p>
                  //               <p className="mb-0 me-4">
                  //                 <i className="fa fa-message"></i>{" "}
                  //                 {post?.total_comments}
                  //               </p>
                  //             </div>
                  //             <p className="mb-1">
                  //               <i className="fa fa-calendar"></i>{" "}
                  //               {moment(post?.created).format("DD-MMMM-YYYY")}
                  //             </p>
                  //           </div>
                  //         </figcaption>
                  //       </div>
                  //     </div>
                  //   </li>
                  // );
                  return (
                    <PostSearchCard
                      fetchInitialsPost={fetchInitialsPost}
                      post={post}
                      // postId={postId}
                      key={post?.id + ""}
                      postLikedData={postLikedData}
                    />
                  );
                })}
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
                  disabled={!postPageNumber?.next}
                  className={`pagination_btn ${
                    !postPageNumber?.next ? "disabled" : ""
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
          </TabPanel>
        </Tabs>
      </div>
      {filteredPosts && filteredPosts.length === 0 && (
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
      {/* Filter modal */}
      <FilterPostModal
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
      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <button type="button" className="btn btn-common">
            Reset
          </button>
          <h5 className="modal-title m-auto">Filter your result</h5>
        </Modal.Header>
        <Modal.Body>
        <form className="row g-3">
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input type="text" className="form-control" placeholder="First Name"/>
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input type="text" className="form-control" placeholder="Last Name"/>
          </div>
          <div className="col-12">
            <label className="form-label">Post Title</label>
            <input type="text" className="form-control" placeholder="Post Title"/>
          </div>
          <div className="col-md-6">
            <label className="form-label">Pages</label>
            <input type="text" className="form-control" placeholder="Pages"/>
          </div>
          <div className="col-md-6">
            <label className="form-label">Type</label>
            <input type="text" className="form-control" placeholder="Type"/>
          </div>
          <div className="col-md-6">
            <label className="form-label">Keywords</label>
            <input type="text" className="form-control" placeholder="Keywords"/>
          </div>
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <input type="text" className="form-control" placeholder="Status"/>
          </div>
        </form>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-common">
            Submit
          </button>
        </Modal.Footer>
      </Modal> */}
      {/* Filter modal */}
    </>
  );
};

export default Posts;
const MAX_LENGTH = 200;
