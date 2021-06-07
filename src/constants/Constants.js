export const BOOKMARKED_CARPARKS = "BOOKMARKED_CARPARKS"
export const CARPARK_RATES_LTA = "CARPARK_RATES_LTA"
export const CARPARK_RATES_URA = "CARPARK_RATES_URA"
export const RATES_LAST_LOADED = "RATES_LAST_LOADED"
export const VEHICLE = "VEHICLE"
export const API_REFRESH_TIME = 60000
export const LOAD_RATE_INTERVAL = 86400000 * 7 //7 days
export const MAP_BOUNDARIES = {
    northeast: {
        "lat": 1.4704753,
        "long": 104.0520359
    },
    southwest: {
        "lat": 1.1304753,
        "long": 103.6020359
    } 	 	 	
}

export const CAR_QUERY_STRING = "car"
export const MOTORCYCLE_QUERY_STRING = "motorcycle"
export const AWS_API_URL = "https://q4n33gpb97.execute-api.ap-southeast-1.amazonaws.com"
export const ORACLE_API_URL = "https://objectstorage.ap-mumbai-1.oraclecloud.com/p/F6m0PYcHmzaoTwcim5mejhh6K4yhg4cyMP9SgHZTf3zgQZr-stQWRnybutP93lTZ/n/bmgmubm43b7x/b/bucket-20210607-1304/o/"
export const GET_CARPARK_AVAILABILITY_ENDPOINT = AWS_API_URL + "/prod/v2/carparkavailability"
export const GET_CARPARK_RATES_ENDPOINT ="https://objectstorage.ap-mumbai-1.oraclecloud.com/p/SYaAYt0Yy1AmEbMMUkZgzE6MIKG0N2HmsY1I3zofVfjY4WBn8VT8yf64isU0T0MT/n/bmgmubm43b7x/b/bucket-20210607-1304/o/carparkRatescar_LTA_sgcarmart.json"
export const INSERT_CARPARK_ENDPOINT = AWS_API_URL + "/prod/v2/carparkinsert"
export const LTA_QUERY_STRING = "LTA"
export const URA_QUERY_STRING = "URA"
export const PROJECTION_STRING = "+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs"
export const __DEV__ = false
export const NAV_BAR_HEIGHT = 55
// WGS84 bounds:
// 103.59 1.13
// 104.07 1.47

