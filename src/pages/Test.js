import React, { useState, useEffect, useRef } from "react";
import { Picker } from '@react-native-picker/picker';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-paper';
import RateItem from '../components/RateItem'
import { NavigationContainer } from '@react-navigation/native';
import {
	createBottomSheetNavigator,
	BottomSheetScreenProps,
} from 'reanimated-bottom-sheet-navigator';

// type SheetParamList = {
// 	Hello: undefined;
// };

const Sheet = createBottomSheetNavigator();

const HelloScreen = ({
	navigation,
}) => (
	<View style={styles.screen}>
		<Button title="Open sheet" onPress={navigation.openSheet} />
		<Button title="Close sheet" onPress={navigation.closeSheet} />
		<Button title="Snap to middle" onPress={() => navigation.snapSheet(1)} />
	</View>
);

function Test() {
	const renderContent = () => <Text style={styles.sheet}>Hello world</Text>;

	return (
			<Sheet.Navigator
				snapPoints={[300, 100, 0]}
				borderRadius={15}
				renderContent={renderContent}
			>
				<Sheet.Screen name="Hello" component={HelloScreen} />
			</Sheet.Navigator>
	);
}

const styles = StyleSheet.create({
	sheet: {
		backgroundColor: '#111',
		color: 'white',
		height: 300,
		padding: 24,
	},
	screen: {
		flex: 1,
		backgroundColor: 'papayawhip',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default Test
