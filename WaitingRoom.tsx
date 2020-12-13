import React, {useContext, useEffect} from "react";
import {FlatList, Text, View, StyleSheet} from 'react-native';
import {styles} from "./styles";
import {Game, User} from "./App";
import {GameState} from "./models";

import {API, graphqlOperation} from "aws-amplify";
import {SimpleButton} from "./SimpleButton";
import {onGameStateChange, startGame} from "./queries";

const playerStyles = StyleSheet.create({
  name:{
    fontSize: 20
  }
});

const PlayerItem = ({item}) => {
  const {name} = item;
  return <Text style={playerStyles.name}>{name}</Text>;
};

export function WaitingRoom({navigation}) {
  const {game, setGame}: { game: GameState, [key: string]: any } = useContext(Game);
  const {username} = useContext(User);

  useEffect(() => {
    const subscriber = API.graphql(graphqlOperation(onGameStateChange, {id: game.id})).subscribe({
      next: data => {
        const game = data.value.data.onGameStateChange;
        setGame(game);
        if (game.status === "Started") {
          navigation.navigate("Game");
        }
      }
    });
    return () => subscriber.unsubscribe()
  }, [game]);

  if (game.status === "Started") {
    navigation.navigate("Game");
  }

  async function onStartPress() {
    const {data: {startGame: newGame}} = await API.graphql(graphqlOperation(startGame, {id: game.id}));
    setGame(newGame);
    navigation.navigate('Game');
  }

  let minNumberOfPlayers = 2;
  return (
    <View style={styles.centered}>
      <Text style={playerStyles.name}>Game Id: <Text style={{fontWeight: "bold"}}>{game.id}</Text> (share this with others)</Text>
      <Text style={{marginBottom: 10}}>Players:</Text>
      { game.players.map(x=><PlayerItem key={x.name} item={x}/>) }
      { game.players.length < minNumberOfPlayers ? <Text style={{margin: 10}}>Need more players!</Text> : null}
      { game.host === username && game.players.length >= minNumberOfPlayers ? <SimpleButton title="Start" onPress={onStartPress}/> : null}
    </View>
  );
}