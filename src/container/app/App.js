import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from '../../router';
import {View} from 'react-native';

const App = () => {
  return (
    // <NavigationContainer>
    //   <Router />
    // </NavigationContainer>
    <View style={{flex: 1}}>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </View>
  );
};

export default App;
