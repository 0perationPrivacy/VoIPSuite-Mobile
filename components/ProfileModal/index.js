import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {useForm} from 'react-hook-form';
import CustomInput from '../Input';
import CustomButton from '../Button';
import {useTheme} from '../../theme';

const CustomModal = ({isVisible = false, isLoading = false, onBackdropPress = () => {}, onPressSave = () => {}, ...rest}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [profileName, setProfileName] = useState(null);
  const [errors, setErrors] = useState({});

  const {control, handleSubmit} = useForm();

  const onPress = data => {
    onPressSave(data, onSetErrorMessageFromServer);
  };

  const onSetErrorMessageFromServer = errors => {
    setErrors(errors);
  };

  useEffect(() => {}, [errors]);

  return (
    <Modal isVisible={isVisible} transparent={true} onBackdropPress={onBackdropPress}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Profile</Text>
        <CustomInput
          placeholder="Profile name"
          onChangeInput={(name, text) => setProfileName(text)}
          control={control}
          name="profile"
          isError={errors?.profile}
        />
        <CustomButton loading={isLoading} title={'Save'} onPress={handleSubmit(onPress)} />
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
      paddingVertical: theme.spacing.lg,
    },
    title: {
      ...theme.typography.title2,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.lg,
    },
  });

export default CustomModal;
