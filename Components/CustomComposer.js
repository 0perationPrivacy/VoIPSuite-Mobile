import React from 'react';
import { StyleSheet } from 'react-native';
import { InputToolbar } from 'react-native-gifted-chat';
import Metrics from '../helpers/Metrics';
import { getColorByTheme } from '../helpers/utils';
import CustomInput from './Input';

const styles = StyleSheet.create({
  inputToolbarBackground: {
    backgroundColor: getColorByTheme('#fff', '#2e2e2e'),
    // height : 100
  },
});

export default CustomComposer = props => {
  return (
    <CustomInput />
  )
};