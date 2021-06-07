import React, { useState, useRef, useEffect, useContext} from "react";
import { View, Dimensions, KeyboardAvoidingView, StyleSheet, Alert, ToastAndroid, Platform, Text, TouchableOpacity } from "react-native";
import { geocode, useLocation, } from "../utils/MapUtils";
import MapComponent from "../components/MapComponent";
import { useSelector } from 'react-redux'
import BottomSheet from 'reanimated-bottom-sheet';
import CarparkBottomSheetContent from "../components/CarparkBottomSheetContent";
import SearchBarSuggest from "../components/SearchBarSuggest"
import Fuse from 'fuse.js';
import { MAP_BOUNDARIES } from '../constants/Constants'
import { Carpark } from '../models/Carpark'
import { createStackNavigator } from '@react-navigation/stack';
import LocationPicker from '../components/LocationPicker'
import { Button, Card, Subheading, Title } from "react-native-paper";

function MapScreen(props) {
	const width = Dimensions.get("window").width;
	const height = Dimensions.get("window").height;
	// redux for carparks
	const carparkCombinedReducerObj = useSelector(state => state.carparkCombinedReducerObj)
	const { loadingCombined, errorCombined, combinedCarparkData } = carparkCombinedReducerObj

	// custom hooks for location
	const [location, locationErr] = useLocation();

	// for drawer
	const [carpark, setCarparkInfo] = useState(false);

	// need to not show anything before location load is done
	const [initialRegion, setRegion] = useState({
		latitude: 1.3521,
		longitude: 103.8198,
		latitudeDelta: 0.2,
		longitudeDelta: 0.2,
	});
	const [locationLoading, setLocationLoading] = useState(true);

	// for marker state (shown or not)
	const [showMarker, setShowMarker] = useState(false);

	const [fuse, setFuse] = useState(null)

	useEffect(() => {
		if (combinedCarparkData.length > 0) {
			const options = {
				includeScore: true,
				keys: ['CarparkName']
			}
			const fuse = new Fuse(combinedCarparkData, options)
			setFuse(fuse)
		}
	}
		, [combinedCarparkData])

	// for search
	const [searchQuery, setSearchQuery] = useState("");
	const [suggestions, setSuggestions] = useState([]);

	const onChangeSearch = (query) => {
		setSearchQuery(query)
		const suggestionsArr = fuse.search(query, { limit: 3 })
		setSuggestions(suggestionsArr)
	};

	// store previous searches
	const [searchSet, setSearchSet] = useState(new Set());

	const mapRef = useRef(null);

	const [searchLocation, setSearchLocation] = useState(null);

	// normal on submit
	async function onSubmit(searchQuery) {
		let location = await findMoveToQuery(searchQuery + ' singapore')
		if (location != null) {
			//artificial carpark
			let carparkQuery: Partial<Carpark> = {
				CarparkID: searchQuery,
				Location: location,
			}
			manageRecentSearches(carparkQuery)
		}
	}

	// on submit suggested carpark
	async function onSubmitSuggestion(searchQuery, carparkQuery) {
		await findMoveToQuery(searchQuery)
		manageRecentSearches(carparkQuery)
	}

	async function findMoveToQuery(searchQuery) {
		let searchLocationList = await geocode(searchQuery);

		if (searchLocationList.length == 0) {
			// Alert.alert('No Results Found');
			ToastAndroid.show("No Results Found. Try entering a postal code or include location e.g. Ion Orchard vs Ion", ToastAndroid.SHORT);
		}
		else if (searchLocationList.length > 1) {
			ToastAndroid.show("Multiple Results Found. Try entering a postal code or include more specific terms e.g. Ion Orchard vs Ion", ToastAndroid.LONG);
		}
		else {
			if ((searchLocationList[0].latitude > MAP_BOUNDARIES['southwest']['lat'] &&
				searchLocationList[0].latitude < MAP_BOUNDARIES['northeast']['lat']) &&
				(searchLocationList[0].longitude > MAP_BOUNDARIES['southwest']['long'] &&
					searchLocationList[0].longitude < MAP_BOUNDARIES['northeast']['long'])) {
				setSearchLocation([searchLocationList[0].latitude, searchLocationList[0].longitude])
				mapRef.current.animateToRegion(
					parseLocationToRegion(searchLocationList[0]),
					1000
				);
				return `${searchLocationList[0].latitude},${searchLocationList[0].longitude}`
			}
			ToastAndroid.show("No Results Found. Try entering a postal code or include location e.g. Ion Orchard vs Ion", ToastAndroid.SHORT);
		}
		return null
	}

	function manageRecentSearches(carparkQuery) {
		try {
			searchSet.add(carparkQuery)
			if (searchSet.size > 3) {
				let searchArr = [...searchSet]
				searchArr.shift()
				let searchSetTruncated = new Set(searchArr)
				setSearchSet(searchSetTruncated)
			}
			else {
				setSearchSet(searchSet)
			}
		} catch (e) {
			console.log(e)
		}
	}

	function pressSuggestion(carparkSuggestion) {
		setSearchQuery(carparkSuggestion.CarparkID)
		onSubmitSuggestion(`"${carparkSuggestion.Location}"`, carparkSuggestion)
	}

	const parseLocationToRegion = (searchLocation) => {
		const regionObj = {
			latitude: searchLocation.latitude,
			longitude: searchLocation.longitude,
			latitudeDelta: 0.005,
			longitudeDelta: 0.005,
		};
		return regionObj;
	};

	function onClickMarker(marker) {
		sheetRef.current.snapTo(400)
		setCarparkInfo(marker);
	}

	let mounted = true;
	useEffect(() => {
		(async () => {
			if (mounted && location != null) {
				try {
					const currRegion = {
						latitude: location.coords.latitude,
						longitude: location.coords.longitude,
						latitudeDelta: 0.03,
						longitudeDelta: 0.03,
					};
					mapRef.current.animateToRegion(
						currRegion,
						1000
					);
					setLocationLoading(false);
				} catch (error) {
					console.log(error);
				}
			}
			else if (locationErr != null) {
				const currRegion = {
					latitude: 1.3521,
					longitude: 103.8198,
					latitudeDelta: 0.03,
					longitudeDelta: 0.03,
				};
				mapRef.current.animateToRegion(
					currRegion,
					1000
				);
				setLocationLoading(false);
			}
		})();
		return () => (mounted = false); //cleanup function so that function isnt called on unmounted component
	}, [location, locationErr]);


	const onRegionChange = (region) => {
		if (region.latitudeDelta < 0.1 && region.latitudeDelta < 0.1) {
			setShowMarker(true)
		}
		else {
			setShowMarker(false)
		}
	}

	const [currRegion, setCurrRegion] = useState({
		latitude: 1.3521,
		longitude: 103.8198,
		latitudeDelta: 0.03,
		longitudeDelta: 0.03,
	})

	const currRegionRef = useRef(currRegion)

	const onRegionChangeComplete = (region) => {
		currRegionRef.current = region
		setCurrRegion(region);
	}
	const changeBookmarks = useContext(MapScreenContext)
	const renderContent = () => (
		<CarparkBottomSheetContent
			currRegion={currRegionRef.current}
			carpark={carpark}
			changeBookmarks={changeBookmarks}
		/>
	);

	const sheetRef = useRef<BottomSheet>(null);
	const renderHeader = () => {
		return (
			<View style={styles.header}>
				<View style={styles.panelHeader}>
					<View style={styles.panelHandle} />
				</View>
			</View>
		);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<View>
				<MapComponent
					showMarker={showMarker}
					carparks={combinedCarparkData}
					searchLocation={searchLocation}
					initialRegion={initialRegion}
					onClickMarker={onClickMarker}
					onRegionChange={onRegionChange}
					onRegionChangeComplete={onRegionChangeComplete}
					width={width}
					height={height}
					mapRef={mapRef}
				/>
				<SearchBarSuggest
					onChangeText={onChangeSearch}
					suggestions={suggestions.length > 0 ? suggestions : [...searchSet].map((q) => { return { 'item': q } })}
					pressSuggestion={pressSuggestion}
					value={searchQuery}
					onSubmit={onSubmit}>
				</SearchBarSuggest>
				<BottomSheet
				    // enabledGestureInteraction={true}
					// enabledContentGestureInteraction={false}
					// enabledInnerScrolling={false}
					enabledContentTapInteraction={false}
					ref={sheetRef}
					initialSnap={0}
					snapPoints={[0, 230, 600]}
					borderRadius={20}
					renderContent={renderContent}
					renderHeader={renderHeader}
				/>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	header: {
		paddingTop: 20,
		height: 40,
	},
	panelHeader: {
		alignItems: 'center',
	},
	panelHandle: {
		width: 50,
		height: 8,
		borderRadius: 4,
		backgroundColor: 'rgba(0,0,0,0.7)',
		marginBottom: 8,
	},
});
const MapScreenContext = React.createContext();
const Stack = createStackNavigator();
function MapScreenStack(props) {
	return (
		<MapScreenContext.Provider value={props.changeBookmarks}>
			<Stack.Navigator >
				<Stack.Screen name="MapScreen"
					component={MapScreen}
					options={{ headerShown: false, }} />
				<Stack.Screen name="LocationPicker"
					component={LocationPicker}
					options={{
						headerTitle: props =>
							<View style={{ padding: 30 }}>
								<Title>Choose Location</Title>
								<Subheading>Tap anywhere to place marker</Subheading>
							</View>,
						headerStyle: { height: 130 }
					}} />
			</Stack.Navigator>
		</MapScreenContext.Provider >
	);
}

export default MapScreenStack

