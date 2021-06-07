import React, { useState, useEffect } from "react";
import CarparkInputForm from "./CarparkInputForm";
import CarparkInfoCard from "./CarparkInfoCard"
import { Button, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { View, Text, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomSheetContext } from '../contextProviders/BottomSheetContext'

function CarparkBottomSheetContent(props) {
	// const Stack = createStackNavigator();
	const [report, setReport] = useState(false)

	const pressReport = () => {
		setReport(true)
	}

	const stopReport = () => {
		setReport(false)
	}


	return (
		<View style={{
			backgroundColor: 'white',
			padding: 10,
			paddingTop: 20,
			height: "auto",
			minHeight: 600
		}}>
			{!report ?
				<CarparkInfoCard
					carpark={props.carpark}
					changeBookmarks={props.changeBookmarks}
					pressReport={pressReport}>
				</CarparkInfoCard> :
				<CarparkInputForm
					carpark={props.carpark}
					stopReport={stopReport}
					currRegion={props.currRegion}>
				</CarparkInputForm>}


			{/* <BottomSheetContext.Provider value={{
				'changeBookmarks': props.changeBookmarks,
				'carpark': props.carpark,
				'currRegion': props.currRegion
			}}>
				<Stack.Navigator >
					<Stack.Screen name="CarparkInfoCard"
						component={CarparkInfoCard}
						options={{ headerShown: false, }}
					/>
					<Stack.Screen name="CarparkInputForm"
						component={CarparkInputForm}
						options={{
							headerTitle: props =>
								<View style={{ padding: 30 }}>
									<Title>Report</Title>
								</View>,
							headerStyle: { height: 130 }
						}} />
				</Stack.Navigator>
			</BottomSheetContext.Provider> */}
		</View>
	);
}


export default CarparkBottomSheetContent



