import React from 'react'
import { StyleSheet, KeyboardAvoidingView, Pressable, Keyboard } from 'react-native'
import { theme } from '../../core/theme'

export default function Background({ children }) {
	return (
		<Pressable onPress={Keyboard.dismiss} style={styles.background}>
			<KeyboardAvoidingView style={styles.container} behavior="height">
				{children}
			</KeyboardAvoidingView>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		width: '100%',
		backgroundColor: theme.colors.surface,
	},
	container: {
		flex: 1,
		padding: 20,
		width: '100%',
		maxWidth: 340,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
})
