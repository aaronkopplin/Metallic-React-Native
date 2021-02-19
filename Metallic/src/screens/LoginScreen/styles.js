import { StyleSheet, Dimensions } from "react-native";

const screenSize= Dimensions.get("screen");
export default StyleSheet.create({
    
    mainBackground: {
        flex: 1,
        backgroundColor: '#1e1c21',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    title: {},
    logo: {
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 30,
        justifyContent: "space-between",
    },
    headings: {
        color: '#79777d',
        fontWeight: 'bold',
        fontSize: 25,
    },
    input: {
        width: screenSize.width - 60,
        fontSize: 18,
        height: 25,
        backgroundColor: '#fff', 
        borderRadius: 3,
        paddingLeft: 5,
        
    },
    filler: {
        flex: .025,
        backgroundColor: '#2e2b30',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
