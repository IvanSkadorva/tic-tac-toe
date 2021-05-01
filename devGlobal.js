import {getGameRoom} from './src/state/gameRoom';

const devGlobal = {};

global.DEV_GLOBAL = devGlobal;

export default devGlobal;

global.DEV_GLOBAL.getGameRoom = getGameRoom;
