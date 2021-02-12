import 'react-native-gesture-handler';
import * as React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUp from './SignUp';
import Login from './Login';

const Stack = createStackNavigator();
const screenSize = Dimensions.get("screen");

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName={Login}
      
      screenOptions={{
        headStyle: { backgroundColor: '#2e2b30', borderColor: '#2e2b30', shadowColor: '#2e2b30' },
        headTintColor: '#79777d',
        headTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }}>
        
        <Stack.Screen name="Login" component={Login} options={{ title: 'Metallic' }} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const textStyle = StyleSheet.create({
  headText: {
    // 121, 119, 125
    color: '#79777d',
    fontWeight: 'bold',
    fontSize: 25,
  },
  normalText: {
    color: '#79777d',
    fontSize: 18,
  },
});

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    backgroundColor: '#1e1c21',
    // bg rgb: r:30, g:28, b:33
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBackground: {
    // 46, 43, 48
    backgroundColor: '#2e2b30',
  },
  textInputStyle: {
    width: screenSize.width - 60, 
    height: 25, 
    backgroundColor: '#fff', 
    borderRadius: 3,
    paddingLeft: 5,
  },
  buttonStyle: {
    backgroundColor: '#1e1c21',
    padding: 20
  }
});
