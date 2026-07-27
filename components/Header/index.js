import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useRoute} from '@react-navigation/native';
import {canGoBack, goBack} from '../../helpers/RootNavigation';
import {useTheme} from '../../theme';

const CustomHeader = ({isTitle = true, onBackProp = null, headerBody = null, headerRight = null, title = null}) => {
  const route = useRoute();
  const theme = useTheme();
  const styles = createStyles(theme);

  const onPressBack = () => {
    onBackProp ? onBackProp() : goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {canGoBack() && (
          <TouchableOpacity onPress={onPressBack} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={styles.backButton}>
            <Feather name={'arrow-left'} size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        )}
        {headerBody ? headerBody : isTitle && <Text style={styles.title}>{title ? title : route.name}</Text>}
      </View>
      {headerRight && headerRight()}
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
    },
    backButton: {
      marginRight: theme.spacing.md,
    },
    title: {
      ...theme.typography.headline,
      color: theme.colors.textPrimary,
    },
  });

export default CustomHeader;
