# https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
from geopy.geocoders import Nominatim
import pandas as pd
import googlemaps
from datetime import datetime

sg_bounds = {
    "northeast" : {
        "lat" : 1.40027,
        "lng" : 104.051959
    },
    "southwest" : {
        "lat" : 1.25027,
        "lng" : 103.651959
    }
}

def geocodeGoogle(address,bounds=sg_bounds):
    gmaps = googlemaps.Client(key='ask me for my keys')
    try:
        geocode_result = gmaps.geocode(
            address,bounds=bounds)
    except Exception as e:
        print(e)
        return ''
    if len(geocode_result)==0:
        print(address)
        print('No result found')
        return ''
    return (str(geocode_result[0]['geometry']['location']['lat']) + ',' + str(geocode_result[0]['geometry']['location']['lng']))


def geocodeNominatim(address):
    geolocator = Nominatim(user_agent="Parkwhere")
    location = geolocator.geocode(address)
    print(str(location.latitude) + "," + str(location.longitude))



df = pd.read_csv('./sgbikeparking.csv', encoding='cp1252')
print(df.head())
df["Location"] = df["CarPark"].map(geocodeGoogle)
df.to_csv('./sgbikeparking_static_location.csv')