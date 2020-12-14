import React, {useContext} from "react";
import {StyleSheet, Text, View} from "react-native";
import {Game, User} from "./App";
import {MapNode, Player} from "./models";
import {SimpleButton} from "./SimpleButton";
import {getTravel} from "./utils";

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#111111',

    justifyContent: "center",
    alignItems: "center",

    position: "absolute",
    zIndex: 100,
    opacity: 0.9,
    top: 10,
    left: 10,
    right: 10,
    bottom: 10
  },
  prompt: {
    fontSize: 20,
    color: '#aaaaaa'
  }
});

const getName = (t: String) => t.replace(/[0-9]_/, '');

export const TicketPicker = ({targetNode, close}: { targetNode: MapNode, close: any }) => {
  const {game, movePlayer} = useContext(Game);
  const {username} = useContext(User);
  const me = game.players.find((p: Player) => p.name === username)!;
  const myTickets = me.tickets;
  const currentNode = game.map.nodes.find((n: MapNode) => n.players.find((p: Player) => p.name === username));
  const travel = getTravel({source: currentNode, target: targetNode});

  const onPress = (ticket: String) => () => {
    movePlayer(targetNode, ticket);
    close();
  };


  return <View style={styles.container}>
    <Text style={styles.prompt}>Pick a ticket to use:</Text>
    <SimpleButton onPress={onPress(getName(travel))}
                  disabled={myTickets[getName(travel)] === 0}
                  title={`${getName(travel)} : ${myTickets[getName(travel)]} left`}/>
    {me.type === "thief" ? <SimpleButton onPress={onPress('black')}
                  disabled={myTickets.black === 0}
                  title={`black : ${myTickets.black} left`}/> : null }
    <SimpleButton onPress={close}
                  title={`Cancel move`}/>
  </View>
}


function getAllTravel(link: any) {
  const {source: {types: st}, target: {types: tt}} = link;
  let a = new Set(st);
  let b = new Set(tt);
  let intersection = new Set([...a].filter(x => b.has(x)));
  return [...intersection].sort().reverse();
}