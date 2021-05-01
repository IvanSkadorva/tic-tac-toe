import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {initUsername} from '../state/username';
import {useNavigation} from "@react-navigation/core";

const Loading = () => {
  const navigation = useNavigation()
  useEffect(() => {
    const fn = async () => {
      await initUsername();
      navigation.navigate('Home');
    };
    fn();
  }, []);
  return (
    <View>
      <Text>Loading screen</Text>
    </View>
  );
};

export default Loading;
