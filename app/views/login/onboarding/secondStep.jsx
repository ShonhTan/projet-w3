import React, { useState } from 'react'
import { View, ScrollView, Text, Image } from 'react-native'
import { useApolloClient, useMutation, useQuery } from "@apollo/react-hooks"
import * as SecureStore from 'expo-secure-store'

import Filter from "../../../components/atoms/Filter"
import Steps from "../../../components/atoms/Steps"
import Button from "../../../components/atoms/Button"
import IllustrationOnboarding from "../../../assets/img/illu-onboarding.svg"
import * as s from "../../../styles/index"

import { SET_TAGS_TO_USER } from '../../../graphql/user'
import { CHECK_AUTH } from '../../../graphql/auth'

export default function OBSecondStep ({ navigation }) {
  const client = useApolloClient()
  const { data: { checkAuthApp: userData } = {} } = useQuery(CHECK_AUTH)

  const [filterList, setFilterList] = useState([
    { label: 'Casher' },
    { label: 'Halal' },
    { label: 'Sans-gluten' },
    { label: 'Vegan' },
    { label: 'Végétarien' },
    { label: 'Pas de restrictions', isUnique: true }
  ])

  const [setTagsToUser, { loading }] = useMutation(SET_TAGS_TO_USER, {
    onCompleted: async res => {
      navigation.navigate('OnboardingThirdStep')
    },
    onError: error => console.log(error.message),
  })

  const onSubmit = async () => {
    if (!filterList.some(item => item.selected)) {
      setFilterList(filterList.map(item => ({ ...item, selected: item.isUnique })))
    }
    setTagsToUser({ variables: {
      userId: userData.id,
      tags: filterList.filter(item => item.selected && !item.isUnique).map(item => item.label)
    }})
  }

  return (
    <View style={[ s.flex, s.backgroundPale ]}>
      <IllustrationOnboarding style={[ s.absolute, s.top, s.right ]} width={200} height={300} />
      <ScrollView contentContainerStyle={[ s.flex, s.p2, s.justifyCenter ]}>
        <Text style={[ s.heading1, s.center, s.mtAuto, s.mb1, s.pt4 ]}>
          Votre régime alimentaire
        </Text>
        <Text style={[ s.body1, s.center, s.mb3, s.selfCenter, { maxWidth: 320 } ]}>
          Nous vous proposerons des adresses respectant votre régime alimentaire
        </Text>
        <Filter filterList={filterList} setFilterList={setFilterList} numbColumns={3} />
        <Steps length={3} currentStep={2} style={[ s.mtAuto, s.mb2 ]} />
        <Button btnStyle='primary' label='Continuer' onPress={onSubmit} style={[ s.mb1 ]} />
        <Button btnStyle='secondary' label='Passer' onPress={async () => {
          await SecureStore.setItemAsync('isOnboarded', 'true')
          client.writeData({ data: { isOnboarded: true } })
        }} />
      </ScrollView>
    </View>
  )
}
