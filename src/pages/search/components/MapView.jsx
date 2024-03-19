// import { GoogleMap } from "@react-google-maps/api";
// import React, { useEffect, useRef } from "react";
// const center = {
//     lat: 0,
//     lng: 0,
//   }
// function MapView({ renderMarker }) {
//   const mapRef = useRef();

//   useEffect(() => {
//     if (!mapRef.current) return;

//     const map = mapRef.current.leafletElement;
//     const mapZoom = 3;

//     let intervalInstance;

//     if (!center && marker) {
//       map.setView(marker, mapZoom);
//       intervalInstance = setInterval(() => map.invalidateSize(), 100);
//     } else if (!center) {
//       map.setView([0.0, 0.0], mapZoom);
//     }
//     map.setZoom(mapZoom);

//     return () => clearInterval(intervalInstance);
//   }, []);
//   return (
//     <div className="map-view pt-5">
//       <GoogleMap
//         mapContainerStyle={{
//           width: "100%",
//           height: "600px",
//         }}
//         center={{
//           lat: 0,
//           lng: 0,
//         }}
//         zoom={3}
//       >
//         {renderMarker && renderMarker()}
//       </GoogleMap>
//     </div>
//   );
// }

// export default MapView;

import React from "react";

function MapView() {
  return <div>MapView</div>;
}

export default MapView;
