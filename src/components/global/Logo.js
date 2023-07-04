import React from 'react'
import { Image, StyleSheet } from 'react-native'
//import TaxiUtecLogo from './TaxiUtecLogo'

export default function Logo({ source, withSlogan = true, style }) {
	return (
		<Image
			source={
				withSlogan? 
				require('../../../assets/logo/taxi-utec-logo.png') 
				: 
				require('../../../assets/name_icon/taxi-utec.png')
			}
			style={{ ...styles.image, ...style }}
		/>
	)
}

const styles = StyleSheet.create({
	image: {
		width: 182,
		height: 182,
		marginBottom: 8,
	}
})
