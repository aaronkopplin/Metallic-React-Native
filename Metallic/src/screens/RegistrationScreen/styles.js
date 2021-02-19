import { StyleSheet } from "react-native";

export default StyleSheet.create({
    mainBackground: {
        flex: 1,
        backgroundColor: '#1e1c21',
        alignItems: 'center',
    },
    title: {},
    logo: {
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 30,
    },
    headings: {
        color: '#79777d',
        fontWeight: 'bold',
        fontSize: 25,
    },
    input: {
        fontSize: 18,
        height: 25,
        backgroundColor: '#fff', 
        borderRadius: 3,
        paddingLeft: 5,
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20,
    },
    footerText: {
        fontSize: 16,
        color: "#fff",
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16,
    },
});
