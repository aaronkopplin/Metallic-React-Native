import 'react-native-gesture-handler';
import * as React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';
import SignUp from './SignUp';
import CustomButton from './button';
import Account from './Account';
import { masterStyles } from '../Metallic/masterStyles';

const screenSize = Dimensions.get("screen");

class Login extends React.Component {
    
    static navigationOptions = {
        title: 'Login'
    };
    render() {
        return (
            <View style={masterStyles.mainBackground}>
              <View style={{ backgroundColor: '#2e2b30', width: screenSize.width - 20, height: screenSize.width - 20, paddingTop: screenSize.height / 50, paddingLeft: 20, borderRadius: 4 }}>
                <Text style={[masterStyles.headText, {paddingBottom: screenSize.height / 18}]}>Login</Text>
                <Text style={[masterStyles.normalText, {paddingBottom: screenSize.height / 150}]}>Username</Text>
                <TextInput style={masterStyles.textInputStyle} placeholder='Enter your username' autoCapitalize={'none'} />
                <Text style={[masterStyles.normalText, {paddingBottom: screenSize.height / 150, paddingTop: screenSize.height / 60}]}>Password</Text>
                <TextInput style={masterStyles.textInputStyle} placeholder='Enter your password' autoCapitalize={'none'} secureTextEntry={true} />
                
                <View style={{zIndex: 1, paddingTop: screenSize.height / 20, paddingBottom: screenSize.height / 70}}>
                  <CustomButton onPress={() => this.props.navigation.navigate(Account)} text='Login' color='#1e1c21' width={screenSize.width - 60} height={screenSize.height / 20}/>
                </View>
                <View style={{zIndex: 2}}>
                  <CustomButton onPress={() => this.props.navigation.navigate(SignUp)} 
                  text={'Don\'t have an account'} color='#1e1c21' width={screenSize.width - 60} height={screenSize.height / 20 } />
                </View>
                
              </View>
            </View>
          );
    }
}

export default Login;