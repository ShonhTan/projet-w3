import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Button, TouchableHighlight, ActivityIndicatorComponent } from 'react-native';
import Chip from "../atoms/Chip";
import RoundButton from "../atoms/RoundButton";
import Typo from "../atoms/Typography";
import Icon from '../atoms/Icon';

interface cardInterface {
  title: string;
  subtitle: string;
  photos: string;
  cardStyle?: "large" | "medium" | "small";
  onPress: any;
}

const CardPost = ({ cardStyle, onPress, post }: cardInterface) => {
  console.log("ici", post)
  let styles: any;
  switch (cardStyle) {
    case "small":
      styles = StyleSheet.create({
        container: {
          width: 363,
          height: 221,
          // boxShadow: "0px 0px 1px rgba(0, 0, 0, 0.04), 0px 2px 6px rgba(0, 0, 0, 0.04), 0px 10px 20px rgba(0, 0, 0, 0.04)",
          backgroundColor: "#181a1e",
          borderRadius: 16,
        },
        top: {
          flex: 1,
          backgroundColor: "#181A1E",
          borderRadius: 16,
        },
        topBg: {
          padding: 20,
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
        },
        bottom: {
          flex: 1,
          padding: 10,
        },
        info: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        topInfoTop: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
      })
      break;

    default:
      styles = StyleSheet.create({
        container: {
          width: 363,
          height: 400,
          backgroundColor: "#181a1e",
          borderRadius: 16,

          justifyContent: "flex-end",
          alignItems: "flex-end",
          alignContent: "flex-end",
        },
        info: {
          width: "100%",
        },
        topBg: {
          padding: 30,
        }
      })
      break;
  }

  return (
    <TouchableHighlight onPress={onPress} style={styles.container}>
      {/* @ts-ignore */}
      <ImageBackground style={styles.topBg} source={{ uri: post.photo.id }}>
        <View style={styles.info}>
          {/* @ts-ignore */}
          {/* <Typo fontSize={14} lineHeight={18} fontWeight="200" color="#FFFFFF" text={subtitle} /> */}
          <Typo fontSize={24} lineHeight={31} fontWeight="normal" color="#FFFFFF" text={post.title} />
        </View>
      </ImageBackground>
    </TouchableHighlight >
  )
}

export default CardPost;