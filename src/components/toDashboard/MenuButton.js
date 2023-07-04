import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default function MenuButton({ mode, ...props }) {
    return (
        <Button
            style={styles.button}
            mode="elevated"
            icon={require('../../assets/list_img/list.png')}
            contentStyle={{ paddingLeft: 15 }}
            {...props}
        >
        </Button>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 'auto',
        position: 'absolute',
        top: 10 + getStatusBarHeight(),
        right: 10,
    }
});