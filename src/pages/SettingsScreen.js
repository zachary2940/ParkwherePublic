import styles from "../styles/styles"
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ToastAndroid, Image, Linking,Share } from "react-native";
import { ToggleButton, Button } from 'react-native-paper';
import { selectVehicle } from "../reduxStore/ActionCreators";
import { useDispatch, useSelector } from 'react-redux'
import { BOOKMARKED_CARPARKS, CARPARK_RATES_LTA, CARPARK_RATES_URA, CAR_QUERY_STRING, LTA_QUERY_STRING, MOTORCYCLE_QUERY_STRING, RATES_LAST_LOADED, VEHICLE } from '../constants/Constants'
import { setDarkMode } from '../reduxStore/ActionCreators'
import { Switch, Subheading } from 'react-native-paper'
import { useTheme } from 'react-native-paper'
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
	const dispatch = useDispatch()

	// const [fakeTime, setFakeTime] = useState(null);
	const [alwaysShowMarkers, setAlwaysShowMarkers] = useState(false);


	const styleReducerObj = useSelector(state => state.styleReducerObj)// returns a new value when caraprk chages and rerenders the component
	const { loading, darkMode } = styleReducerObj
	const toggleSwitchDarkMode = () => dispatch(setDarkMode(!darkMode));
	// const toggleSwitchTime = (newFakeTime) => setFakeTime(newFakeTime);
	const toggleSwitchShowMarkers = () => setAlwaysShowMarkers(alwaysShowMarkers => !alwaysShowMarkers);
	// const svehicleTypeReducerObj = useSelector(state => state.vehicleTypeReducerObj)// returns a new value when caraprk chages and rerenders the component
	// const { loading, vehicleType } = styleReducerObj

	const [vehicle, setVehicle] = useState('car');
	const [buttonPress, setButtonPress] = useState(true);

	const firstUpdate = useRef(true);
	useEffect(() => {
		(async () => {
			if (!firstUpdate.current) {
				console.log(vehicle)
				ToastAndroid.show(`Please restart for new ${vehicle} data`, ToastAndroid.SHORT);
				await AsyncStorage.setItem(VEHICLE, vehicle)
				await AsyncStorage.setItem(BOOKMARKED_CARPARKS, JSON.stringify(new Set()))
				await AsyncStorage.setItem(RATES_LAST_LOADED, '0') //need to refresh for motorcycle rates
				dispatch(selectVehicle(vehicle))
			}
			firstUpdate.current = false
		})()
	}, [buttonPress])

	useEffect(() => {
		(async () => {
			setVehicle(await AsyncStorage.getItem(VEHICLE))
		})()
	}, [])
	const { colors } = useTheme();

	const onShare = async () => {
	try {
		const result = await Share.share({
				  message: 'Parkwhere: SG Carpark Rates and Availability\n\nSearch for car/motorcycle parking locations, their rates and lots available!\n\nDownload now: https://play.google.com/store/apps/details?id=com.TidBit.Parkwhere',
				//   url: 'https://play.google.com/store/apps/details?id=com.TidBit.Parkwhere',
				  title: 'Parkwhere: SG Carpark Rates and Availability'
				}, {
				  // Android only:
				  dialogTitle: 'Share the Parkwhere App!',
				  // iOS only:
				//   excludedActivityTypes: [
				// 	'com.apple.UIKit.activity.PostToTwitter'
				//   ]
				});
		if (result.action === Share.sharedAction) {
			ToastAndroid.show('Thanks for sharing!', ToastAndroid.SHORT);
		} else if (result.action === Share.dismissedAction) {
		// dismissed
		}
	} catch (error) {
		ToastAndroid.show('Error sharing, please contact us with the message: '+ error.message, ToastAndroid.SHORT);
	}
	};

	const stylesLocal = StyleSheet.create({
		row: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingTop: 16,
			paddingHorizontal: 16,
			marginLeft: 16,
			marginRight: 16,
			width: '100%',
		},
	})

	return (
		<View style={[styles.container, { backgroundColor: colors.surface }]}>
			<Image
				style={styles.tinyLogo}
				source={require('../../assets/ParkwhereLogo.png')}
			/>
			{/* <Text>Dark Mode</Text>
			<Switch
				onValueChange={toggleSwitchDarkMode}
				value={darkMode}
			/> */}
			{/* <Text>Time</Text>

			<Switch
				onValueChange={toggleSwitch}
				value={useFakeTime}
			/> */}
			{/* <View style={stylesLocal.row}>
				<Subheading style={{ color: colors.primary }}>Always Show Markers</Subheading>
				<Switch value={alwaysShowMarkers} onValueChange={toggleSwitchShowMarkers} />
			</View> */}
			<View style={stylesLocal.row}>
				<Subheading style={{ color: colors.primary }}>Vehicle Type</Subheading>
				<ToggleButton.Row onValueChange={value => { setVehicle(value); setButtonPress(!buttonPress); }} value={vehicle}>
					<ToggleButton
						icon="car"
						value={CAR_QUERY_STRING}
						disabled={CAR_QUERY_STRING == vehicle} />
					<ToggleButton
						icon="bike"
						value={MOTORCYCLE_QUERY_STRING}
						disabled={MOTORCYCLE_QUERY_STRING == vehicle} />
				</ToggleButton.Row>
			</View>
			<View style={stylesLocal.row}>
				<Subheading style={{color:'blue'}}>Blue</Subheading><Subheading>No carpark availability data</Subheading>
			</View>
			<View style={stylesLocal.row}>
			<Subheading style={{color:'green'}}>Green</Subheading><Subheading>Many available lots</Subheading>
			</View>
			<View style={stylesLocal.row}>
			<Subheading style={{color:'orange'}}>Orange</Subheading><Subheading>Few carpark lots</Subheading>
			</View>
			<View style={stylesLocal.row}>
			<Subheading style={{color:'red'}}>Red</Subheading><Subheading>No carpark lots</Subheading>
			</View>

			<View style={{
				flex: 1,
				justifyContent: 'flex-end',
				marginBottom: 36
			}}>
				<Button
					onPress={() => onShare()}
					title="Share"
					style={{ marginTop: 10 }}>
					Share the App!
				</Button>
				<Button
					onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.TidBit.Parkwhere')}
					title="Review"
					style={{ marginTop: 10 }}>
					Leave us a Review!
				</Button>
				<Button
					onPress={() => Linking.openURL('mailto:tidbitsoftwareco@gmail.com?subject=ParkwhereFeedback')}
					title="Report"
					style={{ marginTop: 10 }}>
					Contact Us!
				</Button>
			</View>

		</View>
	);
}


