import 'react-native-gesture-handler';
import * as React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';
import CustomButton from './button';
import Account from './Account';

const screenSize = Dimensions.get("screen");

class SignUp extends React.Component {
    static navigationOptions = {
        title: 'SignUp'
    };
    render() {
        return (
            <View style={styles.mainBackground} >
              <Text style={[textStyle.headText, {paddingBottom: screenSize.height / 18}]}>Create an Account!</Text>
              <View style={{ backgroundColor: '#2e2b30', width: screenSize.width - 20, height: screenSize.width - 20, paddingTop: screenSize.height / 50, paddingLeft: 20, borderRadius: 4 }}>
                <Text style={[textStyle.normalText, {paddingBottom: screenSize.height / 150}]}>Username</Text>
                <TextInput style={styles.textInputStyle} placeholder='Enter your username' autoCapitalize={'none'} />
                <Text style={[textStyle.normalText, {paddingBottom: screenSize.height / 150, paddingTop: screenSize.height / 60}]}>Email</Text>
                <TextInput style={styles.textInputStyle} placeholder='Enter your email' autoCapitalize={'none'} />
                <Text style={[textStyle.normalText, {paddingBottom: screenSize.height / 150, paddingTop: screenSize.height / 60}]}>Password</Text>
                <TextInput style={styles.textInputStyle} placeholder='Enter your password' autoCapitalize={'none'} secureTextEntry={true} />
                <Text style={[textStyle.normalText, {paddingBottom: screenSize.height / 150, paddingTop: screenSize.height / 60}]}>Re-Enter Password</Text>
                <TextInput style={styles.textInputStyle} placeholder='Enter your password' autoCapitalize={'none'} secureTextEntry={true} />
              
                <View style={{zIndex: 1, paddingTop: screenSize.height / 20, paddingBottom: screenSize.height / 70}}>
                  <CustomButton onPress={() => this.props.navigation.navigate(Account)} text='Create Account' color='#1e1c21' width={screenSize.width - 60} height={screenSize.height / 20}/>
                </View>              
              </View>
            </View>
          );
    }
}

export default SignUp;

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