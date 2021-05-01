import React from 'react';
import {Home} from "./src/screens/Home";
import Lobby from "./src/screens/Lobby";
import GameRoom from "./src/screens/GameRoom";
import Loading from "./src/screens/Loading";
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from "@react-navigation/native";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={'Preloader'}>
                <Stack.Screen name="Preloader" component={Loading}/>
                <Stack.Screen name="Home" component={Home} options={{
                    title: 'Tic Tac Toe',
                }} />
                <Stack.Screen name="Lobby" component={Lobby}/>
                <Stack.Screen name="GameRoom" component={GameRoom}/>
            </Stack.Navigator>
        </NavigationContainer>

    );
}

