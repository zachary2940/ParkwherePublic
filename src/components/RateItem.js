import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Button, Card, TextInput, Avatar, Title, Paragraph, Divider, Subheading } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';


const TimeUnitField = (props) => (
	<View style={{ flexDirection: "row" }}>
		<View style={styles.inputBottom}>
			<TextInput
				style={styles.inputField}
				onChangeText={(timeAmount) => props.onChangeTimeAmount(timeAmount)}
				value={props.timeUnit == "entry" ? 'N/A' : props.timeAmount}
				maxLength={5}
				keyboardType='numeric'
				disabled={props.timeUnit == "entry"} />
		</View>
		<View style={styles.inputBottom}>
			<Picker
				selectedValue={props.timeUnit}
				onValueChange={currentTimeUnit => props.setTimeUnit(currentTimeUnit)}
				style={{ width: 105, height: 40 }}>
				<Picker.Item label="min" value="min" />
				<Picker.Item label="hour" value="hour" />
				{props.inputFormat == '1' ? <Picker.Item label="entry" value="entry" /> : null}
			</Picker>
		</View>
	</View>
)


function RateItem(props) {

	const [rateItemInputs, setRateItemInputs] = useState({ ...props.rateItemInputs });
	const [show, setShow] = useState(false);
	const [start, setStart] = useState(true);
	const [key, setKey] = useState(props.id);

	const onChangeTime = (event, selectedDate) => {
		setShow(Platform.OS === 'ios');
		if (start) {
			props.updateRateItemInputs({ ...rateItemInputs, startTime: get24HTime(selectedDate) }, props.id);
		}
		else {
			props.updateRateItemInputs({ ...rateItemInputs, endTime: get24HTime(selectedDate) }, props.id)
		}
	};

	useEffect(() => {
		// console.log('update')
		setRateItemInputs(props.rateItemInputs)
		// console.log(props)
	}, [props.rateItemInputs])

	function get24HTime(date) {
		if (date == null) {
			return null
		}
		var hours = date.getHours();
		var minutes = date.getMinutes();
		if (hours < 10) {
			hours = '0' + hours.toString()
		}
		if (minutes < 10) {
			minutes = '0' + minutes.toString()
		}
		return hours.toString() + ':' + minutes.toString()
	}

	// nested components are rerendered as a new component on every render

	const TimePickerField = (props) => (
		<TouchableOpacity
			// disabled={timeUnit == "entry"}
			onPress={() => {
				setStart(props.start);
				setShow(true)
			}}>
			<TextInput

				style={styles.inputField}
				disabled={true}>
				{props.time}
			</TextInput>
		</TouchableOpacity>
	)

	const RateItemTimeSection = () => (
		<View>
			<View style={styles.row}>
				<View style={styles.inputBottom}>
					<Text style={styles.label}>Time</Text>
					<TimePickerField time={props.rateItemInputs.startTime} start={true} />
				</View>
				<View style={styles.inputBottom}>
					<Text>to  </Text>
				</View>
				<View style={styles.inputBottom}>
					<TimePickerField time={props.rateItemInputs.endTime} start={false} />
				</View>
				<View style={styles.inputBottom}>
					<Picker
						selectedValue={props.rateItemInputs.dayUnit}
						onValueChange={currentDayUnit => props.updateRateItemInputs({ ...rateItemInputs, dayUnit: currentDayUnit }, key)}
						style={{ width: 160, height: 40 }}>
						<Picker.Item label="weekday" value="weekday" />
						<Picker.Item label="saturday" value="saturday" />
						<Picker.Item label="sunday/p.h." value="sunday/p.h." />
					</Picker>
				</View>
			</View>
			{show && (
				<DateTimePicker
					testID="dateTimePicker"
					value={new Date()}
					mode={'time'}
					is24Hour={true}
					display="default"
					onChange={onChangeTime}
				/>
			)}
		</View>
	)



	const DeleteButton = () => (
		<View style={styles.inputBottom}>
			<TouchableOpacity hitSlop={{ x: 10, y: 10 }} onPress={() => props.handleDelete(key)}>
				<Avatar.Icon
					size={28}
					icon="trash-can"
				/>
			</TouchableOpacity>
		</View>
	)

	const onChangeTimeAmount1 = (timeAmount) => {
		props.updateRateItemInputs({ ...rateItemInputs, timeAmount1: timeAmount }, key)
	}

	const onChangeTimeAmount2 = (timeAmount) => {
		props.updateRateItemInputs({ ...rateItemInputs, timeAmount2: timeAmount }, key)
	}

	const setTimeUnit1 = (timeUnit) => {
		props.updateRateItemInputs({ ...rateItemInputs, timeUnit1: timeUnit }, key)
	}

	const setTimeUnit2 = (timeUnit) => {
		props.updateRateItemInputs({ ...rateItemInputs, timeUnit1: timeUnit }, key)
	}

	const RateItemPriceSection1 = () => (
		<View style={styles.row}>
			<View style={styles.inputWrap}>
				<Text style={styles.label}>Price</Text>
				<TextInput
					style={styles.inputField}
					onChangeText={(price) => props.updateRateItemInputs({ ...rateItemInputs, price1: price }, key)}
					value={rateItemInputs.price1}
					maxLength={5}
					keyboardType='numeric' />
			</View>
			<View style={styles.inputBottom}>
				<Text>per</Text>
			</View>
			<TimeUnitField
				onChangeTimeAmount={onChangeTimeAmount1}
				timeAmount={rateItemInputs.timeAmount1}
				setTimeUnit={setTimeUnit1}
				timeUnit={rateItemInputs.timeUnit1}
				inputFormat={props.inputFormat}
			/>
			<DeleteButton></DeleteButton>
		</View>
	)

	const RateItemPriceSection2 = () => (
		<View>
			<View style={styles.row}>
				<View style={styles.inputWrap}>
					<Text style={styles.label}>Price</Text>
					<TextInput
						style={styles.inputField}
						onChangeText={(price) => props.updateRateItemInputs({ ...rateItemInputs, price1: price }, key)}
						value={rateItemInputs.price1}
						maxLength={5}
						keyboardType='numeric'
					/>
				</View>
				<View style={styles.inputBottom}>
					<Text>for 1st</Text>
				</View>
				<TimeUnitField
					onChangeTimeAmount={onChangeTimeAmount1}
					timeAmount={rateItemInputs.timeAmount1}
					setTimeUnit={setTimeUnit1}
					timeUnit={rateItemInputs.timeUnit1}
					inputFormat={props.inputFormat}
				/>
				<DeleteButton></DeleteButton>
			</View>
			<View style={styles.row}>

				<View style={styles.inputBottom}>
					<TextInput
						style={styles.inputField}
						onChangeText={(price) => props.updateRateItemInputs({ ...rateItemInputs, price1: price }, key)}
						value={rateItemInputs.price2}
						maxLength={5}
						keyboardType='numeric'
					/>
				</View>
				<View style={styles.inputBottom}>
					<Text>for subsequent</Text>
				</View>
				<TimeUnitField
					onChangeTimeAmount={onChangeTimeAmount2}
					timeAmount={rateItemInputs.timeAmount2}
					setTimeUnit={setTimeUnit2}
					timeUnit={rateItemInputs.timeUnit2}
					inputFormat={props.inputFormat}
				/>
			</View>
		</View>


	)
	return (
		<View>
			{props.inputFormat == '1' ?
				RateItemPriceSection1() : RateItemPriceSection2()}
			<RateItemTimeSection></RateItemTimeSection>
			<Divider style={{ marginVertical: 5 }} />
		</View>

	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		marginBottom: 10
	},
	inputWrap: {
		marginHorizontal: 8
	},
	inputBottom: {
		marginHorizontal: 8,
		justifyContent: 'flex-end',
	},
	inputField: {
		fontSize: 14,
		height: 35,
		width: 65,
		color: "#6a4595"
	},
});

export default RateItem
