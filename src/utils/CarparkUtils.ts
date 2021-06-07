import proj4 from 'proj4'
import { PROJECTION_STRING } from '../constants/Constants'
import * as  _ from 'lodash'
import { Carpark,CarparkKeys, CarparkAvailabilityLTA, CarparkRatesLTA, CarparkRatesURA } from '../models/Carpark'

const missingRatesKeys = [
  'WeekDays_Rate_1',
  'WeekDays_Rate_2',
  'Saturday_Rate',
  'Sunday_PublicHoliday_Rate'
]

function parseLTALocation(location){
  if(location.includes(',')){ //rates api has comma
    return location
  }
  return parseFloat(location.split(' ')[0]).toFixed(5) + ',' + parseFloat(location.split(' ')[1]).toFixed(5)
}

function transformLTARatesToCarpark(v: CarparkRatesLTA): Carpark{
  v['Agency'] = 'LTA' // will be overwritten by update should change in api
  v['CarparkID'] = v['CarPark']
  v['CarparkName']=v['CarparkID']
  v['Location'] = parseLTALocation(v['Location'])
  v['vehCat'] = 'C'
  v['AvailableLots'] = '-'
  var cp:Carpark = _.pick(v, CarparkKeys)
  return cp
}

function writeHDBRates(v){
  if(v['Agency']=='HDB'){
    v['WeekDays_Rate_1'] = 'Cars: $0.60 per 30min from 7.00am to 10.30pm\nMotorcycles: $0.65 whole day from 7.00am to 10.30pm'
    v['WeekDays_Rate_2']= 'Cars: $0.60 per 30min, capped at $5.00 from 10.30pm to 7.00am\nMotorcycles: $0.65 whole night from 10.30pm to 7.00am'
    v['Saturday_Rate'] = 'Same as weekday'
    v['Sunday_PublicHoliday_Rate'] = 'Free'
  }
  return v
}

export function innerJoinAvailabilityRatesLTA(availability:CarparkAvailabilityLTA[], rates:CarparkRatesLTA[]) {
  let currentCarparks:Carpark[] = rates.map(v => transformLTARatesToCarpark(v))
  let carparks:Carpark[] = updateAvailabilityLTA(availability,currentCarparks) 
  return carparks.map(v=>writeHDBRates(v)) //decide whether to change hdb description
}


export function parseMotorcycletoCarparks(availability:CarparkAvailabilityLTA[],rates:CarparkRatesLTA[]){
  function motorcycleTransformToCarpark(v){
    v['CarparkID'] = v['CarPark']
    v['CarparkName'] = v['CarparkID']
    v['Agency'] = 'LTA'
    v['vehCat'] = 'M'
    v['AvailableLots'] = '-'
    if(v['Free']==true){
      missingRatesKeys.map(k => {v[k]='Free'})
    }
    else if(v['Free']==null){
      missingRatesKeys.map(k => {v[k]='Motorcycles cannot park here'})
    }
    var cp:Carpark = _.pick(v, [...CarparkKeys,'Free'])
    return cp
  }
  let carparks:Carpark[] = rates.map(v => motorcycleTransformToCarpark(v))
  return updateAvailabilityLTA(availability, carparks)
}

function dateObj(d) { // date parser ...
  var parts = d.split(/.|\s/),
    date = new Date();
  if (parts.pop().toLowerCase() == 'pm') parts[0] = (+parts[0]) + 12;
  date.setHours(+parts.shift());
  date.setMinutes(+parts.shift());
  return date;
}

const parseRateDescriptionReducer = function parseRateDescription(initrate, rate) {
  initrate['ppCode'] = rate['ppCode']
  initrate['ppName'] = rate['ppName']
  initrate['geometries'] = rate['geometries']
  initrate['vehCat'] = rate['vehCat']
  
  var startDate = dateObj(rate['startTime']); // get date objects
  var endDate = dateObj(rate['endTime']);
  if (startDate > endDate) { // check if start comes before end
    var temp = startDate; // if so, assume it's across midnight
    startDate = endDate;   // and swap the dates
    endDate = temp;
  }
  const START_MORNING_AFTERNOON = dateObj("07.00 AM")
  const END_MORNING_AFTERNOON = dateObj("06.00 PM")

  function getPriceDescription(price, period, startTime, endTime) {
    const priceDescription = `${price}/${period} from ${startTime} to ${endTime}\n`
    return priceDescription
  }
  if (startDate > START_MORNING_AFTERNOON && endDate < END_MORNING_AFTERNOON) {
    initrate["WeekDays_Rate_1"] += getPriceDescription(rate["weekdayRate"], rate["weekdayMin"], rate["startTime"], rate["endTime"])
  }
  else if (startDate > END_MORNING_AFTERNOON && endDate < START_MORNING_AFTERNOON) {
    initrate["WeekDays_Rate_2"] += getPriceDescription(rate["weekdayRate"], rate["weekdayMin"], rate["startTime"], rate["endTime"])
  }
  else {
    initrate["WeekDays_Rate_1"] += getPriceDescription(rate["weekdayRate"], rate["weekdayMin"], rate["startTime"], rate["endTime"])
    initrate["WeekDays_Rate_2"] += getPriceDescription(rate["weekdayRate"], rate["weekdayMin"], rate["startTime"], rate["endTime"])
  }
  initrate["Saturday_Rate"] += getPriceDescription(rate["satdayRate"], rate["satdayMin"], rate["startTime"], rate["endTime"])
  initrate["Sunday_PublicHoliday_Rate"] += getPriceDescription(rate["sunPHRate"], rate["sunPHMin"], rate["startTime"], rate["endTime"])
  return initrate
}

function parseURALocation(geometries) {
  let geometry = geometries[0]
  let northing = geometry["coordinates"].split(',')[0]
  let easting = geometry["coordinates"].split(',')[1]
  proj4.defs("EPSG:3414", PROJECTION_STRING);
  var resultLonLat = proj4("EPSG:3414").inverse([parseFloat(northing), parseFloat(easting)]);
  return parseFloat(resultLonLat[1].toFixed(5)) + ',' + parseFloat(resultLonLat[0].toFixed(5))
}


function transformURARatesToCarpark(v: CarparkRatesURA): Carpark{
  v['Agency']='URA'
  v['CarparkID'] = v['ppCode'];
  v['CarparkName']=v['ppName']
  v['Location'] = parseURALocation(v['geometries'])
  v['AvailableLots'] = '-'
  var cp:Carpark = _.pick(v, CarparkKeys)
  return cp
}

// transform rates to Carparks, filter unmatching availability carparks, transform and add those
export function innerJoinAvailabilityRatesURA(availabilityURA, ratesURA){
  var groupedRates = _.groupBy(ratesURA,'ppCode')
  Object.keys(groupedRates).forEach(key => {groupedRates[key] = groupedRates[key].reduce(parseRateDescriptionReducer,{
    WeekDays_Rate_1: '',
    WeekDays_Rate_2: '',
    Saturday_Rate: '',
    Sunday_PublicHoliday_Rate: ''
  })});
  let currentCarparks:Carpark[] = _.chain(groupedRates).values().map(v => transformURARatesToCarpark(v)).value()
  return updateAvailabilityURA(availabilityURA,currentCarparks)
}

function transformLTAAvailabilityToCarpark(v){
  v['CarparkID']=v['Development'];
  v['CarparkName']=v['CarparkID']
  v['VehCat']=v['LotType'];
  v['Location'] = parseLTALocation(v['Location'])
  missingRatesKeys.forEach(key => {if(!v.hasOwnProperty(key)){v[key]='-'}});
  return _.pick(v,CarparkKeys)
}

//seperate new availability carparks, merge with existing carparks, transform and add new availability carparks to carparks
export function updateAvailabilityLTA(availability:CarparkAvailabilityLTA[], carparkData: Carpark[]) {
  var currentCarparkDataDict = _.keyBy( carparkData, 'CarparkID')
  var availabilityDict = _.keyBy(availability, 'Development')
  const newKeys = Object.keys(availabilityDict).filter( key => !(key in currentCarparkDataDict));
  // if there are new carparks
  if(Object.keys(availabilityDict).length>newKeys.length && Object.keys(availabilityDict).length!=0){
    var merged = _.merge(currentCarparkDataDict,_.keyBy(_.chain(availabilityDict).omit(newKeys).values().map(v =>{ 
      v['CarparkID']=v['Development'];
      return _.pick(v,['AvailableLots','CarparkID','Agency'])}).
      value(),'CarparkID')); // left join only
    var values = _.values(merged); 
    values.push(..._.chain(availabilityDict).pick(newKeys).values().map(v => transformLTAAvailabilityToCarpark(v)).value())
    return values
  }
  return carparkData
}

function transformURAAvailabilityToCarpark(v){
  v['CarparkID']=v['carparkNo'];
  v['AvailableLots']=v['lotsAvailable'];
  v['Location']=parseURALocation(v['geometries'])
  v['VehCat']=v['lotsType'];
  v['Agency']='URA'
  v['CarparkName'] = v['CarparkID']
  missingRatesKeys.forEach(key => {if(!v.hasOwnProperty(key)){v[key]='-'}});
  return _.pick(v,CarparkKeys)
}

//seperate new availability carparks, merge with existing carparks, transform and add new availability carparks to carparks
export function updateAvailabilityURA(availability, carparkData) {
  var currentCarparkDataDict = _.keyBy( carparkData, 'CarparkID')
  var availabilityDict = _.keyBy(availability, 'carparkNo')
  const newKeys = Object.keys(availabilityDict).filter( key =>!(key in currentCarparkDataDict));

  if(Object.keys(availabilityDict).length>=newKeys.length && Object.keys(availabilityDict).length!=0){
    var merged = _.merge(currentCarparkDataDict,_.keyBy(_.chain(availabilityDict).omit(newKeys).values().map(v =>{ 
      v['CarparkID']=v['carparkNo'];
      v['AvailableLots']=v['lotsAvailable'];
      return _.pick(v,['AvailableLots','CarparkID'])}).
      value(),'CarparkID')); // left join only
    var values = _.values(merged); 
    var newAvailabilityCarparks = _.chain(availabilityDict).pick(newKeys).values().map(v => transformURAAvailabilityToCarpark(v)).value()
    values.push(...newAvailabilityCarparks)
    return values
  }
  return carparkData
}