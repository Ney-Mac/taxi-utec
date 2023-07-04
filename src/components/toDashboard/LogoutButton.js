import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function LogoutButton({ mode, style, ...props }) {
    return (
        <Button
            style={styles.btn}
            mode="contained"
            labelStyle={styles.text}
            {...props}
        />
    )
}

const styles = StyleSheet.create({
    btn: {
        marginHorizontal: '10%',
        marginVertical: 10,
        paddingVertical: 2,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 26,
    },
});