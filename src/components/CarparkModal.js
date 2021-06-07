import React from 'react'
import { ScrollView, View } from 'react-native'
import { Subheading, Title, useTheme, Divider, Button } from 'react-native-paper'
import styles from '../styles/CustomModal.styles'
import { openMaps, parseLat, parseLong } from '../utils/MapUtils'

const CarparkModal = ({ item }) => {
  const { colors } = useTheme()
  const {
    CarparkID,
    AvailableLots,
    WeekDays_Rate_1,
    WeekDays_Rate_2,
    Saturday_Rate,
    Sunday_PublicHoliday_Rate,
    Location } = item

  return (
    <ScrollView
      style={styles.scrollView}
      persistentScrollbar={true}
      contentContainerStyle={[styles.scrollViewContent, { backgroundColor: colors.surface }]}
    >
      <Title>{CarparkID}</Title>
      <View style={styles.sectionContainer}>
        <Subheading>Available Lots: </Subheading>
        <Subheading>{AvailableLots}</Subheading>
      </View>
      <Divider style={{ marginVertical: 5 }} />
      <Button onPress={() => openMaps(parseLat(item), parseLong(item))}>Open Map</Button>
      <Divider style={{ marginVertical: 5 }} />
      <View style={styles.sectionContainer}>
        <Subheading>Weekday Morning/Afternoon: </Subheading>
        <Subheading>{WeekDays_Rate_1}</Subheading>
      </View>
      <View style={styles.sectionContainer}>
        <Subheading>Weekday Night: </Subheading>
        <Subheading>{WeekDays_Rate_2}</Subheading>
      </View>
      <View style={styles.sectionContainer}>
        <Subheading>Saturday Rate: </Subheading>
        <Subheading>{Saturday_Rate}</Subheading>
      </View>
      <View style={styles.sectionContainer}>
        <Subheading>Sunday/Public Holiday Rate: </Subheading>
        <Subheading>{Sunday_PublicHoliday_Rate}</Subheading>
      </View>
    </ScrollView>
  )
}

// CarparkModal.propTypes = {
//   theme: propTypes.themePropTypes,
//   item: shape({
//     name: string,
//     description: string,
//     image: string,
//     currentPrice: number,
//     marketCap: number,
//   }),
// }

export default CarparkModal