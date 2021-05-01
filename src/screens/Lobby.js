import React, {useState, useEffect} from 'react';
import {View,FlatList, Text, SafeAreaView, Button} from 'react-native';
import {lobbyUsersSubject, lobbyUsersRef} from '../state/lobbyUsers';
import {
  declineInvite,
  acceptInvite,
  gameInvitesSubject,
} from '../state/gameInvites';
import socket from '../socket';

function useSet() {
  const [set, setSet] = useState(new Set());
  const addToSet = item => {
    setSet(new Set(set.add(item)));
  };
  const deleteFromSet = item => {
    set.delete(item);
    setSet(new Set(set));
  };
  const setContains = item => {
    return set.has(item);
  };
  return [setContains, addToSet, deleteFromSet];
}

const Lobby = () => {
  const [lobbyUsers, setLobbyUsers] = useState(lobbyUsersRef.lobbyUsers);
  const [isSwitchEnabled] = useSet();
  useEffect(() => {
    setLobbyUsers(lobbyUsersRef.lobbyUsers);
    const subscription = lobbyUsersSubject.subscribe({
      next: v => {
        setLobbyUsers(v);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  const lobbyUsersFiltered = lobbyUsers.filter(lu => lu.cid !== socket.id);
  console.log(lobbyUsersFiltered)
  return (
    <View>
      <Text>Lobby screen</Text>
      <SafeAreaView>
        {lobbyUsersFiltered.map(lu => (
          <FlatList
            key={lu.cid}
            title={lu.username}
            switch={{
              value: isSwitchEnabled(lu.cid),
            }}
          />
        ))}
      </SafeAreaView>
      <InviteOverlay/>
    </View>
  );
};

export default Lobby;

const InviteOverlay = () => {
  const [isVisible, setVisible] = useState(false);
  const [gameInvite, setGameInvite] = useState(null);
  useEffect(() => {
    const sub = gameInvitesSubject.subscribe(v => {
      console.log('gameInvitesSubject v', v);
      setGameInvite(v.length > 0 ? v[0] : null);
      setVisible(v.length > 0);
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <>
      {isVisible && (
        <View >

          <View>
            <Text h4>Accept game invite?</Text>
            <Text h4>User: {gameInvite.hostUsername}</Text>
            <Button
              title="Accept"
              onPress={() => acceptInvite(gameInvite.hostId)}
              containerStyle={{marginTop: 10}}
            />
            <Button
              title="Decline"
              onPress={() => {
                declineInvite();
              }}
              containerStyle={{marginTop: 10}}
            />
          </View>
        </View>
      )}
    </>
  );
};
