import React from "react";
import styles from "../styles/ListStyles"
import {
	FlatList,
	SafeAreaView,
	ToastAndroid
} from "react-native";
import {
	Divider,
	Portal,
	Modal,
} from 'react-native-paper'
import { useState } from "react";
import CarparkListItem from './CarparkListItem'
import CarparkModal from './CarparkModal'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BOOKMARKED_CARPARKS } from '../constants/Constants'

export default CarparkList = (props) => {
	const [isModalVisible, setModalVisibility] = useState(false)
	const [currentItem, setCurrentItem] = useState({})

	const handleDelete = async (name) => {
		console.log('delete')
		try {
			let bmCarparks = await AsyncStorage.getItem(BOOKMARKED_CARPARKS)
			let bmCarparksSet = JSON.parse(bmCarparks)
			delete bmCarparksSet[name];
			await AsyncStorage.setItem(BOOKMARKED_CARPARKS, JSON.stringify(bmCarparksSet))
			props.changeBookmarks()
			ToastAndroid.show("Deleted", ToastAndroid.SHORT);
		} catch (e) {
			// saving ecrror
			// ToastAndroid.show("Please contact us with the following message. Could not delete: " + e, ToastAndroid.SHORT);
            console.log(e)
		}
	}


	function breakLines(s) {
		return s.replace(',', '').replace('; ', '\n')
	}

	const getCurrentItemInfo = (carpark) => {
		carpark["WeekDays_Rate_1"] = breakLines(carpark["WeekDays_Rate_1"])
		carpark["WeekDays_Rate_2"] = breakLines(carpark["WeekDays_Rate_2"])
		carpark["Saturday_Rate"] = breakLines(carpark["Saturday_Rate"])
		carpark["Sunday_PublicHoliday_Rate"] = breakLines(carpark["Sunday_PublicHoliday_Rate"])
		setCurrentItem(carpark)
		setModalVisibility(true)
	}
	const Item = ({ carpark, handleDelete, getCurrentItemInfo }) => (
		<CarparkListItem
			delete={props.delete}
			carpark={carpark}
			handleDelete={handleDelete}
			getCurrentItemInfo={getCurrentItemInfo}
		/>
	);
	const renderItem = ({ item }) => (
		<Item carpark={item} handleDelete={handleDelete} getCurrentItemInfo={getCurrentItemInfo} />
	);

	const renderItemSeparator = () => <Divider style={styles.divider} />
	// const renderFooter = () => isLoading && <Button style={styles.footer} loading={isLoading} />
	const renderModalContent = () => <CarparkModal item={currentItem} />

	return (
		<SafeAreaView style={styles.container}>
			<Portal>
				<Modal
					style={{ flexDirection: 'row', marginTop: 150, marginBottom: 150, marginHorizontal:15 }}
					visible={isModalVisible}
					contentContainerStyle={{ flex: 1, borderRadius: 50 }}
					dissmisable={true}
					onDismiss={() => { console.log('dismiss'); setModalVisibility(false) }}
				>
					{renderModalContent()}
				</Modal>
			</Portal>
			<FlatList
				style={styles.flatListContainer}
				data={props.carparks}
				renderItem={renderItem}
				keyExtractor={(item) => item.CarparkID}
				ItemSeparatorComponent={renderItemSeparator}
				// ListFooterComponent={renderFooter}
				initialNumToRender={10}
				removeClippedSubviews={true}
				// onEndReached={fetchMoreData}
				// onEndReachedThreshold={0.2}
				maxToRenderPerBatch={50}
				// extraData={coins}
				contentContainerStyle={styles.contentContainer}
			/>
		</SafeAreaView>
	);
};
