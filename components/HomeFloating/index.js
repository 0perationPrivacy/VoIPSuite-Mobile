import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '../../theme';

const HomeFloating = ({onPressCompose = () => {}, ...rest}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPressCompose}
      activeOpacity={0.85}
      style={{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 56,
        borderRadius: 28,
        bottom: theme.spacing.xxl,
        right: theme.spacing.xl,
        backgroundColor: theme.colors.accent,
        shadowColor: theme.colors.shadow,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
      }}
      {...rest}>
      <Icon name="edit-2" size={22} color={theme.colors.textOnAccent} />
    </TouchableOpacity>
  );
};

export default HomeFloating;
