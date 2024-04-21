import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';

const BrovitechInput = props => {
  const {
    showLabel,
    label,
    editable,
    value,
    onChangeText,
    errorMessage,
    autoCapitalize,
    placeholder,
    multiline,
  } = props;
  return (
    <>
      {showLabel && (
        <View style={{marginTop: 10}}>
          <Text style={{fontWeight: 'bold', color: '#2B3674', fontSize: 16}}>
            {label}
          </Text>
        </View>
      )}
      <View style={{flexDirection: 'row'}}>
        <TextInput
          editable={editable}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
          placeholder={placeholder}
          placeholderTextColor={'#767EB0'}
          multiline={multiline}
          style={[styles.baseStyles, errorMessage && {borderColor: 'red'}]}
        />
      </View>
      {Boolean(errorMessage !== '') && (
        <Text style={{marginTop: 3, color: 'red'}}>{errorMessage}</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  baseStyles: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    // marginVertical: 10,
    width: '100%',
    borderColor: '#DBDBDB',
    backgroundColor: '#FFFFFF',
    color: '#1E1F4B',
  },
});
export default BrovitechInput;
