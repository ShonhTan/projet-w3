import React, { useState, useEffect } from 'react'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useFonts } from '@use-expo/font'
import { AppLoading } from 'expo'
import * as SecureStore from 'expo-secure-store'
import { useQuery } from "@apollo/react-hooks"
import gql from "graphql-tag"
import { useApolloClient } from "@apollo/react-hooks"

import FirstScreen from './views/login/firstScreen'
import Login from './views/login/login'
import OnboardingFirstStep from './views/login/onboarding/firstStep'
import OnboardingSecondStep from './views/login/onboarding/secondStep'
import OnboardingThirdStep from './views/login/onboarding/thirdStep'
import Home from './views/Home'
import Explore from './views/Explore'
import Place from './views/Explore/Place'
import Profile from './views/Profile'
import * as s from './styles'

import Header from './components/organismes/Header'
import TabBar from './components/organismes/TabBar'

import { CHECK_AUTH } from './graphql/auth'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const GET_LOCAL_STATE = gql`
  {
    isOnboarded @client
  }
`


export default function () {
  const client = useApolloClient()
  const { data: { isOnboarded } = {} } = useQuery(GET_LOCAL_STATE)
  const { data: { checkAuthApp: userData } = {} } = useQuery(CHECK_AUTH)
  const [ isLoaded ] = useFonts({
    Maragsa: require('./assets/fonts/Maragsa/Maragsâ.otf'),
    HKGrotesk: require('./assets/fonts/HK-Grotesk/HKGrotesk-Regular.otf'),
    HKGroteskSemiBold: require('./assets/fonts/HK-Grotesk/HKGrotesk-SemiBold.otf'),
  })
  // SecureStore.deleteItemAsync('isLoggedIn')
  // console.log({ isLoggedIn, isOnboarded })
  useEffect(() => {
    Promise.all([
      SecureStore.getItemAsync('isOnboarded'),
    ]).then(([ isOnboarded ]) => {
      client.writeData({ data: { isOnboarded } })
    })
  })

  if (!isLoaded) return <AppLoading />
  console.log(isOnboarded)
  console.log(userData)
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ header: Header }} headerMode='screen'>
        {isOnboarded && userData ? (
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        ) : (
          <>
            {!userData && !isOnboarded && <Stack.Screen name="FirstScreen" component={FirstScreen} options={{ animationTypeForReplace: 'pop' }} />}
            {!userData && <Stack.Screen name="Login" component={Login} />}
            <Stack.Screen name="OnboardingFirstStep" component={OnboardingFirstStep} />
            <Stack.Screen name="OnboardingSecondStep" component={OnboardingSecondStep} />
            <Stack.Screen name="OnboardingThirdStep" component={OnboardingThirdStep} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const Empty = () => null

function TabNavigator () {
  return (
    <Tab.Navigator tabBar={TabBar}>
      <Tab.Screen name="HomeNavigator" component={HomeNavigator} options={{ title: 'Accueil', icon: 'home-line' }} />
      <Tab.Screen name="ExploreNavigator" component={ExploreNavigator} options={{ title: 'Découvrir', icon: 'map-2-line', header: Header }} />
      <Tab.Screen name="Challenges" component={Empty} options={{ title: 'Défis', icon: 'award-line' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profil', icon: 'apps-2-line' }} />
    </Tab.Navigator>
  )
}

function ExploreNavigator () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Explore" component={Explore} />
      <Stack.Screen name="Place" component={Place} />
    </Stack.Navigator>
  )
}

function HomeNavigator () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Place" component={Place} />
    </Stack.Navigator>
  )
}

// console.disableYellowBox = true