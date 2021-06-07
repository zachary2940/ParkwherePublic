import { STORE_COMBINED_CARPARK_DATA_ERROR, STORE_COMBINED_CARPARK_DATA } from "../Types"

const initialState = {
    combinedCarparkData: [],
    loadingCombined: true
}

// reducer
export default function CarparkCombinedReducer(state = initialState, action) {
    switch (action.type) {
        case STORE_COMBINED_CARPARK_DATA:
            return {
                ...state, 
                combinedCarparkData: action.payload,
                loadingCombined: false
            }
        case STORE_COMBINED_CARPARK_DATA_ERROR:
            return {
                loadingCombined: false,
                errorCombined: action.payload
            }
        default: return state
    }
}