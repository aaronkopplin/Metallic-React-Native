import "react-native-gesture-handler";
import React, { Text, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen, HomeScreen, RegistrationScreen} from "./src/screens";
import { decode, encode } from "base-64";
import { firebase } from "./src/firebase/config";
import { RecentChatsScreen } from "./src/screens/RecentChatsScreen/RecentChatsScreen";
import { PaymentsScreen } from "./src/screens/PaymentsScreen/PaymentsScreen";
import { AccountScreen } from "./src/screens/AccountScreen/AccountScreen";
import { ContactsScreen } from "./src/screens/ContactsScreen/ContactsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

if (!global.btoa) {
    global.btoa = encode;
}
if (!global.atob) {
    global.atob = decode;
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="RecentChats"
                component={RecentChatsScreen}
            />
            <Tab.Screen
                name="Contacts"
                component={ContactsScreen}
            />
        </Tab.Navigator>
    );
}

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
            <Stack.Navigator initialRouteName="Home">
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
                        <Stack.Screen
                            name="Account"
                            component={AccountScreen}
                        />
                        <Stack.Screen name="Home">
                            {(props) => (
                                <Tabs {...props} extraData={user} component={HomeScreen}/>
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
