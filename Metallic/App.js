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
import { UserAccountScreen } from "./src/screens/UserAccountScreen/UserAccountScreen";
import { UserSearchScreen } from "./src/screens/UserSearchScreen/UserSearchScreen";
import { masterStyles } from "./masterStyles";

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
        <Tab.Navigator
        tabBarOptions={{ 
            activeTintColor: '#1e1c21', 
            inactiveTintColor: '#79777d',
            inactiveBackgroundColor: '#1e1c21',
            activeBackgroundColor: '#79777d', 
            labelPosition: 'below-icon',
            labelStyle: {
                fontSize: 15,
                fontWeight: 'bold',
                position: 'absolute',
            },
            style: {
                elevation: 0,
                shadowOpacity: 0,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderTopColor: '#79777d',
                backgroundColor: masterStyles.mainBackground.backgroundColor
            },
            tabStyle: {
                justifyContent: 'center'
            }
        }}
        >
            <Tab.Screen
                name="RecentChats"
                component={RecentChatsScreen}
                options={{ 
                    headerStyle: { 
                        backgroundColor: masterStyles.mainBackground.backgroundColor, 
                        borderColor: masterStyles.mainBackground.backgroundColor,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,

                    },
                    title: 'Recent Chats',
                    headerTintColor: masterStyles.headings.color,
                    headerTitleStyle: {
                        fontWeight: 'normal',
                        fontSize: 24,
                    },
                }}
                
            />
            <Tab.Screen
                name="UserSearch"
                component={UserSearchScreen}
                options={{ 
                    headerStyle: { 
                        backgroundColor: masterStyles.mainBackground.backgroundColor, 
                        borderColor: masterStyles.mainBackground.backgroundColor,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,

                    },
                    title: 'Search',
                    headerTintColor: masterStyles.headings.color,
                    headerTitleStyle: {
                        fontWeight: 'normal',
                        fontSize: 24,
                    },
                }}
                
            />
            <Tab.Screen
                name="Contacts"
                component={ContactsScreen}
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
        <NavigationContainer >
            <Stack.Navigator initialRouteName="Home">
                {user ? (
                    <>
                        <Stack.Screen
                            name="RecentChats"
                            component={RecentChatsScreen}
                            options={{ 
                                headerStyle: { 
                                    backgroundColor: masterStyles.mainBackground.backgroundColor, 
                                    borderColor: masterStyles.mainBackground.backgroundColor,
                                    elevation: 0,
                                    shadowOpacity: 0,
                                    borderBottomWidth: 0,
                                    
                                },
                                headerTintColor: masterStyles.headings.color,
                                headerTitleStyle: {
                                    fontWeight: 'normal',
                                    fontSize: 24,
                                    alignContent: 'center'
                                },
                            }}
                        />
                        <Stack.Screen
                            name="Contacts"
                            component={ContactsScreen}
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
                                    fontSize: 24,
                                    alignContent: 'center'
                                },
                            }}
                        />
                        <Stack.Screen
                            name="Payments"
                            component={PaymentsScreen}
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
                        />
                        <Stack.Screen
                            name="Account"
                            component={AccountScreen}
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
                        />
                        <Stack.Screen
                            name="UserAccountScreen"
                            component={UserAccountScreen}
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
                        />
                        <Stack.Screen
                            name="UserSearchScreen"
                            component={UserSearchScreen}
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
                        />
                        <Stack.Screen 
                        name="Home"
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
                                <Tabs {...props} extraData={user} component={HomeScreen}/>
                            )}
                        </Stack.Screen>
                    </>
                ) : (
                    <>
                        <Stack.Screen 
                        name="Login" 
                        component={LoginScreen} 
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
                        />
                        <Stack.Screen
                            name="Registration"
                            component={RegistrationScreen}
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
                            />
                    </>
                )} 
            </Stack.Navigator>
        </NavigationContainer>
    );
}
