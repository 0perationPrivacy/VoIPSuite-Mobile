import React from 'react';
import {Text, View} from 'react-native';
import {getVersion} from 'react-native-device-info';
import styles from './style';

const Version = ({customStyle = {}}) => {
  return (
    <View style={[styles.versionContainer, customStyle]}>
      <Text style={styles.versionText}>{`v${getVersion()}`}</Text>
    </View>
  );
};

export default Version;
