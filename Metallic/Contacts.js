import 'react-native-gesture-handler';
import * as React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';

class Contacts extends React.Component {
    static navigationOptions = {
        title: 'Contacts'
    };
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text>Contacts Screen</Text>
            </View>
          );
    }
}

export default Contacts;