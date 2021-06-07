import {createStore, applyMiddleware,compose} from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers'

const initalState = {
}
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [thunk]

const Store = createStore(rootReducer, initalState, composeEnhancer(applyMiddleware(...middleware)))

export default Store;