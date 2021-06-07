import React, { useContext } from 'react';
import { parseLat, parseLong, openMaps } from "../utils/MapUtils";
import { Image } from 'react-native';
import { Button, Card, ScrollView, Title, Paragraph, Divider } from 'react-native-paper';
import { ToastAndroid, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BOOKMARKED_CARPARKS } from "../constants/Constants";
import { BottomSheetContext } from '../contextProviders/BottomSheetContext'
import { useNavigation, useRoute } from '@react-navigation/native';


function CarparkInfoCard(props) {
    // const BottomSheetContextValue = useContext(BottomSheetContext)
    // const navigation = useNavigation();
    // const route = useRoute();

    // function navigateToInputForm() {
    //     navigation.navigate("CarparkInputForm");
    // }
    const storeBookmark = async (name) => {
        try {
            let bmCarparks = await AsyncStorage.getItem(BOOKMARKED_CARPARKS)
            let bmCarparksSet = JSON.parse(bmCarparks)
            if (name in bmCarparksSet) {
                ToastAndroid.show("Already bookmarked", ToastAndroid.SHORT);
            }
            else {
                bmCarparksSet[name] = true
                await AsyncStorage.setItem(BOOKMARKED_CARPARKS, JSON.stringify(bmCarparksSet))
                ToastAndroid.show("Bookmarked", ToastAndroid.SHORT);
                props.changeBookmarks()
            }
        } catch (e) {
            // saving error
            // ToastAndroid.show("Could not bookmark:" + e, ToastAndroid.SHORT);
            console.log(e)
        }
    }

    if (props.carpark.CarparkID != null) {
        return (

            <Card style={{ padding: 10 }}>
                <Card.Title title={props.carpark.CarparkName.toLowerCase()} titleStyle={{ textTransform: 'capitalize' }} titleNumberOfLines={2} />
                <Card.Content>
                    <Title >Available Lots</Title>
                    <Paragraph>{props.carpark.AvailableLots}</Paragraph>
                    <Image style={{
                        width: '100%',
                        height: 80,
                    }} source={require('../../assets/chart.png')} />
                    <Divider style={{ marginVertical: 5 }} />
                    <Card.Actions>
                        <Button onPress={() => openMaps(parseLat(props.carpark), parseLong(props.carpark))}>Open Map</Button>
                        <Button onPress={() => storeBookmark(props.carpark.CarparkID)}>Bookmark</Button>
                    </Card.Actions>
                    <Divider style={{ marginVertical: 5 }} />
                    <Title style={{ marginTop: 10 }}>Weekday Morning/Afternoon</Title>
                    <Paragraph>{props.carpark.WeekDays_Rate_1}</Paragraph>
                    <Title style={{ marginTop: 10 }}>Weekday Night</Title>
                    <Paragraph>{props.carpark.WeekDays_Rate_2}</Paragraph>
                    <Title style={{ marginTop: 10 }}>Saturday Rate</Title>
                    <Paragraph>{props.carpark.Saturday_Rate}</Paragraph>
                    <Title style={{ marginTop: 10 }}>Sunday/Public Holiday Rate</Title>
                    <Paragraph>{props.carpark.Sunday_PublicHoliday_Rate}</Paragraph>
                </Card.Content>
                <Divider style={{ marginVertical: 5 }} />
                <Card.Actions>
                    <Button onPress={() => props.pressReport()}>
                        Report Inaccurate Information
                        </Button>
                </Card.Actions>
            </Card>
        );
    }
    else {
        return (<Text>Loading...</Text>)
    }
}

export default CarparkInfoCard