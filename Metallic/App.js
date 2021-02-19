import "react-native-gesture-handler";
import React, { Text, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen, HomeScreen, RegistrationScreen } from "./src/screens";
import { decode, encode } from "base-64";
import { firebase } from "./src/firebase/config";
import { RecentChatsScreen } from "./src/screens/RecentChatsScreen/RecentChatsScreen";
import { PaymentsScreen } from "./src/screens/PaymentsScreen/PaymentsScreen";

if (!global.btoa) {
    global.btoa = encode;
}
if (!global.atob) {
    global.atob = decode;
}

const Stack = createStackNavigator();

export default function App() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // if (loading) {
    //     return <>{/* <Text>Loading</Text> */}</>;
    // }

    useEffect(() => {
        const usersRef = firebase.firestore().collection("users");
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                usersRef
                    .doc(user.uid)
                    .get()
                    .then((document) => {
                        const userData = document.data();
                        setLoading(false);
                        setUser(userData);
                    })
                    .catch((error) => {
                        setLoading(false);
                    });
            } else {
                setUser(null);
            }
        });
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    <>
                        <Stack.Screen
                            name="RecentChats"
                            component={RecentChatsScreen}
                        />
                        <Stack.Screen
                            name="Payments"
                            component={PaymentsScreen}
                        />
                        <Stack.Screen name="Home">
                            {(props) => (
                                <HomeScreen {...props} extraData={user} />
                            )}
                        </Stack.Screen>
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen
                            name="Registration"
                            component={RegistrationScreen}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
