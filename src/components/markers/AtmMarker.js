import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';

export default function AtmMarker({ coords, ...props }) {
    return (
        <Marker
            title='ATM'
            description='ATM com dinheiro'
            coordinate={coords}
            style={styles.marker}
            {...props}
        >
            <Image
                source={require('../../assets/markers_img/pin.png')}
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
    }
})