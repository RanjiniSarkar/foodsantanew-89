import React from 'react';
import {View,Text} from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {AppTabNavigator} from './components/AppTabNavigator';

import {createDrawerNavigator} from 'react-navigation-drawer';
import SettingScreen from './screens/SettingScreen'
import CustomSideBarMenu from './components/CustomSideBarMenu';
import MyFoodDonationScreen from './screens/MyFoodDonationScreen';
import MyRecipeDonationScreen from './screens/MyRecipeDonationScreen'
import NotificationScreen from './screens/NotificationScreen';
import {Icon} from 'react-native-elements'




export default function App (){

    return(

      <AppContainer/>
      
     
      
    )
    
  }
  export const AppDrawerNavigator = createDrawerNavigator({
    Home:{
        screen:AppTabNavigator,
        navigationOptions:{
          drawerIcon:<Icon name = "home" type = "fontawesome5"/>
        }
    },
    Settings:{
      screen:SettingScreen,
      navigationOptions:{
        drawerIcon:<Icon name = "settings" type = "font-awesome"/>,
        drawerLabel: "Settings"
      }
    },
    MyFoodDonations:{
      screen:MyFoodDonationScreen,
      navigationOptions:{
        drawerIcon:<Icon name = "gift" type = "font-awesome"/>,
        drawerLabel:"My Food Donations"

      }
    },
    MyRecipeDonations:{
      screen: MyRecipeDonationScreen,
      navigationOptions:{
        drawerIcon:<Icon name = "gift" type = "font-awesome"/>,
        drawerLabel:"My Recipe Donations"      }
    },
    Notifications:{
      screen:NotificationScreen,
      navigationOptions:{
        drawerIcon:<Icon name = "bell" type = "font-awesome"/>,
        drawerLabel:"Notifications"
      }
    }
},
{
    contentComponent:CustomSideBarMenu
},
{
    initialRouteName:'Home'
})

const switchNavigator = createSwitchNavigator({
  WelcomeScreen:{screen:WelcomeScreen},
AppDrawerNavigator:AppDrawerNavigator
  
})


const AppContainer = createAppContainer(switchNavigator)