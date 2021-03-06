import "react-native-gesture-handler";
import React, { Text, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen, RegistrationScreen } from "./src/screens";
import { decode, encode } from "base-64";
import { firebase } from "./src/firebase/config";
import { RecentChatsScreen } from "./src/screens/RecentChatsScreen/RecentChatsScreen";
import { PaymentsScreen } from "./src/screens/PaymentsScreen/PaymentsScreen";
import { AccountScreen } from "./src/screens/AccountScreen/AccountScreen";
import { ContactsScreen } from "./src/screens/ContactsScreen/ContactsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserAccountScreen } from "./src/screens/UserAccountScreen/UserAccountScreen";
import { UserSearchScreen } from "./src/screens/UserSearchScreen/UserSearchScreen";
import { AccountDetailScreen } from "./src/screens/AccountDetailsScreen/AccountDetailScreen";
import { masterStyles } from "./masterStyles";
import { AccountRecoveryScreen } from "./src/screens/AccountRecoveryScreen/AccountRecoverScreen";
import * as WalletFunctions from "./src/ethereum/walletFunctions";
import Icon from "react-native-vector-icons/Ionicons";

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";
import { Platform } from "react-native";

if (!global.btoa) {
    global.btoa = encode;
}
if (!global.atob) {
    global.atob = decode;
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
    const [account, setAccount] = useState(true);

    useEffect(() => {
        async function grabAccount() {
            var existingAccount = await WalletFunctions.loadWalletFromPrivate();
            if (existingAccount != null) {
                setAccount(true);
            } else {
                setAccount(false);
            }
        }

        grabAccount();
    }, []);

    return account ? (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: "#1e1c21",
                inactiveTintColor: "#79777d",
                inactiveBackgroundColor: "#1e1c21",
                activeBackgroundColor: "#79777d",
                labelPosition: "below-icon",
                labelStyle: {
                    fontSize: 15,
                    fontWeight: "bold",
                    position: "absolute",
                },
                keyboardHidesTabBar: Platform.OS == "android" ? true : false,
                style: {
                    elevation: 0,
                    shadowOpacity: 0,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    borderTopColor: "#79777d",
                    backgroundColor:
                        masterStyles.mainBackground.backgroundColor,
                },
                tabStyle: {
                    justifyContent: "center",
                },
            }}
        >
            <Tab.Screen
                name="RecentChats"
                component={RecentChatsScreen}
                options={{
                    tabBarIcon: () => (
                        <Icon name="paper-plane" color="#2e2b30" size={30} />
                    ),
                    headerStyle: {
                        backgroundColor:
                            masterStyles.mainBackground.backgroundColor,
                        borderColor:
                            masterStyles.mainBackground.backgroundColor,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                    },
                    title: "",

                    headerTintColor: masterStyles.headings.color,
                    headerTitleStyle: {
                        fontWeight: "normal",
                        fontSize: 24,
                    },
                }}
            />
            <Tab.Screen
                name="UserSearch"
                component={UserSearchScreen}
                options={{
                    tabBarIcon: () => (
                        <Icon name="search" color="#2e2b30" size={30} />
                    ),
                    headerStyle: {
                        backgroundColor:
                            masterStyles.mainBackground.backgroundColor,
                        borderColor:
                            masterStyles.mainBackground.backgroundColor,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                    },
                    title: "",
                    headerTintColor: masterStyles.headings.color,
                    headerTitleStyle: {
                        fontWeight: "normal",
                        fontSize: 24,
                    },
                }}
            />
            <Tab.Screen
                name="Contacts"
                component={ContactsScreen}
                options={{
                    tabBarIcon: () => (
                        <Icon name="book" color="#2e2b30" size={30} />
                    ),
                    title: "",
                    headerStyle: {
                        backgroundColor:
                            masterStyles.mainBackground.backgroundColor,
                        borderColor:
                            masterStyles.mainBackground.backgroundColor,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                    },
                    headerTintColor: masterStyles.headings.color,
                    headerTitleStyle: {
                        fontWeight: "normal",
                        fontSize: 24,
                    },
                }}
            />
            <Tab.Screen
                name="Account"
                options={{
                    tabBarIcon: () => (
                        <Icon name="person" color="#2e2b30" size={30} />
                    ),
                    title: "",
                    headerStyle: {
                        backgroundColor:
                            masterStyles.mainBackground.backgroundColor,
                        borderColor:
                            masterStyles.mainBackground.backgroundColor,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                    },
                    headerTintColor: masterStyles.headings.color,
                    headerTitleStyle: {
                        fontWeight: "normal",
                        fontSize: 24,
                    },
                }}
            >
                {(props) => <AccountScreen {...props} />}
            </Tab.Screen>
        </Tab.Navigator>
    ) : (
        <AccountRecoveryScreen />
    );
}

export default function App() {
    const [user, setUser] = useState(false);

    useEffect(() => {
        const usersRef = firebase.firestore().collection("users");
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(true);
            } else {
                setUser(false);
            }
        });
    }, []);
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                {user ? (
                    <>
                        <Stack.Screen
                            name="Payments"
                            options={{
                                headerStyle: {
                                    backgroundColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    borderColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    elevation: 0,
                                    shadowOpacity: 0,
                                    borderBottomWidth: 0,
                                },
                                headerTintColor: masterStyles.headings.color,
                                headerTitleStyle: {
                                    fontWeight: "normal",
                                    fontSize: 24,
                                },
                            }}
                        >
                            {(props) => <PaymentsScreen {...props} />}
                        </Stack.Screen>

                        <Stack.Screen
                            // account screen needs to be in stack and tab for when recovering from mnemonic
                            name="ViewOtherAccount"
                            options={{
                                // tabBarIcon: () => (
                                //     <Icon
                                //         name="person"
                                //         color="#2e2b30"
                                //         size={30}
                                //     />
                                // ),
                                title: "",
                                headerStyle: {
                                    backgroundColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    borderColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    elevation: 0,
                                    shadowOpacity: 0,
                                    borderBottomWidth: 0,
                                },
                                headerTintColor: masterStyles.headings.color,
                                headerTitleStyle: {
                                    fontWeight: "normal",
                                    fontSize: 24,
                                },
                            }}
                        >
                            {(props) => <AccountScreen {...props} />}
                        </Stack.Screen>
                        <Stack.Screen
                            name="AccountDetailScreen"
                            options={{
                                title: "Account Details",
                                headerStyle: {
                                    backgroundColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    borderColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    elevation: 0,
                                    shadowOpacity: 0,
                                    borderBottomWidth: 0,
                                },
                                headerTintColor: masterStyles.headings.color,
                                headerTitleStyle: {
                                    fontWeight: "normal",
                                    fontSize: 24,
                                },
                            }}
                        >
                            {(props) => <AccountDetailScreen {...props} />}
                        </Stack.Screen>
                        <Stack.Screen
                            name="AccountRecoveryScreen"
                            options={{
                                headerStyle: {
                                    backgroundColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    borderColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    elevation: 0,
                                    shadowOpacity: 0,
                                    borderBottomWidth: 0,
                                },
                                headerTintColor: masterStyles.headings.color,
                                headerTitleStyle: {
                                    fontWeight: "normal",
                                    fontSize: 24,
                                },
                            }}
                        >
                            {(props) => <AccountRecoveryScreen {...props} />}
                        </Stack.Screen>
                        <Stack.Screen
                            name="UserAccountScreen"
                            component={UserAccountScreen}
                            options={{
                                headerStyle: {
                                    backgroundColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    borderColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    elevation: 0,
                                    shadowOpacity: 0,
                                    borderBottomWidth: 0,
                                },
                                headerTintColor: masterStyles.headings.color,
                                headerTitleStyle: {
                                    fontWeight: "normal",
                                    fontSize: 24,
                                },
                            }}
                        />
                        <Stack.Screen
                            name="Home"
                            options={{
                                headerStyle: {
                                    backgroundColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    borderColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    elevation: 0,
                                    shadowOpacity: 0,
                                    borderBottomWidth: 0,
                                },
                                headerTintColor: masterStyles.headings.color,
                                headerTitleStyle: {
                                    fontWeight: "normal",
                                    fontSize: 24,
                                },
                            }}
                        >
                            {(props) => <Tabs {...props} extraData={user} />}
                        </Stack.Screen>
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{
                                headerStyle: {
                                    backgroundColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    borderColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    elevation: 0,
                                    shadowOpacity: 0,
                                    borderBottomWidth: 0,
                                },
                                headerTintColor: masterStyles.headings.color,
                                headerTitleStyle: {
                                    fontWeight: "normal",
                                    fontSize: 24,
                                },
                            }}
                        />
                        <Stack.Screen
                            name="Registration"
                            component={RegistrationScreen}
                            options={{
                                headerStyle: {
                                    backgroundColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    borderColor:
                                        masterStyles.mainBackground
                                            .backgroundColor,
                                    elevation: 0,
                                    shadowOpacity: 0,
                                    borderBottomWidth: 0,
                                },
                                headerTintColor: masterStyles.headings.color,
                                headerTitleStyle: {
                                    fontWeight: "normal",
                                    fontSize: 24,
                                },
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
