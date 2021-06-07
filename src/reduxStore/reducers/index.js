import { combineReducers } from 'redux'
import CarparkCombinedReducer from './CarparkCombinedReducer'
import SetVehicleTypeReducer from './SetVehicleTypeReducer'
import StyleReducer from './StyleReducer'


export default combineReducers({
  carparkCombinedReducerObj: CarparkCombinedReducer,
  vehicleTypeReducerObj: SetVehicleTypeReducer,
  styleReducerObj: StyleReducer,
})