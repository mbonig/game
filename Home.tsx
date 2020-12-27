import React, {useContext, useState} from "react";
import {Text, TextInput, View} from "react-native";
import {styles} from "./styles";
import {SimpleButton} from "./SimpleButton";
import {User} from "./App";

export const HomeScreen = ({navigation}) => {

  const {username, setUsername} = useContext(User);
  const [tempUsername, setTempUsername] = useState("");

  return (
    <View style={styles.centered}>
      {!username ? (
          <View>
            <Text style={{fontSize: 20, textAlign: "center"}}>Enter your name:</Text>
            <TextInput style={{
              fontSize: 20,
              margin: 20,
              borderColor: '#333333',
              borderStyle: "solid",
              borderWidth: 1,
              borderRadius: 5,
              padding: 5
            }} onChangeText={setTempUsername}/>
            <SimpleButton title="Save" onPress={() => setUsername(tempUsername)}/>
          </View>) :
        (
          <View>
            <SimpleButton title="How to Play" onPress={() => navigation.navigate('Help')}/>
            <SimpleButton title="Find Game" onPress={() => navigation.navigate('Find Game')}/>
            <SimpleButton title="New Game" onPress={() => navigation.navigate('New Game')}/>
            <SimpleButton title="Join Game" onPress={() => navigation.navigate('Join Game')}/>
            <SimpleButton title="Map Editor" onPress={() => navigation.navigate('Map Editor')}/>
          </View>
        )}
    </View>

  );
};