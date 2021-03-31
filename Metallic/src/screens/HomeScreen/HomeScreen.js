// import React, { useEffect, useState } from "react";
// import {
//     FlatList,
//     Keyboard,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { firebase } from "../../firebase/config";
// import { useNavigation } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";
// import { RecentChatsScreen } from "../RecentChatsScreen/RecentChatsScreen";
// import { masterStyles } from '../../../../Metallic/masterStyles';

// export default function HomeScreen(props) {
//     const [entityText, setEntityText] = useState("");
//     const [entities, setEntities] = useState([]);

//     const entityRef = firebase.firestore().collection("entities");
//     const userID = props.extraData.id;
//     const navigation = useNavigation();

//     useEffect(() => {
//         entityRef
//             .where("authorID", "==", userID)
//             .orderBy("createdAt", "desc")
//             .onSnapshot(
//                 (querySnapshot) => {
//                     const newEntities = [];
//                     querySnapshot.forEach((doc) => {
//                         const entity = doc.data();
//                         entity.id = doc.id;
//                         newEntities.push(entity);
//                     });
//                     setEntities(newEntities);
//                 },
//                 (error) => {
//                     console.log(error);
//                 }
//             );
//     }, []);

//     const onLogoutPress = () => {
//         console.log("Logout Pressed.");
//         firebase
//             .auth()
//             .signOut()
//             .then(() => {
//                 // alert("Logout Successful.");
//             });
//     };

//     const onAddButtonPress = () => {
//         if (entityText && entityText.length > 0) {
//             const timestamp = firebase.firestore.FieldValue.serverTimestamp();
//             const data = {
//                 text: entityText,
//                 authorID: userID,
//                 createdAt: timestamp,
//             };
//             entityRef
//                 .add(data)
//                 .then((_doc) => {
//                     setEntityText("");
//                     Keyboard.dismiss();
//                 })
//                 .catch((error) => {
//                     alert(error);
//                 });
//         }
//     };

//     const renderEntity = ({ item, index }) => {
//         return (
//             <View style={styles.entityContainer}>
//                 <Text style={styles.entityText}>
//                     {index}. {item.text}
//                 </Text>
//             </View>
//         );
//     };
//     const Stack = createStackNavigator();

//     return (
//         <View style={masterStyles.container}>
//             <View>
//                 <TouchableOpacity style={masterStyles.button} onPress={onLogoutPress}>
//                     <Text style={masterStyles.buttonText}>Log Out</Text>
//                 </TouchableOpacity>
//             </View>
//             <View style={masterStyles.formContainer}>
//                 <TextInput
//                     style={masterStyles.homeInput}
//                     placeholder="Add new entity"
//                     placeholderTextColor="#aaaaaa"
//                     onChangeText={(text) => setEntityText(text)}
//                     value={entityText}
//                     underlineColorAndroid="transparent"
//                     autoCapitalize="none"
//                 />
//                 <TouchableOpacity
//                     style={masterStyles.button}
//                     onPress={onAddButtonPress}
//                 >
//                     <Text style={masterStyles.buttonText}>Add</Text>
//                 </TouchableOpacity>
//             </View>
//             {entities && (
//                 <View style={masterStyles.listContainer}>
//                     <FlatList
//                         data={entities}
//                         renderItem={renderEntity}
//                         keyExtractor={(item) => item.id}
//                         removeClippedSubviews={true}
//                     />
//                 </View>
//             )}
//         </View>
//     );
// }
