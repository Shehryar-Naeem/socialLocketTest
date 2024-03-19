import axios from "axios";
import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete, {
  geocodeByLatLng,
} from "react-google-places-autocomplete";
import { geocodeByPlaceId } from "react-google-places-autocomplete";

function AddressAutoComplete({ onChange, latitude, longitude }) {
  const [getAddress, setGetAddress] = useState(null);
  const [placeValue, setPlaceValue] = useState(null);

  useEffect(() => {
    if (
      latitude &&
      longitude &&
      !isNaN(parseFloat(latitude)) &&
      !isNaN(parseFloat(longitude))
    ) {
      getCompleteAddressByLatLong(
        parseFloat(latitude),
        parseFloat(longitude)
      ).then((res) => {
        setPlaceValue(res?.formattedAddress);
        setGetAddress(res?.temp);
      });
    } else {
      setPlaceValue(null);
    }
  }, [latitude, longitude]);
  return (
    <GooglePlacesAutocomplete
      debounce={500}
      apiKey={"AIzaSyD3OC1Q1D4Yg1Y37z2l3VXGGENkhWhEsWQ"}
      selectProps={{
        placeholder: "Search address",
        className: "mb-3",
        onChange: (value) => {
          geocodeByPlaceId(value?.value?.place_id)?.then((res) => {
            if (!res?.[0]) {
              return;
            }
            let lat = res?.[0]?.geometry?.location?.lat();
            let lng = res?.[0]?.geometry?.location?.lng();
            const details = res[0];
            let formattedAddress = details?.formatted_address;
            let unit =
              details?.address_components?.find((x) =>
                x?.types?.includes("street_number")
              )?.long_name ||
              details?.address_components?.find((x) =>
                x?.types?.includes("plus_code")
              )?.long_name ||
              details?.address_components?.find((x) =>
                x?.types?.includes("subpremise")
              )?.long_name ||
              "";
            let zip =
              details?.address_components?.find((x) =>
                x?.types?.includes("postal_code")
              )?.long_name || "";
            let country =
              details?.address_components?.find((x) =>
                x?.types?.includes("country")
              )?.long_name || "";
            let state =
              details?.address_components?.find((x) =>
                x?.types?.includes("administrative_area_level_1")
              )?.long_name || "";
            let city =
              details?.address_components?.find((x) =>
                x?.types?.includes("locality")
              )?.long_name ||
              details?.address_components?.find((x) =>
                x?.types?.includes("administrative_area_level_3")
              )?.long_name ||
              "";
            let stateInShort =
              details?.address_components?.find((x) =>
                x?.types?.includes("administrative_area_level_1")
              )?.short_name || "";
            let countryInShort =
              details?.address_components?.find((x) =>
                x?.types?.includes("country")
              )?.short_name || "";
            // let countryCode =
            //   details?.international_phone_number?.split(' ') ?? '';

            // console.log(
            //   'countryCode',
            //   details?.international_phone_number?.split(' '),
            //   countryCode
            //   // details
            // );
            let completeAddress = formattedAddress;
            formattedAddress = formattedAddress
              .replace(country, "")
              .replace(city, "")
              .replace(state, "")
              .replace(zip, "")
              .trim()
              .replace(/^[,\s]+|[\s,]+$/, "");

            let data = {
              zip,
              stateInShort,
              countryInShort,
              country,
              state,
              city,
              unit,
              formattedAddress,
              longitude: lng,
              latitude: lat,
              completeAddress,
            };

            onChange && onChange(data);
          });
        },
        autoFocus: false,
        inputValue: placeValue ?? "",
        onInputChange: (value) => {
          setPlaceValue(value);
        },
      }}
    />
  );
}

export default AddressAutoComplete;

export const GOOGLE_PACES_API_BASE_URL =
  "https://maps.googleapis.com/maps/api/place";

async function getCompleteAddressByLatLong(latitude, longitude) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${"AIzaSyD3OC1Q1D4Yg1Y37z2l3VXGGENkhWhEsWQ"}`;
  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === "OK") {
      if (data.results.length > 0) {
        const addressComponents = data.results[0].address_components;

        let address = {
          zip: null,
          stateInShort: null,
          countryInShort: null,
          country: null,
          state: null,
          city: null,
          unit: null,
          formattedAddress: null,
          longitude: longitude,
          latitude: latitude,
          completeAddress: null,
        };

        for (let i = 0; i < addressComponents.length; i++) {
          const component = addressComponents[i];
          if (component.types.includes("postal_code")) {
            address.zip = component.short_name;
          } else if (component.types.includes("administrative_area_level_1")) {
            address.stateInShort = component.short_name;
            address.state = component.long_name;
          } else if (component.types.includes("country")) {
            address.countryInShort = component.short_name;
            address.country = component.long_name;
          } else if (component.types.includes("locality")) {
            address.city = component.long_name;
          } else if (component.types.includes("sublocality_level_1")) {
            address.unit = component.long_name;
          }
        }

        address.formattedAddress = data.results[0].formatted_address;
        address.completeAddress = address.formattedAddress;
        address.temp = data.results[0];

        return address;
      }
    }
    return null;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
