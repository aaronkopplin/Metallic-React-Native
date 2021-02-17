import 'react-native-gesture-handler';
import * as React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';

const screenSize = Dimensions.get("screen");

class Account extends React.Component {
    static navigationOptions = {
        title: 'Account'
    };
    render() {
        return (
          <View style={styles.mainBackground} >
              <View style={{ backgroundColor: '#2e2b30', width: screenSize.width - 20, height: screenSize.width - 20, paddingTop: screenSize.height / 50, paddingLeft: 20, borderRadius: 4 }}>
                </View>
            </View>
          );
    }
}

export default Account;

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