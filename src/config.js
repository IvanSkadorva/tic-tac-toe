const configDev = {SOCKET_SERVER_URL: 'http://localhost:3000'};
const configProd = {};
export const config = __DEV__ ? configDev : configProd;
