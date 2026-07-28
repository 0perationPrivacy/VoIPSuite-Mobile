import React from 'react';
import {Text, View} from 'react-native';
import {getVersion} from 'react-native-device-info';
import {useTheme} from '../../theme';

const Version = ({customStyle = {}}) => {
  const theme = useTheme();
  return (
    <View style={[{width: '100%', marginTop: theme.spacing.lg, marginBottom: theme.spacing.lg}, customStyle]}>
      <Text
        style={{
          color: theme.colors.textTertiary,
          textAlign: 'center',
          fontFamily: theme.typography.caption.fontFamily,
          fontSize: theme.typography.caption.fontSize,
        }}>{`v${getVersion()}`}</Text>
    </View>
  );
};

export default Version;
