import 'react-native-gesture-handler';
import * as React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';

class SignUp extends React.Component {
    static navigationOptions = {
        title: 'SignUp'
    };
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text>Sign Up Screen</Text>
            </View>
          );
    }
}

export default SignUp;