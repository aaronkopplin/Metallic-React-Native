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
    ScrollView,
    FlatList,
    Alert
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { firebase } from "../../firebase/config";
import CustomButton from "../../../button";
import { masterStyles } from '../../../../Metallic/masterStyles';
import { color } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

export function PaymentsScreen({route, navigation}) {
    const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");
    const [amountInput, changeAmountInput] = useState(0.0);
    const [available, changeAvailable] = useState(10.0);
    const plat = Platform.OS;
    // const {email, fullName, userName, uid} = route.params;

    const userImageSize = plat === "web" ? 75 : 50;
    

    const renderMessage = ({ side, message }) => {
        return(
            <View>

            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            keyboardVerticalOffset={plat === "android" ? 40 : 0} 
            behavior={plat === "ios" ? "position" : "height" || 
                      plat === "android" ? "position" : "height"} 
            style={{backgroundColor: '#1e1c21', alignItems: 'center', flex: 1, paddingTop: 20}} 
            enabled={true}
        >
                
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
                            <Image style={{borderRadius: 50, backgroundColor: "#000", height: userImageSize, width: userImageSize}}/>
                        </TouchableOpacity>
                        <View style={{height: 1, width: screenSize.width, backgroundColor:  '#1e1c21', top: 10}} />
                        <FlatList renderItem={renderMessage}/>

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
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: screenSize.width - 40}}>
                            <View style={{justifyContent:'flex-start'}}>
                                <Text style={[masterStyles.headingsSmallNotBold, {paddingBottom: 5, fontSize: 18}]}>Available: {available}</Text>
                            </View>
                            <View style={{justifyContent:'flex-end'}}>
                                <Text style={[masterStyles.headingsSmallNotBold, {paddingBottom: 5, fontSize: 18, textAlign: "right"}]}>Sending: {amountInput}</Text>
                            </View>
                        </View>
                        
                    <View style={{alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', backgroundColor: '#fff', borderRadius: 4}}>
                            <Text style={{borderRadius: 4, width: 40, textAlign: 'right', alignSelf: 'center'}}>ETH:</Text>
                            <TextInput 
                                style={[masterStyles.input, {width: screenSize.width - 80, paddingRight: 5}]} 
                                placeholder="Enter amount of ETH to send"
                                keyboardType="decimal-pad"
                                returnKeyType="done"
                                textAlign="left"
                                clearTextOnFocus={true}
                                onFocus={() => changeAmountInput(0.0)}
                                onChangeText={(text) => {
                                
                                    var amount = 0.0;

                                    if (text.includes('.', 0) || text.length == 0) {
                                        if (text.length == 0 || text.length == 1) {
                                            amount = 0.0;
                                        } else {
                                            amount += parseFloat(text);
                                        }
                                    } else {
                                        amount = parseFloat(text);
                                    }

                                    if (amount > available) {
                                        amount = available;
                                    }

                                    // sendingAmount = amount;
                                    
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
                            onPress={() => {
                                if (amountInput == 0.0) {
                                    alert("Trying to send 0.0ETH or invalid input")
                                }
                                if (plat === "web") {
                                    if (available == amountInput && available > 0.0) {
                                        // const r = window.confirm("Trying to send your full balance amount.\nDo you wish to continue?");
                                        if (window.confirm("Trying to send your full balance amount.\nDo you wish to continue?")) {
                                            changeAvailable((available - amountInput));
                                            changeAmountInput(0.0);
                                        }
                                    }
                                } else {
                                    if (available == amountInput && available > 0.0) {
                                        Alert.alert(
                                            "Trying to send your full balance amount.",
                                            "Do you wish to continue?",
                                            [
                                                {
                                                    text: "Yes",
                                                    onPress: () => {
                                                        changeAvailable((available - amountInput));
                                                        changeAmountInput(0.0);
                                                    },
                                                },
                                                {
                                                    text: "No",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel",
                                                },
                                            ],
                                            { cancelable: true }
                                        );
                                    }
                                }
                                
                                
                            }}
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
        </KeyboardAvoidingView>
    );
}
