import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Input, Button, Header} from '../../components';
import {useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {userActions} from '../../redux/actions';
import Wrapper from '../../components/Wrapper';
import {isEmpty} from '../../helpers/utils';
import {useTheme} from '../../theme';

const ChangePassword = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [params, setParams] = useState({c_password: '', old_password: '', password: ''});
  const [errors, setErrors] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  const validations = {
    old_password: true,
    password: true,
    c_password: true,
  };

  const {control, handleSubmit} = useForm();

  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.authentication.isLoading);

  const onPressChange = () => {
    const {c_password, old_password, password} = params;

    if (isEmpty(old_password)) {
      setErrors(prevState => ({...prevState, old_password: true}));
      return false;
    }
    if (isEmpty(password)) {
      setErrors(prevState => ({...prevState, password: true}));
      return false;
    }
    if (isEmpty(c_password)) {
      setErrors(prevState => ({...prevState, c_password: true}));
      return false;
    }
    if (c_password != password) {
      setErrors(prevState => ({...prevState, c_password: true, password: true}));
      return false;
    }

    dispatch(userActions.changePasswordAction(params));
  };

  const onChangeText = (name, text) => {
    setParams(prevState => ({...prevState, [name]: text}));
    let _errors = {...errors};

    if (name === 'c_password') {
      if (text != params.password) {
        Object.assign(_errors, {[name]: true});
      } else {
        delete _errors[name];
      }

      setErrors(_errors);
    }
  };

  const onInputLeave = (name, value) => {
    let objKey = validations?.[name];
    if (objKey == true) {
      let _errors = {...errors};
      let isValidated = true;

      if (name === 'c_password' && value != params.password) {
        isValidated = false;
      }

      if (isEmpty(value)) {
        isValidated = false;
      }

      if (isValidated) {
        delete _errors[name];
      } else {
        Object.assign(_errors, {[name]: true});
      }

      setErrors(_errors);
    }
  };

  const mismatch = !!params.c_password && params.c_password !== params.password;

  return (
    <Wrapper header={<Header title={'Change password'} />}>
      <View style={styles.card}>
        <Text style={styles.label}>Current password</Text>
        <Input
          placeholder="Current password"
          defaultValue={params.old_password}
          control={control}
          name={'old_password'}
          onChangeInput={onChangeText}
          secureTextEntry={true}
          onInputLeave={onInputLeave}
          isError={errors?.old_password}
          errors={errorMessages}
          icon={'lock'}
        />

        <Text style={styles.label}>New password</Text>
        <Input
          placeholder="New password"
          defaultValue={params.password}
          control={control}
          name={'password'}
          onChangeInput={onChangeText}
          secureTextEntry={true}
          onInputLeave={onInputLeave}
          isError={errors?.password}
          errors={errorMessages}
          icon={'lock'}
        />
        <Input
          placeholder="Confirm new password"
          defaultValue={params.c_password}
          control={control}
          onChangeInput={onChangeText}
          name={'c_password'}
          secureTextEntry={true}
          onInputLeave={onInputLeave}
          isError={errors?.c_password}
          errors={errorMessages}
          icon={'lock'}
          customStyle={styles.lastInput}
        />
        <Text style={[styles.hint, mismatch && styles.hintError]}>
          {mismatch ? 'Passwords do not match.' : 'Use a long, unique passphrase — this unlocks every profile on your account.'}
        </Text>
      </View>
      <Button title="Update password" onPress={handleSubmit(onPressChange)} loading={isLoading} />
    </Wrapper>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    label: {
      ...theme.typography.footnoteMedium,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: theme.spacing.sm,
    },
    lastInput: {
      marginBottom: theme.spacing.md,
    },
    hint: {
      ...theme.typography.footnote,
      color: theme.colors.textSecondary,
    },
    hintError: {
      color: theme.colors.destructive,
    },
  });

export default ChangePassword;
