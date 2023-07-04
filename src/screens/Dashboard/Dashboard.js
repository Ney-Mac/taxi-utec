import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, useColorScheme, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { showMessage } from "react-native-flash-message";
import * as Location from 'expo-location';
import {
	MenuButton,
} from '../../components/index';
import { MapContext } from "../../context/MapContext";
import { Button } from "react-native-paper";
import { theme } from "../../core/theme";
import lightStyle from '../../core/mapLightStyle.json';
import darkStyle from '../../core/mapDarkStyle.json';
import Spinner from "react-native-loading-spinner-overlay/lib";

import { AuthContext } from '../../context/AuthContext'

const Dashboard = ({ navigation }) => {
	const { isLoading } = useContext(MapContext);
	const [showDetail, setShowDetail] = useState(false);
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

	return (
		<TouchableOpacity activeOpacity={1} onPress={() => { setShowDetail(false) }}>
			<View style={styles.row}>
				<MenuButton onPress={() => { navigation.openDrawer() }} />
			</View>

			{isLoading ?
				<Spinner visible={isLoading} />
				:
				<MapView
					style={styles.map}
					showsUserLocation={true}
					provider={PROVIDER_GOOGLE}
					customMapStyle={mapStyle}
					initialRegion={location}
					ref={mapRef}
				>
					
				</MapView>
			}

			{showDetail && <TouchableOpacity activeOpacity={1} style={styles.markerDetail}>
				<View style={styles.rowBtn}>
					<Button
						onPress={() => { setShowDetail(false) }}
						icon={() => (
							<Icon
								name='close'
								size={30}
								color={theme.colors.primary}
							/>
						)}
					/>
				</View>
			</TouchableOpacity>}

		</TouchableOpacity>
	);

}

const styles = StyleSheet.create({
	map: {
		height: "100%",
		width: "100%",
	},
	row: {
		zIndex: 10,
		marginRight: 24
	},
	rowBtn: {
		height: 'auto',
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		paddingTop: 4,
	}
});

export default Dashboard;