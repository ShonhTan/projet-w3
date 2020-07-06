import React from 'react'
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native'
import { useQuery, useMutation } from "@apollo/react-hooks"
import { useApolloClient } from "@apollo/react-hooks"
import * as SecureStore from 'expo-secure-store'
import Constants from 'expo-constants'
import { CommonActions } from '@react-navigation/native'

import { GET_PLACES, DELETE_PLACE, UPSERT_PLACES } from "../../graphql/place"
import { CHECK_AUTH } from "../../graphql/auth"

import Button from "../../components/atoms/Button"
import Input from "../../components/atoms/Input"
import CardAddress from "../../components/organismes/CardAddress"
import * as s from '../../styles'

/* Page profil */
export default function Profile ({ navigation }) {
  const client = useApolloClient()
  const { data: { checkAuthApp: userData } = {} } = useQuery(CHECK_AUTH)
  // console.log(userData)
  return (
    <ScrollView style={[ s.flex, s.backgroundPale ]} contentContainerStyle={[  ]} stickyHeaderIndices={[0]}>
      
     <View>
      <View style={[ s.backgroundPale, s.flex, s.p2, s.pt3 ]}>
        <Button
          btnStyle="icon"
          iconName="arrow-left-line"
          onPress={navigation.goBack}
        />
        <View style={[ s.flex ]}>
          <Text style={[ s.heading4, s.mt1 ]}>
            { `${userData?.firstName} ${userData?.lastName}` }
          </Text>
          {/* <Text style={[ s.body2 ]}>
            { `${userData?.company?.name}` }
          </Text> */}
        </View>
      </View>
     </View>

      <Text style={[s.heading5, s.px2, s.mb05, s.mt2]}>
        Paramètres
      </Text>
      <TouchableOpacity activeOpacity={1} style={[ s.mt1, s.p2, s.mx2, s.backgroundWhite, s.roundTop2, { borderWidth: 0, borderColor: s.c.bg } ]}
        onPress={async () => {
          await SecureStore.deleteItemAsync('authToken')
          client.writeData({ data: { checkAuthApp: null } })  
          navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [ { name: 'Login' } ],
          }))
        }}
      >
        <Text style={[ s.body1 ]}>Déconnexion</Text>
      </TouchableOpacity>
            
      <TouchableOpacity activeOpacity={1} style={[ s.p2, s.mx2, s.backgroundWhite, s.roundBottom2, { borderBottomWidth: 0, borderColor: s.c.bg } ]}
        onPress={async () => {
          await SecureStore.deleteItemAsync('isOnboarded')
          await SecureStore.deleteItemAsync('authToken')
          client.writeData({ data: { checkAuthApp: null, isOnboarded: false } })
          navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [ { name: 'FirstScreen' } ],
          }))
        }}
      >
        <Text style={[ s.body1 ]}>Réinitialiser</Text>
      </TouchableOpacity>
     
      <Text style={[ s.body2, s.grey, s.p2, s.center ]}>Version {Constants.manifest.version}</Text>
    </ScrollView>
  )
}
