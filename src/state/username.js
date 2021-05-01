import AsyncStorage from '@react-native-async-storage/async-storage';
import {Subject} from 'rxjs';

export const usernameRef = {username: null};


export const initUsername = async () => {
  usernameRef.username = await AsyncStorage.getItem('@username');
};

export const updateUsernameSubject = new Subject();

updateUsernameSubject.subscribe({
  next: v => {
    console.log('next username', v);
    AsyncStorage.setItem('@username', v);
    usernameRef.username = v;
  },
});
