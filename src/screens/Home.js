import React, {useState} from 'react';
import {View,Button, TextInput} from 'react-native';
import socket from '../socket';
import {updateUsernameSubject, usernameRef} from '../state/username';
import {useNavigation} from "@react-navigation/core";

export const Home = () => {
    const [error, setError] = useState(false)
    const [username, setUsername] = useState(usernameRef.username)
    const navigation = useNavigation();
    return (
        <View>
            <TextInput
                label="Username"
                placeholder="Username"
                onChangeText={username => {
                    setError(false);
                    setUsername(username)
                }}
                errorMessage={error ? 'Please enter Username' : null}
                value={username}
            />
            <Button
                title="Enter Lobby"
                onPress={() => {
                    const shortenedUsername = username.trim();
                    if (!shortenedUsername) {
                        setError(true)
                        return;
                    }
                    updateUsernameSubject.next(shortenedUsername);
                    navigation.navigate('Lobby');
                    socket.emit('c2s-enter-lobby', shortenedUsername);

                }}
            />
        </View>
    );
};
