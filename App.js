import React, {Component} from 'react';
import PubNubReact from 'pubnub-react';
import {Alert, StyleSheet, Text, View,} from 'react-native';
import Game from './src/components/Game';
import Lobby from './src/components/Lobby';
import shortid from 'shortid';
import Dialog from "react-native-dialog";


export default class App extends Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: "pub-c-a54a5e2b-fd9a-4ce8-98e4-c896b5377c1f",
      subscribeKey: "sub-c-df104e28-aa43-11eb-a2f9-7226f347561f"
    });

    this.state = {
      username: '',
      piece: '',
      x_username: '',
      o_username: '',
      is_playing: false,
      is_waiting: false,
      is_room_creator: false,
      isDisabled: false,
      enteredLobby: '',
      isPromptVisible: false,
    };

    this.channel = null;
    this.pubnub.init(this);
  }

  componentWillUnmount() {
    this.pubnub.unsubscribe({
      channels : ['gameLobby', this.channel]
    });
  }

  componentDidMount() {
    this.pubnub.subscribe({
      channels: ['gameLobby'],
      withPresence: true
    });

    this.pubnub.getMessage('gameLobby', (msg) => {
      if(msg.message.is_room_creator){
        this.setState({
          x_username: msg.message.username
        })
      }
      else if(msg.message.not_room_creator){
        this.pubnub.unsubscribe({
          channels : ['gameLobby']
        });
        this.setState({
          o_username: msg.message.username,
          is_waiting: false,
          is_playing: true
        });
      }
    });
  }

  onChangeUsername = (username) => {
    this.setState({username});
  }

  onPressCreateRoom = () => {
    if(this.state.username === ''){
      Alert.alert('Error','Please enter a username');
    }
    else{
      let roomId = shortid.generate();
      roomId = roomId.substring(0, 5);
      this.channel = 'tictactoe--' + roomId;
      this.pubnub.subscribe({
        channels: [this.channel],
        withPresence: true
      });

      Alert.alert(
        'Share this room ID with your friend',
        roomId,
        [
          {text: 'Done'},
        ],
        { cancelable: false }
      );

      this.setState({
        piece: 'X',
        is_room_creator: true,
        is_waiting: true,
        isDisabled: true
      });

      this.pubnub.publish({
        message: {
          is_room_creator: true,
          username: this.state.username
        },
        channel: 'gameLobby'
      });
    }
  }

  joinRoom = (room_id) => {
    this.channel = 'tictactoe--' + room_id;
    this.pubnub.hereNow({
      channels: [this.channel],
    }).then((response) => {
      if(response.totalOccupancy <= 1){
        Alert.alert('Lobby is empty','Please create a room or wait for someone to create a room to join.');
      }
      else if(response.totalOccupancy === 2){
        this.pubnub.subscribe({
          channels: [this.channel],
          withPresence: true
        });

        this.setState({
          piece: 'O',
        });

        this.pubnub.publish({
          message: {
            readyToPlay: true,
            not_room_creator: true,
            username: this.state.username
          },
          channel: 'gameLobby'
        });
      }
      else{
        Alert.alert('Room full','Please enter another room name');
      }
    }).catch((error) => {
        console.log(error)
    });
  }

  onPressJoinRoom = () => {
    if (this.state.username === '') {
      Alert.alert('Error', 'Please enter a username');
    } else {
      this.setState({
        isPromptVisible: true,
      })
    }
  }

  endGame = () => {
    this.setState({
      username: '',
      piece: '',
      x_username: '',
      o_username: '',
      is_playing: false,
      is_waiting: false,
      is_room_creator: false,
      isDisabled: false
    });

    this.channel = null;
    this.pubnub.subscribe({
      channels: ['gameLobby'],
      withPresence: true
    });
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.title_container}>
            <Text style={styles.title}>RN Tic-Tac-Toe</Text>
          </View>
          {!!this.state.isPromptVisible &&
          <View>
            <Dialog.Container visible={true}>
              <Dialog.Title>Enter the room name</Dialog.Title>
              <Dialog.Input onChangeText={(value) => this.setState({
                enteredLobby: value
              })}/>
              <Dialog.Button label="Cancel" onPress={() => this.setState({
                isPromptVisible: false,
              })}/>
              <Dialog.Button label="OK" onPress={() =>
                  (this.state.enteredLobby === '') ? '' : (this.joinRoom(this.state.enteredLobby) && this.setState({
                    isPromptVisible: false,
                  }))}/>
            </Dialog.Container>
          </View>}
          {
            !this.state.is_playing &&
            <Lobby
                username={this.state.name}
                onChangeUsername={this.onChangeUsername}
                onPressCreateRoom={this.onPressCreateRoom}
                onPressJoinRoom={this.onPressJoinRoom}
                isDisabled={this.state.isDisabled}
            />
          }

          {
            this.state.is_playing &&
            <Game
                pubnub={this.pubnub}
                channel={this.channel}
                username={this.state.username}
                piece={this.state.piece}
                x_username={this.state.x_username}
                o_username={this.state.o_username}
              is_room_creator={this.state.is_room_creator}
              endGame={this.endGame}
            />
          }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  spinner: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 50
  },
  title_container: {
    flex: 1,
    marginTop: 18
  },
  title: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    color: 'rgb(208,33,41)'
  },
});
