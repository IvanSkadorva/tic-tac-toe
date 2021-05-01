import { io } from "socket.io-client";
import {config} from './config';
import {lobbyUsersSubject} from './state/lobbyUsers';
import {gameRoomSubject} from './state/gameRoom';
import {receiveInvite} from "./state/gameInvites";

const socket = io(config.SOCKET_SERVER_URL);
console.log('TCL: config.SOCKET_SERVER_URL', config.SOCKET_SERVER_URL);

export default socket;

console.log('TCL: socket', socket);

socket.on('s2c-lobby-users', data => {
  console.log('s2c-lobby-users', data);
  lobbyUsersSubject.next(data);
});

socket.on('s2c-receive-invite', data => {
  console.log('TCL: data', data);
  receiveInvite(data);
});

socket.on('s2c-game-room', gameRoom => {
  console.log('TCL: gameRoom', gameRoom);
  gameRoomSubject.next(gameRoom);
});
