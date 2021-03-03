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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { firebase } from "../../firebase/config";
import CustomButton from "../../../button";
import { masterStyles } from '../../../../Metallic/masterStyles';
import { color } from "react-native-reanimated";

export function PaymentsScreen({ navigation }) {
    const screenSize = Platform.OS === "web" ? Dimensions.get("window") : Dimensions.get("screen");
    return (
        <View style={masterStyles.mainBackground}>
            <View style={{
                flex:.1, 
                backgroundColor: "#2e2b30",
                width: screenSize.width - 20,
                height: Platform.OS === "web" ? screenSize.height/2.5 : screenSize.width - 30,
                paddingTop: screenSize.height / 50,
                paddingLeft: 20,
                borderRadius: 4,
                }} >
                <CustomButton
                    onPress={() => {
                        navigation.navigate("Account")
                    }}
                    text="My Account"
                    color='#1e1c21'
                    width={screenSize.width - 60}
                    height={screenSize.height / 20}
                />
        </View>
            <Text style={[masterStyles.headingsSmall]}> Hello payments screen </Text>
        </View>
    );
}
