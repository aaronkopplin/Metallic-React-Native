import { StyleSheet, Dimensions } from "react-native";

const screenSize= Dimensions.get("screen");
export default StyleSheet.create({
    
    mainBackground: {
        flex: 1,
        backgroundColor: '#2e2b30',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {},
    logo: {
        flex: .25,
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 30,
    },
    input: {
        width: screenSize.width * .95,
        height: 25, 
        backgroundColor: '#fff', 
        borderRadius: 3,
        paddingLeft: 5,
        justifyContent: 'space-evenly'

    },
    filler: {
        flex: .025,
        backgroundColor: '#2e2b30',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        flex: .1,
        backgroundColor: "#788eec",
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
});
