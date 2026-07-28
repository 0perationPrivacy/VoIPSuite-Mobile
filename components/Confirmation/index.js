import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import CustomButton from '../Button';
import {useTheme} from '../../theme';

const Confirmation = ({
  isVisible = false,
  isLoading = false,
  onBackdropPress = () => {},
  onPressOk = () => {},
  onPressCancel = () => {},
  title = 'Call Setting',
  description = 'The call setting is already available. Do you want to override the call setting?',
  okText = 'Yes, override it',
  cancelText = 'No, Keep Old',
  ...rest
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Modal isVisible={isVisible} animationType="slide" transparent={true} onBackdropPress={onBackdropPress}>
      <View style={styles.container}>
        {!!title && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.description}>{description}</Text>
        <View style={styles.buttonRow}>
          <CustomButton title={okText} onPress={onPressOk} containerStyle={styles.button} />
          <CustomButton title={cancelText} variant="secondary" onPress={onPressCancel} containerStyle={styles.button} />
        </View>
      </View>
    </Modal>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
    },
    title: {
      ...theme.typography.title2,
      color: theme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    description: {
      ...theme.typography.subhead,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    buttonRow: {
      marginTop: theme.spacing.xl,
    },
    button: {
      marginBottom: theme.spacing.sm,
    },
  });

export default Confirmation;
