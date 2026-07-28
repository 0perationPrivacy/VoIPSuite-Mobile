import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../../theme';

const Wrapper = ({children, header}) => {
  const theme = useTheme();

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      {header}
      <ScrollView contentContainerStyle={{padding: theme.spacing.lg, flexGrow: 1}}>{children}</ScrollView>
    </View>
  );
};

export default Wrapper;
