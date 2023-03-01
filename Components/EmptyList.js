import React, { memo } from 'react'
import { View, StyleSheet, Text } from 'react-native';
import Metrics from '../helpers/Metrics';
import { getColorByTheme } from '../helpers/utils';

const EmptyList = ({ message = 'No messages found.' }) => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  emptyMessage: {
    fontSize: 18,
    color: getColorByTheme('#000', '#fff'),
    fontFamily: Metrics.fontMedium
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default memo(EmptyList);