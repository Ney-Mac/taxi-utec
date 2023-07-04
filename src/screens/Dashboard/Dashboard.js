import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, useColorScheme, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { showMessage } from "react-native-flash-message";
import * as Location from 'expo-location';
import {
	MenuButton,
} from '../../components/index';
import { MapContext } from "../../context/MapContext";
import { Button, Text } from "react-native-paper";
import { theme } from "../../core/theme";
import lightStyle from '../../core/mapLightStyle.json';
import darkStyle from '../../core/mapDarkStyle.json';
import Spinner from "react-native-loading-spinner-overlay/lib";

import { AuthContext } from '../../context/AuthContext'

const Dashboard = ({ navigation }) => {
	const { isLoading } = useContext(MapContext);
	const colorScheme = useColorScheme();
	const [mapStyle, setMapStyle] = useState(lightStyle);
	const [location, setLocation] = useState(null);
	const mapRef = useRef(null);

	useEffect(() => {
		(colorScheme === 'dark') ?
			setMapStyle(darkStyle) :
			setMapStyle(lightStyle);
		//
	}, [colorScheme]);

	useEffect(
		() => {
			getUserLocation();
		},
		[]
	);

	const getUserLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();

		if (status !== 'granted') {
			console.log(`erro getLocation ${status}`);

			showMessage({
				message: "Permissão negada",
				description: "Táxi Utec precisa de sua localização para funcionar",
				type: "info",
				duration: 4000,
				autoHide: true,
			})
			return;
		}

		let location = await Location.getCurrentPositionAsync({});

		console.log(location.coords);

		let latitude = location.coords.latitude;
		let longitude = location.coords.longitude;

		setLocation({
			latitude,
			longitude,
			latitudeDelta: 0.015,
			longitudeDelta: 0.015,
		});
	}

	const focusOnUser = () => {
		mapRef.current.animateToRegion(location, 1000);
	}

	return (
		<TouchableOpacity activeOpacity={1} style={styles.container}>
			<View style={styles.row}>
				<MenuButton onPress={() => { navigation.openDrawer() }} />
			</View>

			{isLoading ?
				<Spinner visible={isLoading} />
				:
				<View style={styles.mapContainer}>
					<MapView
						style={styles.map}
						provider={PROVIDER_GOOGLE}
						customMapStyle={mapStyle}
						initialRegion={location}
						ref={mapRef}
						showsUserLocation={true}
					>
					</MapView>
					<TouchableOpacity style={styles.rowMyLocationIcon} onPress={() => { focusOnUser() }}>
						<MaterialIcons
							name="my-location"
							size={32}
							color={theme.colors.primary}
						/>
					</TouchableOpacity>
				</View>
			}

			<View style={{ height: 80, width: '100%' }}>
				<Text>Text</Text>
			</View>

		</TouchableOpacity>
	);

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	mapContainer: {
		flex: 1,
		width: '100%',
		position: 'relative',
	},
	map: {
		height: "100%",
		width: "100%",
	},
	row: {
		width: '100%',
		zIndex: 10,
		//marginRight: 24
	},
	rowBtn: {
		height: 'auto',
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		paddingTop: 4,
	},
	rowMyLocationIcon: {
		zIndex: 10,
		position: 'absolute',
		bottom: 20,
		right: 20,
		backgroundColor: 'black',
		borderRadius: 50,
		padding: 12,
	}
});

export default Dashboard;