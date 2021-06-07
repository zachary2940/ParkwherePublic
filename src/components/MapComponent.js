import React, { useCallback, useEffect, useRef,useState } from "react";
import { InteractionManager, StyleSheet } from "react-native";
import { parseLat, parseLong, setMarkerColor } from "../utils/MapUtils";
import MapView, { Marker } from "react-native-maps";
import { NAV_BAR_HEIGHT } from "../constants/Constants";
import { useFocusEffect } from "@react-navigation/core";

function MapComponent(props) {


	const styles = StyleSheet.create({
		mapStyle: {
			width: props.width,
			height: props.height - NAV_BAR_HEIGHT + 31,
		},
	});
	function breakLines(s) {
		return s.replace(',', '').replace('; ', '\n')
	}
	const markerKeyCounter = useRef(0);
	const [pressedMarkerID, setPressedMarkerID] = useState(null)
	
	// useFocusEffect(
	// 	useCallback(() => {
	// 		const task = InteractionManager.runAfterInteractions(() => {
	// 			// Expensive task
	// 			// markerKeyCounter.current += 1
	// 			// console.log('redraw')
	// 		  });
		  
	// 		  return () => task.cancel();
	// 	}, [props.carparks])
	// );

	return (
		<MapView
			style={styles.mapStyle}
			mapPadding={{ top: 100, right: 10, bottom: 0, left: 0 }}
			minZoomLevel={10.5}
			maxZoomLevel={25}
			ref={props.mapRef}
			onMapReady={() =>
				props.mapRef.current.setMapBoundaries(
					{ latitude: 1.50027, longitude: 104.151959 },
					{ latitude: 1.15027, longitude: 103.551959 }
				)
			}
			onRegionChange={props.onRegionChange}
			onRegionChangeComplete={props.onRegionChangeComplete}
			showsUserLocation={true}
			followsUserLocation={true}
			// onUserLocationChange={locationChangedResult => followUser && setUserLocation(locationChangedResult.nativeEvent.coordinate)}
			loadingEnabled={true}
			showsMyLocationButton={true}
			zoomEnabled={true}
			moveOnMarkerPress={false}
			initialRegion={props.initialRegion}
		// region={region}
		// onMoveShouldSetResponder={onDrag}
		>
			{props.searchLocation &&
				<Marker
					coordinate={{
						latitude: props.searchLocation[0] + 0.000045, //hack change icon image to be larger
						longitude: props.searchLocation[1],
					}}
					pinColor={"purple"}
				/>
			}
			{props.showMarker && props.carparks.map((marker) => (
				<Marker
					style={{ zIndex: 1 }}
					key={`${marker.CarparkID}-${markerKeyCounter.current}-${marker.CarparkID==pressedMarkerID?'active':'inactive'}`}
					coordinate={{
						latitude: parseLat(marker),
						longitude: parseLong(marker),
					}}
					pinColor={(() => {
						if (marker.CarparkID==pressedMarkerID) {
							return "teal"
						}
						if (marker.AvailableLots == 0) {
							return "red"
						}
						else if (marker.AvailableLots <= 30) {
							return "orange"
						}
						else if (marker.AvailableLots > 30) {
							return "green"
						}
						else if('Free' in marker){
							if (marker.Free == null) {
							  return "red"
							}
							return "blue"
						  }
						else {
							return "blue"
						}
					})()}
					onPress={() => {
						// function to change modal information
						marker["WeekDays_Rate_1"] = breakLines(marker["WeekDays_Rate_1"])
						marker["WeekDays_Rate_2"] = breakLines(marker["WeekDays_Rate_2"])
						marker["Saturday_Rate"] = breakLines(marker["Saturday_Rate"])
						marker["Sunday_PublicHoliday_Rate"] = breakLines(marker["Sunday_PublicHoliday_Rate"])
						setPressedMarkerID(marker.CarparkID)
						props.onClickMarker(marker);
					}}
				/>
			))}
		</MapView>
	);
};
export default MapComponent = React.memo(MapComponent);