import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
import Icon from './Icon';

interface ButtonInterface {
  btnStyle: string;
  iconLeft?: string;
  iconRight?: string;
  label?: string;
}

const Button = ({ btnStyle, iconLeft, iconRight, label }: ButtonInterface): React.ReactElement => {
  let containerStyle:any = StyleSheet.create({
    main: {
      // width: 'calc(100% - 48px)',
      borderRadius: 8,
      backgroundColor: '#181B1B'
    }
  });
  const styleUnderlayColor:any = {
    primary : '#313535',
    secondary : "#FBEAE9",
    icon: "#E4E6E6"
  }
  let style:any = StyleSheet.create({
    container: {
      width: '100%',
      height: 64,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderRadius: 8
    },
    text: {
      color: '#FFFFFF',
      fontSize: 16
    },
    img: {
      width: 25,
      height: 25
    },
  });
  switch (btnStyle) {
    case 'secondary':
      style = StyleSheet.create({
        container: {
          width: '100%',
          height: 64,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderRadius: 8
        },
        text: {
          color: '#181B1B',
          fontSize: 14
        },
        img: {
          width: 25,
          height: 25
        },
      });
      containerStyle = StyleSheet.create({
        main: {
          // width: 'calc(100% - 48px)',
          borderRadius: 8,
          backgroundColor: 'none'
        }
      });
      break;
    case 'icon':
      style = StyleSheet.create({
        container: {
          width: '100%',
          height: '100%',
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderRadius: 8
        },
        text: {
          color: '#181B1B',
          fontSize: 14
        },
        img: {
          width: 25,
          height: 25
        },
      });
      containerStyle = StyleSheet.create({
        main: {
          width: 40,
          height: 40,
          borderRadius: 50,
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#E4E6E6'
        }
      });
    default:
      break;
  }


  const image = { uri: "https://www.pinclipart.com/picdir/middle/485-4851736_free-png-search-icon-search-icon-free-download.png" };

  return (
    <TouchableHighlight 
      activeOpacity={1}
      underlayColor={styleUnderlayColor[btnStyle]}
      onPress={() => alert('Pressed!')}
      style={containerStyle.main}>
      <View style={style.container}>
        {iconLeft &&
          <Image
            style={style.img}
            source={image}
          />
        }

        {label ?
          <Text style={style.text}>{label}</Text>
          : <Icon
              name="arrow-left-line" size={20} color="#181B1B"
          />
        }

        {iconRight &&
          <Image
            style={style.img}
            source={image}
          />
        }
      </View>
    </TouchableHighlight>
  )
}

export default Button;
