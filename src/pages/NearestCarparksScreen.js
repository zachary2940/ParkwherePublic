import React, { useCallback, useEffect, useState } from "react";
import CarparkList from "../components/CarparkList";
import { View } from "react-native";
import styles from "../styles/styles"
import { useSelector } from 'react-redux'
import { Text } from "react-native";
import { useLocation, getDistanceFromLatLonInKm, parseLat, parseLong } from '../utils/MapUtils'
import { useTheme, Title } from 'react-native-paper'
import { API_REFRESH_TIME } from "../constants/Constants";
import * as Location from 'expo-location';
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

// functional components do not have state
function NearestCarparksScreen(props) {
	const carparkCombinedReducerObj = useSelector(state => state.carparkCombinedReducerObj)
	const { loadingCombined, errorCombined, combinedCarparkData } = carparkCombinedReducerObj
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [nearestCarparks, setNearestCarparks] = useState([]);
	const [nearestCarparksDone, setNearestCarparksDone] = useState(false);
	const { colors } = useTheme();

	async function getLocation() {
		try {
			let { status } = await Location.requestPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
			}
			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
		} catch (error) {
			setErrorMsg(error)
			console.log(error)
		}
	}


	useFocusEffect(
		useCallback(() => {
			getLocation()
			let intervalId = setInterval(() => {
				getLocation()
			}, API_REFRESH_TIME / 2);
			return () => {
				clearInterval(intervalId)
			};
		}, [])
	);

	useEffect(() => {
		if (location != null) {
			let nearestCarparksSorted = []
			for (i = 0; i < combinedCarparkData.length; i++) {
				let dist = getDistanceFromLatLonInKm(location.coords.latitude, location.coords.longitude, parseLat(combinedCarparkData[i]), parseLong(combinedCarparkData[i]))
				if (dist < 0.8) {
					combinedCarparkData[i].Distance = dist.toFixed(2)
					nearestCarparksSorted.push(combinedCarparkData[i])
				}
			}
			nearestCarparksSorted = nearestCarparksSorted.sort((a, b) => parseFloat(a.Distance) - parseFloat(b.Distance));
			setNearestCarparks([...nearestCarparksSorted])
		}
	}, [location])

	return (
		<View style={[styles.container, { backgroundColor: colors.surface }]}>
			<Title>Nearest Carparks</Title>
			{loadingCombined ? <Text>Loading...</Text> :
				errorCombined ? <Text>{errorCombined.message}</Text> :
					nearestCarparks.length > 0 ? <CarparkList carparks={nearestCarparks} /> : <Text>No Nearby Carparks</Text>}
		</View>

	);
}

export default NearestCarparksScreen

