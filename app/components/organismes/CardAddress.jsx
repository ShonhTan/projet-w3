import React from 'react'
import {  View, Text, ImageBackground, TouchableOpacity, Platform } from 'react-native'

import { categories, categoryIcons, dayIndexes, openOrClosed, restrictionIcons } from '../../utils/wording'

import Chip from "../atoms/Chip"
import RoundButton from "../atoms/RoundButton"
import Icon from '../atoms/Icon'
import { LinearGradient } from 'expo-linear-gradient'
import * as s from '../../styles'

const CardAddress = ({
  place: { name, category, headline, description, hours = [], tags = [], address: { distance } = {}, photos = [] } = {},
  onPress,
  full,
  style,
}) => {
  const { start, end } = { ...hours.filter(({ day }) => day === dayIndexes[new Date().getDay()]).pop() }

  return (
    <TouchableOpacity style={[ s.backgroundWhite, s.round3, s.flex, !full && { width: Platform.OS === 'android' ? 300 : 280 }, style ]} onPress={onPress} activeOpacity={1}>
      <ImageBackground style={[ { height: full ? 200 : 120 }, s.p2 ]} source={photos[0]} resizeMode='cover' borderRadius={16}>
        <View style={[ s.backgroundPrimaryLight, s.absolute, s.fill, s.round3, { zIndex: -1 } ]} />
        <LinearGradient colors={[ 'transparent', full ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)' ]} style={[ s.absolute, s.fill, s.round3 ]} />
        {full && (
          <Text style={[ s.backgroundWhite, s.py1, s.px1, s.body2, s.bold, s.round2, { overflow: 'hidden', alignSelf: 'flex-start' }, s.mb3 ]}>
            Gagnez 50 points en vous y rendant
          </Text>
        )}
        {full && (
          <Text style={[ s.heading3, s.white, s.mtAuto ]} numberOfLines={2}>
            “{headline}”
          </Text>
        )}
      </ImageBackground>
      <View style={[ s.p2, s.pt1 ]}>
        <View style={[ s.row, s.itemsCenter, s.mt05, { height: 32 } ]}>
          <Icon name={categoryIcons[category]} size={14} {...s.primary} style={[ s.mr05 ]} />
          <Text style={[ s.body2, s.primary, s.bold, s.mr1 ]}>{categories[category]}</Text>
          <Icon name="walk-fill" size={14} {...s.primary} style={[ s.mr05 ]} />
          <Text style={[ s.body2, s.primary, s.bold, s.mrAuto ]}>{Math.round(distance / 100)} min</Text>
          {Object.entries(restrictionIcons).map(([ label, { icon, color } ]) =>
            tags.some(t => t.label === label) && (
            <RoundButton
              backgroundColor={color === 'green' ? "#DAEEE6" : "#EDECF8"}
              icon={<Icon name={icon} size={20} color={color === 'green' ? "#0E562F" : "#463DAB"} />}
              key={`${name}_${label}`}
            />
          )).filter(Boolean).slice(0, full ? 3 : 2)}
        </View>
        <Text style={[ s.heading5, s.mb05 ]} numberOfLines={1}>
          {name}
        </Text>
        {full && (
          <>
            <Text style={[ s.body1, s.overflow, s.mb1 ]} numberOfLines={3}>{description}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}

export function CardAddressSkeleton ({ onPress, full, style }) {
  return (
    <TouchableOpacity style={[ s.flex, !full && { width: 363 }, style ]} onPress={onPress} activeOpacity={1}>
      <View style={[ { backgroundColor: 'rgba(0, 0, 0, 0.02)', height: full ? 200 : 120 }, s.round3 ]} />
      <View style={[ s.p2, s.pt1 ]}>
        <View style={[ s.row, s.itemsCenter, s.mt05, { height: 32 } ]}>
          <Text style={[ s.body2, { backgroundColor: 'rgba(0, 0, 0, 0.02)', width: full ? '40%' : '60%' } ]}>{' '}</Text>
        </View>
        <Text style={[ s.heading5, s.mb05, { backgroundColor: 'rgba(0, 0, 0, 0.02)', width: full ? '60%' : '80%' } ]} numberOfLines={1}>{' '}</Text>
        {full && (
          <>
            <Text style={[ s.body1, { backgroundColor: 'rgba(0, 0, 0, 0.02)' }, s.mb1 ]} numberOfLines={3}>{'\n\n'}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default CardAddress;
