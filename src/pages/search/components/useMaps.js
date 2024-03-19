import { useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { getAddress, getInitials } from "../../../helpers";
import { searchService } from "../../../services/SearchService";

function useMaps({ type, page, limit }) {
  const [markers, setMarkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [userPageNumber, setUserPageNumber] = useState({});
  const [postPageNumber, setPostPageNumber] = useState({});
  const [userAdrress, setUserAddress] = useState([]);
  const [isDataSet, setIsDataSet] = useState(false);
  const [usersObject, setUsersObject] = useState({});
  const [posts, setPosts] = useState([]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyD3OC1Q1D4Yg1Y37z2l3VXGGENkhWhEsWQ",
    libraries: ["places"],
  });

  useEffect(() => {
    if (type === "post") {
      fetchInitialsPost(page, limit);
    } else {
      fetchInitials(page, limit);
    }
  }, [page, limit]);

  const fetchInitialsPost = async (page, limit) => {
    console.log(page,limit);
    const response1 = searchService.GetUserAddress();
    const response2 = searchService.GetUsers(page, limit);
    const getPosts = searchService.GetPosts(page, limit);
    const [result1, result2, postsData] = await Promise.all([
      response1,
      response2,
      getPosts,
    ]);

    setUserAddress(result1);

    let usersAddress = {};
    result1?.map((item) => {
      const {
        user_id,
        longitude,
        latitude,
        forename,
        surname,
        profile_image,
        address_line_1,
        id,
      } = item;

      usersAddress = {
        ...usersAddress,
        [id]: {
          id: id,
          user_id: id,
          position: {
            lat: Number(latitude),
            lng: Number(longitude),
            s: "SS",
          },
          title: `${forename ?? ""} ${surname ?? ""}`,
          location: address_line_1,
          profile_image: profile_image,
        },
      };
    });

    // const uniqueArr = response2?.filter(
    //   (obj, index, self) =>
    //     index === self.findIndex((t) => t.user_id === obj.user_id)
    // );

    let tempUserObj = {};
    result2?.results?.map((item) => {
      tempUserObj = {
        ...tempUserObj,
        [item?.id]: item,
      };
    });
    let temp = postsData?.results?.map((item) => ({
      ...item,
      user: tempUserObj?.[item?.user_id],
      address: {
        ...usersAddress?.[item?.user_id],
        id: item?.id,
      },
    }));
    setPosts(temp);
    setPostPageNumber(postsData);

    let mergedArr = result2?.results?.map((obj1) => {
      const obj2 = postsData?.results?.find((obj2) => obj2.user_id === obj1.id);
      return { ...obj1, ...obj2 };
    });
    // mergedArr = mergedArr.filter(Boolean);

    // const uniqueArr = response2?.filter(
    //   (obj, index, self) =>
    //     index === self.findIndex((t) => t.user_id === obj.user_id)
    // );

    setUsersObject(tempUserObj);
    setUsers(mergedArr);
    // fetchData(mergedArr, result1);
  };

  const fetchInitials = async () => {
    try {
      const response1 = searchService.GetUserAddress();
      const response2 = searchService.GetUsers(page, limit);

      const [result1, result2] = await Promise.all([response1, response2]);
      let usersAddress = {};
      result1?.map((item) => {
        const {
          user_id,
          longitude,
          latitude,
          forename,
          surname,
          profile_image,
          address_line_1,
          id,
        } = item;

        usersAddress = {
          ...usersAddress,
          [id]: {
            id: id,
            position: {
              lat: Number(latitude),
              lng: Number(longitude),
              s: "SS",
            },
            title: `${forename ?? ""} ${surname ?? ""}`,
            location: address_line_1,
            profile_image: profile_image,
          },
        };
      });
      const usersData = result2?.results?.map((item) => ({
        ...item,
        address: usersAddress[item?.id],
      }));
      setUsers(usersData);
      setUserPageNumber(result2);
      setUserAddress(result1);

      //   setFilteredUsers(result2);

      // fetchData(result2, result1);

      setIsDataSet(true);
    } catch (error) {
      console.error(error);
    }
  };

  // const fetchData = async (users, addresses) => {
  //   setMarkers([]);
  //   const newMarkers = await Promise.all(
  //     users.map(async (user) => {
  //       const userAddresses = addresses.filter((x) =>
  //         type === "post" ? x.user_id === user.user_id : x.user_id === user.id
  //       );
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
  //               title: `${user.forename ?? ""} ${user.surname ?? ""}`,
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

  const getMarkerIcon = (data) => {
    const icon = document.createElement("div");
    const initials = getInitials(data?.title);
    const imgSrc = data?.profile_image;
    const imgTag = `<img loading="lazy" src="https://img.freepik.com/free-photo/happy-excited-tourist-shooting-landmarks_1262-18852.jpg" data-src="https://img.freepik.com/free-photo/happy-excited-tourist-shooting-landmarks_1262-18852.jpg" alt="${data?.title}" className="img-fluid" width="70" height="70" />`;

    icon.innerHTML = `<div className="post-profile" style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center;"><figure style=" margin: 0px; display: flex; align-items: center;">${
      imgSrc
        ? `<picture><source srcset="https://img.freepik.com/free-photo/happy-excited-tourist-shooting-landmarks_1262-18852.jpg" type="image/webp"><source srcset="https://img.freepik.com/free-photo/happy-excited-tourist-shooting-landmarks_1262-18852.jpg" type="image/png">${imgTag}</picture>`
        : `<span style="font-size:100%;">${initials}</span>`
    }</figure></div>`;

    const svgString = encodeURIComponent(
      // `<svg fill="#f00" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${icon.innerHTML}</div></foreignObject></svg>`
      `<svg style="width:40px; height:40px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><foreignObject width="100%" height="100%" style="background-color:#00c8c8; color:#fff; font-family: Roboto; border-radius:50%; font-size:50px; border: 3px solid #fff;"><div style="width:100%; height:100%;" xmlns="http://www.w3.org/1999/xhtml">${icon.innerHTML}</div></foreignObject></svg>`
    );

    const markerIcon = new window.google.maps.MarkerImage(
      `data:image/svg+xml;charset=UTF-8,${svgString}`,
      null,
      null,
      null,
      new window.google.maps.Size(40, 40)
    );

    return markerIcon;
  };
  return {
    isLoaded,
    getMarkerIcon,
    markers,
    // filterMarkers: fetchData,
    users,
    userAdrress,
    usersObject,
    posts,
    fetchInitials,
    fetchInitialsPost,
    userPageNumber,
    postPageNumber,
  };
}

export default useMaps;
