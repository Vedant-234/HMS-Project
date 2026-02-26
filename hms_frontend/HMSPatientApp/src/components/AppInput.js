import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function AppInput(props) {
  return (
    <TextInput
      {...props}
      style={styles.input}
      placeholderTextColor={colors.placeholder}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    color: colors.text
  }
});
