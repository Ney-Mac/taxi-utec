import React from "react";
import { StyleSheet, Image } from "react-native";
import { Marker } from "react-native-maps";

export default function GasStationMarker({ coords, ...props }) {

    return (
        <Marker
            title='bomba'
            description='Bomba com combustivel'
            coordinate={coords}
            onPress={() => { setShowDetail(true) }}
            style={styles.marker}
            {...props}
        >
            <Image
                source={require('../../assets/markers_img/gas-station-point.png')}
                style={styles.image}
                resizeMode="center"
            />
        </Marker>
    )
}

const styles = StyleSheet.create({
    marker: {
        width: "10%",
        height: "10%",
    },
    image: {
        width: '100%',
        height: '60%',
    },
});