import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Dashboard from '../container/Home/index';
import Detail from '../container/Detail/index';

const Stack = createStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator initialRouteName={'Home'}>
      <Stack.Screen
        name="Home"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default Router;
