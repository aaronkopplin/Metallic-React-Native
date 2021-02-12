import 'react-native-gesture-handler';
import * as React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';

class Account extends React.Component {
    static navigationOptions = {
        title: 'Account'
    };
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text>Account Screen</Text>
            </View>
          );
    }
}

export default Account;