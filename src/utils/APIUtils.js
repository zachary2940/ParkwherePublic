import axios from "axios";
import { GET_CARPARK_AVAILABILITY_ENDPOINT, GET_CARPARK_RATES_ENDPOINT, INSERT_CARPARK_ENDPOINT } from '../constants/Constants'

export function fetchCarparkRates(vehicle, agency) {
	console.log(`fetch ${agency} rates`)
	url = GET_CARPARK_RATES_ENDPOINT
	const res = axios.get(url)
	return res
}

export function fetchCarparkAvailability(vehicle, agency) {
	console.log(`fetch ${agency} availability`)
	url = GET_CARPARK_AVAILABILITY_ENDPOINT + '?vehicle=' +
		vehicle + '&agency=' + agency
	const res = axios.get(url)
	return res
}


export function insertCarpark(carparkObj) {
	console.log(`post updated information`)
	url = INSERT_CARPARK_ENDPOINT
	const res = axios.post(url,carparkObj)
	return res
}

