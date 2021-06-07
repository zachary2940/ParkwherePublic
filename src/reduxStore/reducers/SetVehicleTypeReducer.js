import { SET_VEHICLE_TYPE } from "../Types"

const initialState = {
    vehicleType: 'car',
    loading: true
}

// reducer
export default function CarparkReducer(state = initialState, action) {
    switch (action.type) {
        case SET_VEHICLE_TYPE:
            return {
                ...state, 
                vehicleType: action.payload,
                loading: false
            }
        default: return state
    }
}