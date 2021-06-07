import { selectVehicle, storeCarparkData } from "../reduxStore/ActionCreators";
import { API_REFRESH_TIME, CARPARK_RATES_LTA, BOOKMARKED_CARPARKS, CARPARK_RATES_URA, VEHICLE, LTA_QUERY_STRING, URA_QUERY_STRING, RATES_LAST_LOADED, LOAD_RATE_INTERVAL } from '../constants/Constants'
import { fetchCarparkAvailability, fetchCarparkRates } from './APIUtils'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { innerJoinAvailabilityRatesLTA, innerJoinAvailabilityRatesURA, parseMotorcycletoCarparks, updateAvailabilityLTA, updateAvailabilityURA } from "./CarparkUtils";
import { ToastAndroid } from "react-native";
import { CarparkAvailabilityLTA, CarparkAvailabilityURA, Carpark } from "../models/Carpark"

export async function initialiseBookmarkStore() {
    let bmCarparks = await AsyncStorage.getItem(BOOKMARKED_CARPARKS)
    if (bmCarparks == null) {
        await AsyncStorage.setItem(BOOKMARKED_CARPARKS, JSON.stringify({}))
    }
}


export async function initialiseCarparkRatesStore() {
    try {
        let carrates = await AsyncStorage.getItem(CARPARK_RATES_LTA)
        if (carrates == null) {
            await AsyncStorage.setItem(CARPARK_RATES_LTA, JSON.stringify([]))
            console.log('LTA store initialised')
        }
        let carratesURA = await AsyncStorage.getItem(CARPARK_RATES_URA)
        if (carratesURA == null) {
            await AsyncStorage.setItem(CARPARK_RATES_URA, JSON.stringify([]))
            console.log('URA store initialised')
        }
    }
    catch (e) {
        console.log(e)
    }
}

export async function initialiseVehicleStore(dispatch) {
    try {
        let vehicle = await AsyncStorage.getItem(VEHICLE)
        if (vehicle == null) {
            await AsyncStorage.setItem(VEHICLE, 'car')
            console.log('vehicle store initialised')
            return 'car'
        }
        else {
            dispatch(selectVehicle(vehicle))
        }
        return vehicle
    }
    catch (e) {
        console.log(e)
    }
}

export async function checkRatesLastLoaded() {
    try {
        let lastLoaded = await AsyncStorage.getItem(RATES_LAST_LOADED)
        if (lastLoaded == null) {
            await AsyncStorage.setItem(RATES_LAST_LOADED, Date.now().toString())
            console.log('store first load timestamp')
            return false
        }
        else {
            if (Date.now() - parseInt(lastLoaded) > LOAD_RATE_INTERVAL) {
                await AsyncStorage.setItem(RATES_LAST_LOADED, Date.now().toString())
                console.log('refresh storage')
                return false
            }
            console.log('rates already loaded')
            return true
        }
    }
    catch (e) {
        console.log(e)
    }
    return false
}


export async function initialiseDataManager(dispatch, vehicle, ratesLTA, ratesURA) {
    console.log('Pull API')
    let dataLTA = []
    let dataURA = []
    try {
        const availabilityLTARes = await fetchCarparkAvailability(vehicle, 'LTA')
        const availabilityLTA: CarparkAvailabilityLTA[] = JSON.parse(availabilityLTARes.data.data)
        if (vehicle == 'motorcycle') {
            dataLTA = parseMotorcycletoCarparks(availabilityLTA, ratesLTA)
        }
        else {
            dataLTA = innerJoinAvailabilityRatesLTA(availabilityLTA, ratesLTA)
        }
    }
    catch (error) {
        console.log(error)
    }
    try {
        const availabilityURARes = await fetchCarparkAvailability(vehicle, 'URA')
        const availabilityURA: CarparkAvailabilityURA[] = JSON.parse(availabilityURARes.data.data)
        dataURA = innerJoinAvailabilityRatesURA(availabilityURA, ratesURA)
    }
    catch (error) {
        console.log(error)
    }
    let combinedCarparkData = dataLTA.concat(dataURA);
    dispatch(storeCarparkData(combinedCarparkData)) //synchronous
    console.log("Total no. of carparks: ", combinedCarparkData.length)
    return combinedCarparkData
}

export async function initialiseAvailabilityUpdateService(dispatch, vehicle, combinedCarparkData) {
    setInterval(() => {
        // const start = Date.now()
        availabilityUpdateService(dispatch, vehicle, combinedCarparkData)
        // console.log("time to process update load: ", Date.now() - start)
    }, API_REFRESH_TIME);
}

async function availabilityUpdateService(dispatch, vehicle, combinedCarparkData) {
    console.log('Pull API')
    try {
        const availabilityLTARes = await fetchCarparkAvailability(vehicle, LTA_QUERY_STRING)
        const availabilityLTA: CarparkAvailabilityLTA[] = JSON.parse(availabilityLTARes.data.data)
        updateAvailabilityLTA(availabilityLTA, combinedCarparkData)
    }
    catch (error) {
        console.log(error)
        ToastAndroid.show("Server Error, please check network connection else please contact us with the error: " + error, ToastAndroid.SHORT);

    }
    try {
        const availabilityURARes = await fetchCarparkAvailability(vehicle, URA_QUERY_STRING)
        const availabilityURA: CarparkAvailabilityURA[] = JSON.parse(availabilityURARes.data.data)
        updateAvailabilityURA(availabilityURA, combinedCarparkData)
    }
    catch (error) {
        console.log(error)
        ToastAndroid.show("Server Error, please check network connection else please contact us with the error: " + error, ToastAndroid.SHORT);
    }
    dispatch(storeCarparkData(combinedCarparkData))
    console.log(combinedCarparkData.length)
}

export async function loadCarparkRates(vehicle, agency, agencyStorageKey) {
    try {
        let ratesRes = await fetchCarparkRates(vehicle, agency)
        let rates = ratesRes.data
        await AsyncStorage.setItem(agencyStorageKey, JSON.stringify(ratesRes.data))
        console.log(`store ${agency}`)
        return rates
    }
    catch (e) {
        ToastAndroid.show("Server Error, please check network connection else please contact us with the error: " + e, ToastAndroid.SHORT);
        try {
            console.log(e)
            console.log(`fetch ${agency} rates from storage`)
            let ratesStr = await AsyncStorage.getItem(agencyStorageKey)
            let rates = JSON.parse(ratesStr)
            return rates
        }
        catch (e) {
            console.log(e)
        }
    }
    return []
}

export async function loadCarparkRatesFromStorage(agencyStorageKey) {
    try {
        console.log(`fetch ${agencyStorageKey} rates from storage`)
        let ratesStr = await AsyncStorage.getItem(agencyStorageKey)
        let rates = JSON.parse(ratesStr)
        return rates
    }
    catch (e) {
        console.log(e)
    }
    return []
}