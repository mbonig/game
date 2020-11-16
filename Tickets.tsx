import {Game, User} from "./App";
import React, {useContext} from "react";
import {StyleSheet, Text, View} from "react-native";
import {FAST_COLOR, MEDIUM_COLOR, SLOW_COLOR} from "./styles";
import {PlayerTypes} from "./models";

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    color: '#aaaaaa',
    flexDirection: "row",
    padding: 10
  },
  ticket: {
    margin: 10
  }
})

export const Tickets = () => {
  const {game} = useContext(Game);
  const {username} = useContext(User);
  const me = game.players.find(x => x.name === username)!;
  return <View style={styles.container}>
    <Text style={[styles.ticket, {color: SLOW_COLOR}]}>Slow: {me.tickets.slow}</Text>
    <Text style={[styles.ticket, {color: MEDIUM_COLOR}]}>Medium: {me.tickets.medium}</Text>
    <Text style={[styles.ticket, {color: FAST_COLOR}]}>Fast: {me.tickets.fast}</Text>
    { me.type === PlayerTypes.thief ? <Text style={[styles.ticket, {color: '#aa0000'}]}>Black: {me.tickets.black}</Text> : null}
  </View>
}