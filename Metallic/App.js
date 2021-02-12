import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CustomButton from '../Metallic/button';

const Stack = createStackNavigator();
const screenSize = Dimensions.get("screen");

function LoginScreen({navigation}) {
  return (
    <View style={styles.mainBackground}>
      <View style={{ backgroundColor: '#2e2b30', width: screenSize.width - 20, height: screenSize.width - 20, paddingTop: screenSize.height / 50, paddingLeft: 20, borderRadius: 4 }}>
        <Text style={[textStyle.headText, {paddingBottom: screenSize.height / 18}]}>Login</Text>
        <Text style={[textStyle.normalText, {paddingBottom: screenSize.height / 150}]}>Username</Text>
        <TextInput style={styles.textInputStyle} placeholder='Enter your username' autoCapitalize={'none'} />
        <Text style={[textStyle.normalText, {paddingBottom: screenSize.height / 150, paddingTop: screenSize.height / 60}]}>Password</Text>
        <TextInput style={styles.textInputStyle} placeholder='Enter your password' autoCapitalize={'none'} secureTextEntry={true} />
        <View style={{zIndex: 1, paddingTop: screenSize.height / 20, paddingBottom: screenSize.height / 70}}>
          <CustomButton text='Login' color='#1e1c21' width={screenSize.width - 60} height={screenSize.height / 20}/>
        </View>
        <View style={{zIndex: 2}}>
          <CustomButton onPress={() => navigation.navigate('SignUp')} 
          text={'Don\'t have an account'} color='#1e1c21' width={screenSize.width - 60} height={screenSize.height / 20 } />
        </View>
        
      </View>
    </View>
  );
}

function SignUpScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Sign Up Screen</Text>
    </View>
  );
}

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headStyle: { backgroundColor: '#2e2b30', borderColor: '#2e2b30', shadowColor: '#2e2b30' },
        headTintColor: '#79777d',
        headTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }}>
        
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Metallic' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// export default App;

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
    // flex: 1,
    // 46, 43, 48
    backgroundColor: '#2e2b30',
    // alignItems: 'center',
    // justifyContent: 'center',
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
