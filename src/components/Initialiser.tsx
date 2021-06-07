import { initialiseBookmarkStore, initialiseCarparkRatesStore, initialiseVehicleStore, loadCarparkRates, initialiseDataManager, initialiseAvailabilityUpdateService, loadCarparkRatesFromStorage, checkRatesLastLoaded } from '../utils/InitialiserUtils'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from "react";
import { DefaultTheme, DarkTheme, Provider as PaperProvider } from 'react-native-paper'
import { AppLoading } from 'expo'
import { ToastAndroid } from 'react-native'
import { CARPARK_RATES_LTA, CARPARK_RATES_URA, LTA_QUERY_STRING, URA_QUERY_STRING } from '../constants/Constants'
import { Carpark, CarparkRatesLTA, CarparkRatesURA } from '../models/Carpark' 
import Navigation from '../navigation/Navigation'
import AsyncStorage from '@react-native-async-storage/async-storage';

function Initialiser(props) {

  const styleReducerObj = useSelector(state => state.styleReducerObj)
  const { loadingStyle, darkMode } = styleReducerObj
	// const vehicleTypeReducerObj = useSelector(state => state.vehicleTypeReducerObj)// returns a new value when caraprk chages and rerenders the component
	// const { loading, vehicleType } = vehicleTypeReducerObj
  const dispatch = useDispatch()

  async function init() {
    console.log('init called')
    await AsyncStorage.clear()
    await initialiseBookmarkStore()
    await initialiseCarparkRatesStore()
    let vehicle = await initialiseVehicleStore(dispatch)
    let ratesLoaded = await checkRatesLastLoaded()
    let ratesLTA:CarparkRatesLTA[] = []
    let ratesURA:CarparkRatesURA[] = []
    if (ratesLoaded){
      ratesLTA = await loadCarparkRatesFromStorage(CARPARK_RATES_LTA)
      ratesURA = await loadCarparkRatesFromStorage(CARPARK_RATES_URA)
    }
    else{
      ratesLTA = await loadCarparkRates(vehicle,LTA_QUERY_STRING,CARPARK_RATES_LTA)
      ratesURA = await loadCarparkRates(vehicle,URA_QUERY_STRING,CARPARK_RATES_URA)
    }
    // const start = Date.now();
    let combinedCarparkData:Carpark[] = await initialiseDataManager(dispatch,vehicle, ratesLTA, ratesURA) //thunk promise here to confirm that combinedCarparkData is ready
    // console.log("time to process first load: ", Date.now()-start)
    initialiseAvailabilityUpdateService(dispatch,vehicle,combinedCarparkData)
  }
  function handleLoadingError(error) {
    // In this case, you might want to report the error to your error reporting
    // service, for example Sentry
    console.warn(error)
  }

  const [isLoadingComplete, setLoadingComplete] = useState(false)
  const skipLoadingScreen = false
  if (!isLoadingComplete && !skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={init}
        onError={handleLoadingError}
        onFinish={() => setLoadingComplete(true)}
      />
    )
  }

  return (
    <PaperProvider theme={darkMode ? DarkTheme : DefaultTheme}>
      <Navigation theme={darkMode ? DarkTheme : DefaultTheme} />
    </PaperProvider>
  );
}

export default Initialiser;