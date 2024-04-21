import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

function BrovitechButton(props) {
  const {type, children, style, onPress, textColor} = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      {...props}
      style={[styles.baseStyles, style]}>
      <View>
        <Text style={{color: textColor, alignSelf: 'center'}}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseStyles: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'lightBlue',
    width: '50%',
    borderWidth: 1,
    alignSelf: 'center',
  },
});
export default BrovitechButton;
