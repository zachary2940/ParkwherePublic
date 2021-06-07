import React, { useState, useEffect } from "react";
import * as Location from 'expo-location';
import { Linking } from "react-native";


export function parseLat(marker) {
  return parseFloat(marker.Location.split(",")[0])
}

export function parseLong(marker) {
  return parseFloat(marker.Location.split(",")[1])
}

/**
 * carpark logic
 */

export function setMarkerColor(marker) {
  if (marker.AvailableLots == 0) {
    return "red"
  }
  else if (marker.AvailableLots <= 30) {
    return "orange"
  }
  else if (marker.AvailableLots == 'Data Not Available') {
    return "blue"
  }
  else if('Free' in marker){
    if (marker.Free == null) {
      return "red"
    }
  }
  else {
    return "green"
  }
}


/**
  * Location
  */


export function useLocation(isFocused) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  let mounted = true
  useEffect(() => {
    (async () => {
      if (mounted) {
        try {
          let { status } = await Location.requestPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
          }

          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        } catch (error) {
          setErrorMsg(error)
        }
      }
    })();
    return () => mounted = false
  }, [isFocused]);
  return [location, errorMsg]
}



// export async function getLocation() {
//   try {
//     let { status } = await Location.requestPermissionsAsync();
//     if (status !== 'granted') {
//       setErrorMsg('Permission to access location was denied');
//     }

//     let location = await Location.getCurrentPositionAsync({});
//     return location, null;
//   } catch (error) {
//     return null, error
//   }
// }
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}
function deg2rad(deg) {
  return deg * (Math.PI / 180)
}


export const openMaps = (lat, lng) => {
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  const latLng = `${lat},${lng}`;
  const label = 'Custom Label';
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`
  });
  Linking.openURL(url);
}
/**
  * Geocoding
  */




export async function geocode(address) {
  try {
    let searchLocation = await Location.geocodeAsync(address); //returns array of location objects
    return searchLocation //promise
  } catch (error) {
    console.error(error)
  }
}
