import { SET_DARK_MODE } from "../Types"


const initialState = {
    darkMode: false,
    loadingStyle: true
}

// reducer
export default function StyleReducer(state = initialState, action) {
    switch (action.type) {

        case SET_DARK_MODE:
            return {
                ...state, 
                darkMode: action.payload,
                loading: false
            }
        default: return state
    }
}