
import styles from "../styles/styles"
import React, { useState, useEffect } from "react";
import { View, Text, } from "react-native";
import { useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BOOKMARKED_CARPARKS } from '../constants/Constants'
import {
    useTheme,
    Title,
    Subheading,
} from 'react-native-paper'


function BookmarkScreen(props) {

    /**
     * AWS carpark request
     */


    const carparkCombinedReducerObj = useSelector(state => state.carparkCombinedReducerObj)
    const { loadingCombined, errorCombined, combinedCarparkData } = carparkCombinedReducerObj

    const { colors } = useTheme();

    const [clearState, setClearState] = useState(false);

    const [bookmarkedCarparks, setbookmarkedCarparks] = useState({});

    const [bookmarkedCarparksAvailability, setbookmarkedCarparksAvailability] = useState([]);



    useEffect(() => {
        (async () => {
            console.log("retrieve bookmarks from async storage")
            const bookmarkedCarparksString = await AsyncStorage.getItem(BOOKMARKED_CARPARKS)
            setbookmarkedCarparks({ ...JSON.parse(bookmarkedCarparksString) })
        })();
    }, [props.bookmarksChanged])

    useEffect(() => {
        setbookmarkedCarparksAvailability([])
        setClearState(!clearState)
    }, [combinedCarparkData])


    useEffect(() => {
        if (combinedCarparkData.length > 0) {
            let bmCarparks = []
            combinedCarparkData.map(carpark => {
                if (carpark.CarparkID in bookmarkedCarparks) {
                    bmCarparks.push(carpark)
                }
            }
            )
            setbookmarkedCarparksAvailability([...bmCarparks]) // same array so need to pass new obj
        }
    }, [clearState, bookmarkedCarparks])

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            {/* <GradientHeader 
              title="Bookmarked Carparks"
              subtitle={null}
            //   gradientColors={["#00416A", "#E4E5E6"]}
              imageSource={null}/> */}
            <Title>Bookmarked Carparks</Title>
            {loadingCombined ? <Text>"Calling Server..."</Text> :
                errorCombined ? <Text>{error}</Text> :
                bookmarkedCarparksAvailability.length == 0 ? <Subheading style={{marginTop:100}}>Add Bookmarks To View Them Here</Subheading> :
                        <CarparkList
                            changeBookmarks={props.changeBookmarks}
                            delete={true}
                            carparks={bookmarkedCarparksAvailability}
                        />}
        </View>
    );
}

export default BookmarkScreen;