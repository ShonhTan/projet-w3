import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Text, FlatList, Platform, TouchableOpacity } from 'react-native'
import { useQuery, useMutation } from "@apollo/react-hooks"
import BottomSheet from 'reanimated-bottom-sheet'

import { GET_PLACES, DELETE_PLACE, UPSERT_PLACES } from "../../graphql/place"
import { categories, categoryIcons } from '../../utils/wording'

import Button from "../../components/atoms/Button"
import Input from "../../components/atoms/Input"
import Icon from "../../components/atoms/Icon"
import CardAddress, { CardAddressSkeleton } from "../../components/organismes/CardAddress"
import * as s from '../../styles'


export default function Explore ({ navigation }) {
  const [ category, setCategory ] = useState('FOOD')

  const { data: { getPlaces = [] } = {}, loading, error } = useQuery(GET_PLACES, {
    onError: error => console.log(error.message),
    variables: {
      where: {
        category
      },
      nearby: {
        coordinates: [48.8518269, 2.4204598] // HETIC
      }
    },
  })
  // console.log(getPlaces)

  return (
    <View style={[ s.flex, s.backgroundPale ]}>
      <FlatList
        ListHeaderComponent={() => (
          <View style={[ s.backgroundPale, s.p2, s.pt3 ]}>
            <Text style={[ s.body2, s.grey ]}>Restaurants</Text>
            <Text style={[ s.heading4 ]}>
              À proximité de <Text style={[ s.primary ]}>Hetic</Text>
            </Text>
          </View>
        )}
        stickyHeaderIndices={[0]}
        data={getPlaces}
        renderItem={({ item, index }) => (
          <CardAddress full place={item} style={[ s.mx2, s.mb2 ]} onPress={() => navigation.navigate('Place', { place: item })} />
        )}
        ListEmptyComponent={() => <CardAddressSkeleton full style={[ s.mx2 ]} />}
        ListFooterComponent={() => <View style={[ { height: 80 } ]} />}
        keyExtractor={item => item.id}
      />
      <BottomSheet
        snapPoints={[400, 52]}
        initialSnap={1}
        renderHeader={() => (
          <View style={[ s.backgroundWhite, s.pt1, { borderTopLeftRadius: 16, borderTopRightRadius: 16 } ]}>
            <View style={[ s.backgroundBlack, { width: 32, height: 2 }, s.rounded, s.selfCenter ]} />
            <ScrollView horizontal style={[ s.py1, { borderBottomWidth: 1, borderColor: s.c.bg } ]} contentContainerStyle={[ s.px2 ]} scrollEnabled={true}>
              <TouchableOpacity style={[ s.row, s.itemsCenter, s.my05 ]} onPress={() => setCategory()} activeOpacity={1}>
                <Text style={[ s.body2, s.bold, !category && s.primary, s.mr2 ]}>Tout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[ s.row, s.itemsCenter, s.my05 ]} onPress={() => setCategory('FOOD')} activeOpacity={1}>
                <Icon name={categoryIcons['FOOD']} size={14} color={category === 'FOOD' ? s.primary.color : s.black.color} style={[ s.mr05 ]} />
                <Text style={[ s.body2, s.bold, category === 'FOOD' && s.primary, s.mr2 ]}>{categories['FOOD']}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[ s.row, s.itemsCenter, s.my05 ]} onPress={() => setCategory('SHOP')} activeOpacity={1}>
                <Icon name={categoryIcons['SHOP']} size={14} color={category === 'SHOP' ? s.primary.color : s.black.color} style={[ s.mr05 ]} />
                <Text style={[ s.body2, s.bold, category === 'SHOP' && s.primary, s.mr2 ]}>{categories['SHOP']}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[ s.row, s.itemsCenter, s.my05 ]} onPress={() => setCategory('ACTIVITY')} activeOpacity={1}>
                <Icon name={categoryIcons['ACTIVITY']} size={14} color={category === 'ACTIVITY' ? s.primary.color : s.black.color} style={[ s.mr05 ]} />
                <Text style={[ s.body2, s.bold, category === 'ACTIVITY' && s.primary ]}>{categories['ACTIVITY']}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
        renderContent={() => (
          <View style={[ s.backgroundWhite ]}>
            <View style={[ s.backgroundWhite, { height: 800 } ]} />
          </View>
        )}
      />
    </View>
  )
}
