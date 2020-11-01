import {StyleSheet, Text, TouchableOpacity} from "react-native";
import React from "react";

const buttonStyles = StyleSheet.create({
  button: {
    margin: 20,
    backgroundColor: "black",
    height: 100,
    width: 200,
    padding: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 20,
    color: "#ffffff"
  }
});

export const SimpleButton = ({text, onPress}) => (
  <TouchableOpacity style={buttonStyles.button} onPress={onPress}>
    <Text style={buttonStyles.text}>{text}</Text>
  </TouchableOpacity>
);