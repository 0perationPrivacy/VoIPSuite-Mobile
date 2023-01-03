import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const Loader = ({ size = 'large', color = "#3770e4" }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 999,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    opacity: 0.6
  },
});

export default Loader;
