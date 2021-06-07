import React,{useState} from "react";
import { NavigationContainer } from '@react-navigation/native';
import MapScreenStack from '../pages/MapScreenStack.tsx'
import BookmarkScreen from '../pages/BookmarkScreen.js'
import SettingsScreen from '../pages/SettingsScreen.js'
import NearestCarparksScreen from '../pages/NearestCarparksScreen.js'
import Test from '../pages/Test.js'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { NAV_BAR_HEIGHT } from "../constants/Constants.js";

const Tab = createMaterialBottomTabNavigator();

function Navigation(props) {

  const [bookmarksChanged,setBookmarksChanged] = useState(false)

  const changeBookmarks = () => {
    setBookmarksChanged(!bookmarksChanged);
   };

  screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Bookmark') {
        iconName = 'md-bookmark';
      } else if (route.name === 'Map') {
        iconName = 'md-map';
      }
      else if (route.name === 'Nearest') {
        iconName = 'md-locate';
      }
      else if (route.name === 'Settings') {
        iconName = 'md-cog';
      }
      // else if (route.name === 'Test') {
      //   iconName = 'md-cog';
      // }

      return <Ionicons name={iconName} size={20} color={color} />;
    },
  })

  tabBarOptions = {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        barStyle={{ backgroundColor: '#ffff',height:NAV_BAR_HEIGHT }}
        screenOptions={screenOptions}
        tabBarOptions={tabBarOptions}>
        <Tab.Screen name="Map" children={() => (<MapScreenStack changeBookmarks={changeBookmarks}/>)} />
        <Tab.Screen name="Bookmark" children={() => (<BookmarkScreen bookmarksChanged={bookmarksChanged} changeBookmarks={changeBookmarks}/>)}/>
        <Tab.Screen name="Nearest" component={NearestCarparksScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        {/* <Tab.Screen name="Test" component={Test} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
