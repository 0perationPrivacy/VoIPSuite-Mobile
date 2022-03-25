import React from 'react';
import { StyleSheet } from 'react-native';
import { InputToolbar } from 'react-native-gifted-chat';
import Metrics from '../helpers/Metrics';
import { getColorByTheme } from '../helpers/utils';

const styles = StyleSheet.create({
  inputToolbarBackground: {
    backgroundColor: getColorByTheme('#fff', '#2e2e2e'),
    // height : 100
  },
});

export default MessageInput = props => (
  <InputToolbar containerStyle={styles.inputToolbarBackground} {...props}  />
);