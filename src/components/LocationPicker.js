import React, { useState, useEffect, useRef, useContext } from "react";
import MapView, { MapViewAnimated, Marker } from "react-native-maps";
import { View, Dimensions, StyleSheet, ToastAndroid, Platform, Text, TouchableOpacity } from "react-native";
import { Button, Card, TextInput, Title, Paragraph, Divider, Subheading, Avatar } from 'react-native-paper';
import { NAV_BAR_HEIGHT } from "../constants/Constants";

function LocationPicker(props) {
	// const { itemId, otherParam } = props.route.params;
	const width = Dimensions.get("window").width;
	const height = Dimensions.get("window").height;

	const styles = StyleSheet.create({
		mapStyle: {
			width: width,
			height: height - NAV_BAR_HEIGHT + 31,
		},
	});
	const mapRef = useRef(null);
	const sheetRef = useRef(null);

	const [marker, setMarker] = useState(null)

	const onPress = (e) => {
		setMarker(<Marker coordinate={e.nativeEvent.coordinate}></Marker>)
	};

	function navigateBack() {
		props.navigation.navigate('MapScreen', {
			inputCoordinates:
				marker.props.coordinate.latitude.toFixed(5)
				+ ',' +
				marker.props.coordinate.longitude.toFixed(5)
		})
	}


	return (
		<View>
			<Button
				mode='contained'
				onPress={() => navigateBack()}
				disabled={marker == null}>
				ok
			</Button>
			<MapView
				style={styles.mapStyle}
				mapPadding={{ top: 100, right: 10, bottom: 0, left: 0 }}
				minZoomLevel={10.5}
				maxZoomLevel={25}
				ref={mapRef}
				onMapReady={() =>
					mapRef.current.setMapBoundaries(
						{ latitude: 1.50027, longitude: 104.151959 },
						{ latitude: 1.15027, longitude: 103.551959 }
					)
				}
				showsUserLocation={true}
				followsUserLocation={true}
				// onUserLocationChange={locationChangedResult => followUser && setUserLocation(locationChangedResult.nativeEvent.coordinate)}
				loadingEnabled={true}
				showsMyLocationButton={true}
				zoomEnabled={true}
				moveOnMarkerPress={false}
				initialRegion={props.route.params.currRegion}
				onPress={onPress}
			// region={region}
			// onMoveShouldSetResponder={onDrag}
			>
				{marker}
			</MapView>
		</View>
	);
}

export default LocationPicker