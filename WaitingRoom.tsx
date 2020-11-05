import React, {useContext, useEffect} from "react";
import {FlatList, Text, View} from 'react-native';
import {styles} from "./styles";
import {Game} from "./App";
import {GameState} from "./models";

import {API, graphqlOperation} from "aws-amplify";
import {SimpleButton} from "./SimpleButton";
import {onGameStateChange, startGame} from "./queries";


const PlayerItem = ({item}) => {
  const {name} = item;
  return <Text>{name}</Text>;
};

export function WaitingRoom({navigation}) {
  const {game, setGame}: { game: GameState, [key: string]: any } = useContext(Game);

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

  return (
    <View style={styles.centered}>
      <Text>Game Id: <Text style={{fontWeight: "bold"}}>{game.id}</Text> (share this with others)</Text>
      <Text>Players:</Text>
      <FlatList
        data={game.players}
        renderItem={PlayerItem}
        keyExtractor={({name}) => name}
      />
      <SimpleButton text="Start" onPress={onStartPress}></SimpleButton>
    </View>
  );
}