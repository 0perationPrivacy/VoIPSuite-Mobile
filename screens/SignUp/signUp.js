import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {AuthWrapper, Input, Button} from '../../components';
import {navigate} from '../../helpers/RootNavigation';
import {useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {isEmpty} from '../../helpers/utils';
import {userActions} from '../../redux/actions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useTheme} from '../../theme';

const SignUp = props => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [params, setParams] = useState({email: '', password: '', confirm_password: '', server_url: ''});
  const [isValidate, setValidate] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  const {control, handleSubmit} = useForm();

  const validations = {
    email: true,
    password: true,
    confirm_password: true,
  };

  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.registration.isLoading);

  const onPressLogin = () => {
    navigate('Login');
  };

  const onChangeInput = (name, value) => {
    setParams(prevState => ({...prevState, [name]: value}));
  };

  const onInputLeave = (name, value) => {
    if (validations?.[name]) {
      let _errors = {...errors};
      if (isEmpty(value)) {
        Object.assign(_errors, {[name]: true});
      } else {
        delete _errors[name];
      }

      if (name === 'confirm_password' || name === 'password') {
        if (params.confirm_password != params.password) {
          Object.assign(_errors, {confirm_password: true, password: true});
        } else {
          delete _errors.confirm_password;
          delete _errors.password;
        }
      }

      setErrors(_errors);
    }
  };

  const onSetErrorMessageFromServer = errors => {
    setErrorMessages(errors);
  };

  useEffect(() => {
    setValidate(Object.keys(errors).length === 0);
  }, [errors]);

  const onPressSignup = data => {
    const {email, password, confirm_password} = params;

    if (!isValidate) return false;

    if (isEmpty(email)) {
      setErrors(prevState => ({...prevState, email: true}));
      return false;
    }
    if (isEmpty(password) || password != confirm_password) {
      setErrors(prevState => ({...prevState, password: true}));
      return false;
    }

    dispatch(userActions.register(data, onSetErrorMessageFromServer));
  };

  return (
    <AuthWrapper>
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <FontAwesome5 name="shield-alt" size={30} color={theme.colors.textOnAccent} />
        </View>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Get started with VoIP Suite</Text>
      </View>

      <View style={styles.form}>
        <Input
          placeholder="Username"
          defaultValue={params.email}
          control={control}
          name="email"
          onChangeInput={onChangeInput}
          onInputLeave={onInputLeave}
          isError={errors?.email}
          errors={errorMessages}
          icon={'user'}
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          defaultValue={params.password}
          control={control}
          name="password"
          onChangeInput={onChangeInput}
          onInputLeave={onInputLeave}
          isError={errors?.password}
          errors={errorMessages}
          icon={'lock'}
        />
        <Input
          placeholder="Confirm password"
          secureTextEntry
          type="password"
          defaultValue={params.confirm_password}
          control={control}
          name="confirm_password"
          onChangeInput={onChangeInput}
          onInputLeave={onInputLeave}
          isError={errors?.confirm_password}
          errors={errorMessages}
          icon={'lock'}
        />
        <Input
          placeholder="https://voip.operationprivacy.com"
          keyboardType="url"
          autoCapitalize="none"
          defaultValue={params.server_url}
          control={control}
          onSubmitEditing={handleSubmit(onPressSignup)}
          name="server_url"
          onChangeInput={onChangeInput}
          onInputLeave={onInputLeave}
        />
        <Text style={styles.hintText}>Custom server (optional) · self-hosted instances supported</Text>
      </View>

      <Button title="Sign Up" onPress={handleSubmit(onPressSignup)} loading={isLoading} containerStyle={styles.submitButton} />

      <View style={styles.createAccountWrap}>
        <Text style={styles.mutedText}>Already have an account?</Text>
        <TouchableOpacity onPress={onPressLogin}>
          <Text style={styles.createAccountText}> Log in</Text>
        </TouchableOpacity>
      </View>
    </AuthWrapper>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xxl,
    },
    logoBadge: {
      width: 64,
      height: 64,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      ...theme.typography.title1,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.typography.subhead,
      color: theme.colors.textSecondary,
    },
    form: {
      marginBottom: theme.spacing.lg,
    },
    hintText: {
      ...theme.typography.caption,
      color: theme.colors.textTertiary,
      marginTop: -theme.spacing.sm,
      marginLeft: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    submitButton: {
      marginTop: theme.spacing.xs,
    },
    createAccountWrap: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
      flexDirection: 'row',
      alignSelf: 'center',
    },
    mutedText: {
      ...theme.typography.subhead,
      color: theme.colors.textSecondary,
    },
    createAccountText: {
      ...theme.typography.subhead,
      fontFamily: theme.typography.bodyMedium.fontFamily,
      color: theme.colors.linkText,
    },
  });

export default SignUp;
