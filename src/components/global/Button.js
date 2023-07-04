import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../../core/theme'

export default function Button({ mode, style, ...props }) {
  return (
    <TouchableOpacity style={styles.button}>
      <PaperButton
        style={[
          mode === 'outlined' && { backgroundColor: theme.colors.surface },
          style,
        ]}
        labelStyle={styles.text}
        mode={mode}
        {...props}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
})
