import 'react-native-gesture-handler';
import * as React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';

class Payments extends React.Component {
    static navigationOptions = {
        title: 'Payments'
    };
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text>Payments Screen</Text>
            </View>
          );
    }
}

export default Payments;