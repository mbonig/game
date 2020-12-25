import React from 'React';
import {Image, Text as BaseText, View} from 'react-native';
import {styles} from "./styles";

const Text = ({children}) => <BaseText style={{margin: 10, fontSize: 20}}>{children}</BaseText>

export const Help = () => {
  return <View style={[styles.container, {padding: 20, maxWidth: 800, marginLeft: "auto", marginRight: "auto"}]}>
    <Text>A thief has stolen valuable data and is on the run. Cops are hot on the trail!</Text>
    <Image style={{width: "100%", height: "400px", resizeMode: "contain"}} source={require('./assets/example.png')}/>
    <Text>If you are a cop, your job is to catch the thief by occupying the same node as the thief. If you do, the game is over and the cops win.</Text>

    <Text>If you are the thief it's you're job to run from the cops until all turns are taken (or nobody can move).</Text>

    <Text>Players move from node to node by either a slow, medium, or fast ticket. Each player gets a set amount of
      travel tickets
      and cannot earn more. Once all tickets are used up (or all players cannot move to any node), the game is
      over and the thief wins. </Text>
    <Image style={{width: "100%", height: "60px", resizeMode: "contain"}} source={require('./assets/tickets.png')}/>
    <Text>The thief is not visible and must sneak around the map leaving a trail of the tickets he/she has used to
      travel.
      However, the thief does become visible for one move, after the 2nd, 7th, 12th and 17th moves.</Text>

    <Image style={{width: "100%", height: "300px", resizeMode: "contain"}}
           source={require('./assets/thief_moves.png')}/>

    <Text>One last thing, the thief gets special 'black' travel tickets, which can be used to travel any line and does
      not expose to the cops how the thief travelled. </Text>
  </View>
}