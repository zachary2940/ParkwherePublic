import React, { useState, useEffect, useRef, useContext, } from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Card, TextInput, Title, Paragraph, Divider, Subheading, Avatar } from 'react-native-paper';
import RateItem from './RateItem';
import { useIsFocused } from "@react-navigation/native";
import * as Yup from 'yup';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { insertCarpark } from "../utils/APIUtils";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheetContext } from '../contextProviders/BottomSheetContext'


const CarparkInputForm = props => {
  // const BottomSheetContextValue = useContext(BottomSheetContext)
  const REPORTED_CARPARKS = 'REPORTED_CARPARKS'
  const REPORT_INTERVAL = 60000 * 60

  const [submitSecurityPass, setSubmitSecurityPass] = useState(false)

  async function checkLastReport(carparkID, isSubscribed) {
    try {
      if (isSubscribed) {
        let reportedCarparks = await AsyncStorage.getItem(REPORTED_CARPARKS)
        if (reportedCarparks == null) {
          await AsyncStorage.setItem(REPORTED_CARPARKS, JSON.stringify({}))
          console.log('Report store initialised')
          setSubmitSecurityPass(true)
          return
        }
        let reportedCarparksDictionary = JSON.parse(reportedCarparks)
        if (carparkID in reportedCarparksDictionary) {
          if (Date.now() - reportedCarparksDictionary[props.carpark.CarparkID] > REPORT_INTERVAL) {
            setSubmitSecurityPass(true)
          }
        }
        else {
          setSubmitSecurityPass(true)
        }
      }
    }
    catch (e) {
      console.log(e)
    }
  }


  const [count, setCount] = useState(0)
  const updateCount = () => setCount(count + 1)

  const initialRateItemInputs = {
    id: count,
    price1: null,
    price2: null,
    timeAmount1: null,
    timeAmount2: null,
    timeUnit1: 'min',
    timeUnit2: 'min',
    startTime: null,
    endTime: null,
    dayUnit: 'weekday'
  }

  const [rateItemInputs1, setRateItemInputs1] = useState([initialRateItemInputs])
  const [rateItemInputs2, setRateItemInputs2] = useState([initialRateItemInputs])

  const updateRateItemInputs1 = (rateItemInputs, id) => {
    setRateItemInputs1(rateItemInputs1.map(el => { if (el.id == id) { el = rateItemInputs }; return el }))
  }

  const updateRateItemInputs2 = (rateItemInputs, id) => {
    setRateItemInputs2(rateItemInputs2.map(el => { if (el.id == id) { el = rateItemInputs }; return el }))
  }

  const handleDeleteItem1 = id => {
    setRateItemInputs1(rateItemInputs1.filter(el => el.id != id))
  };

  const handleDeleteItem2 = id => {
    setRateItemInputs2(rateItemInputs2.filter(el => el.id != id))
  };

  const handleAddItemRateFormat1 = event => {
    setRateItemInputs1(rateItemInputs1.concat({ ...initialRateItemInputs, id: count + 1 }))
    updateCount()
  };

  const handleAddItemRateFormat2 = event => {
    setRateItemInputs2(rateItemInputs2.concat({ ...initialRateItemInputs, id: count + 1 }))
    updateCount()
  };


  useEffect(() => {
    let isSubscribed = true
    navigation.setParams({
      inputCoordinates: '',
    })
    setRateItemInputs1([initialRateItemInputs])
    setRateItemInputs2([initialRateItemInputs])
    checkLastReport(props.carpark.CarparkID, isSubscribed)
    return () => (isSubscribed = false)
  }, [props.carpark])


  const navigation = useNavigation();
  const route = useRoute();

  function navigateToLocationPicker() {
    navigation.navigate("LocationPicker",
      { currRegion: props.currRegion });
  }

  const AddButton = (props) => (
    rateItemInputs1.length + rateItemInputs2.length > 10 ? <Text style={{ alignSelf: 'center' }}>Maximum of 10 entries reached</Text> :
      <TouchableOpacity
        style={{ alignSelf: "center" }}
        hitSlop={{ x: 10, y: 10 }}
        onPress={props.handleAddItem}>
        <Avatar.Text size={28} label="+" />
      </TouchableOpacity>)

  function dateObj(d) { // date parser ...
    var parts = d.split(':'),
      date = new Date();
    date.setHours(parts[0]);
    date.setMinutes(parts[1]);
    return date;
  }

  function parseToCarpark(values) {
    const carpark = { ...props.carpark }
    if (values.location != '') {
      carpark.Location = values.location
    }

    function createRateString1(rate) {
      return `$${parseInt(rate.price1).toFixed(2)} per ${rate.timeAmount1}${rate.timeUnit1} from ${rate.startTime} to ${rate.endTime}`
    }

    function createRateString2(rate) {
      return `$${parseInt(rate.price1).toFixed(2)} for 1st ${rate.timeAmount1}${rate.timeUnit1},
       $${parseInt(rate.price2).toFixed(2)} for subsequent ${rate.timeAmount2}${rate.timeUnit2} 
      from ${rate.startTime} to ${rate.endTime}`
    }

    function parseRates(rate, createRateString) {
      if (rate.dayUnit == 'saturday') {
        carpark.Saturday_Rate = createRateString(rate)
      }
      else if (rate.dayUnit == 'sunday/p.h.') {
        carpark.Sunday_PublicHoliday_Rate = createRateString(rate)
      }
      var startDate = dateObj(rate['startTime']); // get date objects
      var endDate = dateObj(rate['endTime']);
      if (startDate > endDate) { // check if start comes before end
        var temp = startDate; // if so, assume it's across midnight
        startDate = endDate;   // and swap the dates
        endDate = temp;
      }
      const START_MORNING_AFTERNOON = dateObj("07:00")
      const END_MORNING_AFTERNOON = dateObj("18:00")
      if (startDate > START_MORNING_AFTERNOON && endDate < END_MORNING_AFTERNOON) {
        carpark.WeekDays_Rate_1 = createRateString(rate)
      }
      else if (startDate > END_MORNING_AFTERNOON && endDate < START_MORNING_AFTERNOON) {
        carpark.WeekDays_Rate_2 = createRateString(rate)
      }
      else {
        carpark.WeekDays_Rate_1 = createRateString(rate)
      }
    }
    rateItemInputs1.map((rate) => parseRates(rate, createRateString1))
    rateItemInputs2.map((rate) => parseRates(rate, createRateString2))
    // console.log(carpark)
    insertCarpark(carpark)
  }

  async function setReportTime(carparkID) {
    try {
      let reportedCarparks = await AsyncStorage.getItem(REPORTED_CARPARKS)
      if (reportedCarparks == null) {
        await AsyncStorage.setItem(REPORTED_CARPARKS, JSON.stringify({ carparkID: Date.now() }))
        console.log('Report store initialised')
      }
      else {
        let reportedCarparksDictionary = JSON.parse(reportedCarparks)
        reportedCarparksDictionary[carparkID] = Date.now()
        await AsyncStorage.setItem(REPORTED_CARPARKS, JSON.stringify(reportedCarparksDictionary))
      }
      setSubmitSecurityPass(false)
    }
    catch (e) {
      console.log(e)
    }
  }

  const [errors, setErrors] = useState({ err1: false, err2: false })

  let schema1 = Yup.array().of(Yup.object().shape({
    id: Yup.number().required(),
    price1: Yup.string().required(),
    price2: Yup.string().nullable(true),
    timeAmount1: Yup.string().required(),
    timeAmount2: Yup.string().nullable(true),
    timeUnit1: Yup.string().required(),
    timeUnit2: Yup.string().nullable(true),
    startTime: Yup.string().required(),
    endTime: Yup.string().required(),
    dayUnit: Yup.string().required()
  }));

  let schema2 = Yup.array().of(Yup.object().shape({
    id: Yup.number().required(),
    price1: Yup.string().required(),
    price2: Yup.string().required(),
    timeAmount1: Yup.string().required(),
    timeAmount2: Yup.string().required(),
    timeUnit1: Yup.string().required(),
    timeUnit2: Yup.string().required(),
    startTime: Yup.string().required(),
    endTime: Yup.string().required(),
    dayUnit: Yup.string().required()
  }));

  const [submitted, setSubmitted] = useState(false)
  const [locationErr, setLocationErr] = useState(false)

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        location: route.params?.inputCoordinates ? route.params.inputCoordinates : '',
        // rateItemInputs1: rateItemInputs1,
        // rateItemInputs2: rateItemInputs2,
      }}
      // validationSchema={ }
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true)
        if (values.location == '' && rateItemInputs1.length == 0 && rateItemInputs1.length == 0) {
          setLocationErr(true)
          setSubmitting(false)
          return
        }
        Promise.all([schema1.isValid(rateItemInputs1),
        schema2.isValid(rateItemInputs2)]).then((val) => {
          if (val[0] && val[1]) {
            setErrors({ err1: false, err2: false })
            setLocationErr(false)
            parseToCarpark(values)
            setSubmitting(false)
            setReportTime(props.carpark.CarparkID)
            setSubmitted(true)
            setTimeout(() => {
              setSubmitted(false)
            }, 1000);
          }
          else {
            setErrors({ err1: !val[0], err2: !val[1] })
            setSubmitting(false)
          }
        });
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, isSubmitting }) => (
        <View>
          <View style={{
            flexDirection: "row",
          }}>
            <TouchableOpacity style={{ marginRight: 15 }}
              onPress={() => props.stopReport()}>
              <Feather name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Title style={{ textTransform: 'capitalize',margin:20 }}>Report Carpark: {props.carpark.CarparkName.toLowerCase()}</Title>
          </View>
          <View style={{
            flexDirection: "column",
            paddingHorizontal: 15,
            paddingBottom: 10,
          }}>
            <Divider style={{ marginVertical: 5 }} />
            <Subheading>Location</Subheading>
            {locationErr ?
              <Text style={{ color: 'red' }}>
                Either Location or Rates must be filled
              </Text> : null}
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                title="location"
                onChangeText={handleChange('location')}
                onBlur={handleBlur('location')}
                value={values.location}
                style={{ height: 35, flex: 1, marginRight: 20 }}
                disabled={true}
              />
              <Button style={{ marginRight: 10 }} mode="contained"
                onPress={() => navigateToLocationPicker()}>
                <Feather name="map-pin" size={18} color="white" />
              </Button>
              {/* <Button mode="contained"
                onPress={() => { setFieldValue('location', '') }}>
                <Feather name="delete" size={18} color="white" />
              </Button> */}
            </View>
            <Divider style={{ marginVertical: 10 }} />
            <Subheading>Rates Format 1</Subheading>
            {errors.err1 ?
              <Text style={{ color: 'red' }}>
                All fields have to be filled
              </Text> : null}
            {rateItemInputs1.map((item, i) => <RateItem
              handleDelete={handleDeleteItem1}
              inputFormat={'1'}
              id={item.id}
              key={item.id}
              rateItemInputs={item}
              updateRateItemInputs={updateRateItemInputs1} />)}
            <AddButton handleAddItem={handleAddItemRateFormat1}></AddButton>
            <Subheading>Rates Format 2</Subheading>
            {errors.err2 ?
              <Text style={{ color: 'red' }}>
                All fields have to be filled
              </Text> : null}
            {rateItemInputs2.map((item, i) => <RateItem
              handleDelete={handleDeleteItem2}
              inputFormat={'2'}
              id={item.id}
              key={item.id}
              rateItemInputs={item}
              updateRateItemInputs={updateRateItemInputs2} />)}
            <AddButton handleAddItem={handleAddItemRateFormat2}></AddButton>
            <Divider style={{ marginVertical: 10 }} />
            <Button
              mode="contained"
              onPress={handleSubmit}
              title="Submit"
              disabled={isSubmitting || !submitSecurityPass}
              color={submitted ? 'green' : null}
            >
              {submitted ? <Feather name="check" size={18} color="white" /> : 'Submit'}
            </Button>
            {!submitSecurityPass ?
              <Text style={{ color: 'black' }}>
                Please wait awhile before submitting again
              </Text> : null}
          </View>
        </View>
      )}
    </Formik>
  );
}

export default CarparkInputForm