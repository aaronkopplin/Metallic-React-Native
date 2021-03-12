import React, { useState } from "react";
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
    StyleSheet,
    Platform,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { firebase } from "../../firebase/config";
import CustomButton from "../../../button";
import { masterStyles } from '../../../../Metallic/masterStyles';
import { color } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

export function PaymentsScreen({navigation}) {
    const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");
    const [amountInput, changeAmountInput] = useState(0);
    // const navigation = useNavigation();
    return (
        <KeyboardAvoidingView behavior={'position'} style={{backgroundColor: '#1e1c21', alignItems: 'center', flex: 1, paddingTop: 20}} enabled={true}>

            {/* <View > */}
                
                <View style={{
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 20,
                    height: Platform.OS === "web" ? screenSize.height/1.25 : screenSize.height/1.54,
                    borderRadius: 4,
                    // justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 10
                    }} >
                        <TouchableOpacity
                            onPress={() => {
                                // navigation.navigate
                                navigation.navigate("Account");
                            }}
                        >
                            <Image style={{borderRadius: 50, backgroundColor: "#000", height: 50, width: 50}}/>
                        </TouchableOpacity>
                        <ScrollView>

                        </ScrollView>

                </View>
                
                
                <View style={{
                    backgroundColor: "#2e2b30",
                    width: screenSize.width - 20,
                    height: Platform.OS === "web" ? screenSize.height * 0.11 : screenSize.height * 0.145,
                    borderRadius: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: 15,
                    paddingBottom: 10
                    }} >
                        <Text style={[masterStyles.headingsSmallNotBold, {paddingBottom: 5, fontSize: 18}]}>Available: {'\t\t'} Sending: {amountInput}</Text>
                    <View>
                        <View style={{flexDirection: 'row', backgroundColor: '#fff', borderRadius: 4}}>
                            <Text style={{borderRadius: 4, width: 40, textAlign: 'right', alignSelf: 'center'}}>ETH:</Text>
                            <TextInput 
                                style={[masterStyles.input, {width: screenSize.width - 80, paddingRight: 5}]} 
                                placeholder="Enter amount of ETH to send"
                                keyboardType="number-pad"
                                returnKeyType="done"
                                textAlign="left"
                                clearTextOnFocus={true}
                                onFocus={() => changeAmountInput(0)}
                                onChangeText={(text) => {
                                    const amount = parseInt(text);

                                    // if (amount.length == 0) {
                                    //     amount = 0;
                                    // }
                                    changeAmountInput(amount)
                                }}
                            />
                        </View>
                            
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            top: 10,
                            
                            }} >
                            <CustomButton
                                text="Send"
                                color='#1e1c21'
                                width={screenSize.width - 40}
                                height={screenSize.height * 0.045}
                            />
                        </View>
                    </View>

                </View>
                
                
                {/* <Text style={[masterStyles.headingsSmallNotBold, {fontSize: 15}]}>{props.ethAccount.address}</Text>
                <Text style={[masterStyles.headingsSmallNotBold, {fontSize: 15}]}>{props.ethAccount.name}</Text> */}
            {/* </View> */}
        </KeyboardAvoidingView>
    );
}
