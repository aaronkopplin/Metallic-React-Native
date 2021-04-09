import "react-native-gesture-handler";
import React, { Text, useEffect, useState, } from "react";

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

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";

if (!global.btoa) {
    global.btoa = encode;
}
if (!global.atob) {
    global.atob = decode;
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
    const [account, setAccount] = useState(false);

    useEffect(() => {
        async function grabAccount() {
            console.log("tabs getting wallet");
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
                keyboardHidesTabBar: true,
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
                    headerStyle: {
                        backgroundColor:
                            masterStyles.mainBackground.backgroundColor,
                        borderColor:
                            masterStyles.mainBackground.backgroundColor,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                    },
                    title: "Recent Chats",
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
                    headerStyle: {
                        backgroundColor:
                            masterStyles.mainBackground.backgroundColor,
                        borderColor:
                            masterStyles.mainBackground.backgroundColor,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                    },
                    title: "Search",
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
            </Tab.Screen>
        </Tab.Navigator>
    ) : (
        <AccountRecoveryScreen />
    );
}

export default function App() {
    const [user, setUser] = useState(null);
    // const [ethAccount, setEthAccount] = useState(null);
    // const [balance, setBalance] = useState("Loading");
    // const [address, setAddress] = useState("Loading");
    // const [mnemonic, setMnemonic] = useState("");

    useEffect(() => {
        const usersRef = firebase.firestore().collection("users");
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                usersRef
                    .doc(user.uid)
                    .get()
                    .then((document) => {
                        const userData = document.data();
                        console.log("setting user " + (userData != null));
                        setUser(userData);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                console.log("setting user to NULL");
                setUser(null);
            }
        });
    }, []);

    // async function InitAccount() {
    //     const st
    //     const newWallet = ethers.Wallet.fromMnemonic(
    //         "panther chimney define cigar author moment holiday heart measure sugar flag degree"
    //     );
    //     console.log(newWallet.mnemonic.phrase);
    //     storeData(newWallet.privateKey);
    //     console.log(newWallet.address);
    //     setEthAccount(newWallet);
    //     setAddress(newWallet.address);
    //     setMnemonic(newWallet.mnemonic.phrase);

    //     const provider = new ethers.providers.InfuraProvider(
    //         "ropsten",
    //         "298080f1923540f19af74e5baa886001"
    //     );
    //     const b = await provider.getBalance(newWallet.address);
    //     var bal = b.toString();
    //     console.log("balance: " + b.toString());
    //     bal =
    //         (bal.length >= 18 ? bal.substring(0, bal.length - 18) : "0") +
    //         "." +
    //         bal.slice(-18);
    //     bal = parseFloat(bal);

    //     setBalance(bal.toString() + " eth");
    // }

    // useEffect(() => {
    //     InitAccount();
    // }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                {user ? (
                    <>
                        <Stack.Screen
                            name="RecentChats"
                            component={RecentChatsScreen}
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
                                    alignContent: "center",
                                },
                            }}
                        />
                        <Stack.Screen
                            name="Contacts"
                            component={ContactsScreen}
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
                                    alignContent: "center",
                                },
                            }}
                        />
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
                            name="Account"
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
                            {(props) => <AccountScreen {...props} />}
                        </Stack.Screen>
                        <Stack.Screen
                            name="AccountDetailScreen"
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
                            name="UserSearchScreen"
                            component={UserSearchScreen}
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
                        {/* <Stack.Screen 
                        name="Account"
                        options={{ 
                            headerStyle: { 
                                backgroundColor: masterStyles.mainBackground.backgroundColor, 
                                borderColor: masterStyles.mainBackground.backgroundColor,
                                elevation: 0,
                                shadowOpacity: 0,
                                borderBottomWidth: 0
                            },
                            headerTintColor: masterStyles.headings.color,
                            headerTitleStyle: {
                                fontWeight: 'normal',
                                fontSize: 24
                            },
                        }}
                        >
                            {(props) => (
                                <AccountScreen
                                    {...props}
                                    ethAccount={ethAccount}
                                    // ethAccount={wallet}
                                />
                            )}
                        </Stack.Screen> */}
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
