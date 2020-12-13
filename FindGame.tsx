import {FlatList, Text, View} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {GameState} from "./models";
import {Game, User} from "./App";
import {styles} from "./styles";
import {API, graphqlOperation} from "aws-amplify";
import {waitingRoom} from "./graphql/queries";
import {joinGame as joinGameQuery, onNewWaitingRoom} from "./queries";
import {SimpleButton} from "./SimpleButton";


export const FindGame = ({navigation}) => {
    const {game, setGame}: { game: GameState, [key: string]: any } = useContext(Game);
    const {username} = useContext(User);

    const [games, setGames] = useState([]);

    const joinGame = async (game) => {
      const {data} = await API.graphql(graphqlOperation(joinGameQuery, {id: game.id, myself: username}));
      setGame(data.joinGame);
      navigation.navigate("Waiting Room");
    }

    useEffect(() => {
      const subscriber = API.graphql(graphqlOperation(onNewWaitingRoom)).subscribe({
        next: data => {
          const games = data.value.data.onNewWaitingRoom;
          setGames(games);
        }
      });
      return () => subscriber.unsubscribe()

    }, []);

    const GameItem = ({item: game}) => {
      return <Text
        style={{fontSize: 20, margin: 10}}
        onPress={() => joinGame(game)}>{game.id} - {game.players.length} player{game.players.length > 1 ? 's' : ''}</Text>
    }

    useEffect(() => {
      (async () => {
        const results = await API.graphql(graphqlOperation(waitingRoom));
        console.log({results});
        setGames(results.data.waitingRoom);
      })();
    }, [])

    return (<View style={styles.centered}>
      {games.length === 0 ? <Text>No games available</Text> : null}
      {games.length === 0 ? <SimpleButton title="New Game" onPress={() => navigation.navigate("New Game")}/> : null}
      {games.length > 0 ? <FlatList
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
        }}
        data={games}
        renderItem={GameItem}
        keyExtractor={({id}) => id}
      /> : null }

    </View>);
  }
;