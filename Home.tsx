import React, {useContext, useState} from "react";
import {Button, Text, View} from "react-native";
import {styles} from "./styles";
import {Input} from "react-native-elements";
import {SimpleButton} from "./SimpleButton";
import {User} from "./App";

export const HomeScreen = ({navigation}) => {

  const {username, setUsername} = useContext(User);
  const [tempUsername, setTempUsername] = useState("");

  return (
    <View style={styles.centered}>
      {!username ? (
          <View>
            <Text>Enter your name:</Text>
            <Input onChangeText={setTempUsername}></Input>
            <Button title="Save" onPress={() => setUsername(tempUsername)}/>
          </View>) :
        (
          <View>
            <SimpleButton text="New Game" onPress={() => navigation.navigate('New Game')}/>
            <SimpleButton text="Join Game" onPress={() => navigation.navigate('Join Game')}/>
            <SimpleButton text="Find Game" onPress={() => navigation.navigate('Find Game')}/>
            <SimpleButton text="Test" onPress={() => navigation.navigate('Test')}/>
          </View>
        )}
    </View>

  );
};