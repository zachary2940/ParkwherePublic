import {
    SET_VEHICLE_TYPE,
    STORE_COMBINED_CARPARK_DATA,
    STORE_COMBINED_CARPARK_DATA_ERROR,
    SET_DARK_MODE,
} from "./Types"

export const storeCarparkData = (combinedCarparkData) => (dispatch) => {
    try {
        console.log('load combined carparkdata into memory')
        dispatch({
            type: STORE_COMBINED_CARPARK_DATA,
            payload: combinedCarparkData
        })
    }
    catch (error) {
        dispatch({
            type: STORE_COMBINED_CARPARK_DATA_ERROR,
            payload: error,
        })
    }
}

export const selectVehicle = (vehicle) => dispatch => {
    dispatch({
        type: SET_VEHICLE_TYPE,
        payload: vehicle
    })
}

export const setDarkMode = (dark) => dispatch => {
    dispatch({
        type: SET_DARK_MODE,
        payload: dark
    })
}
