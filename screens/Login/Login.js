import React, {useEffect, useState} from 'react';
import {Text, View, Linking, TouchableOpacity, StyleSheet} from 'react-native';
import {AuthWrapper, Input, Button} from '../../components';
import {navigate} from '../../helpers/RootNavigation';
import {useForm} from 'react-hook-form';
import {isEmpty, validURL} from '../../helpers/utils';
import {useDispatch, useSelector} from 'react-redux';
import {userActions} from '../../redux/actions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Version from '../../components/Version';
import {useTheme} from '../../theme';

const Login = props => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [params, setParams] = useState({email: '', password: '', server_url: ''});
  const [isValidate, setValidate] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  const validations = {
    email: {validation: true},
    password: {validation: true},
    server_url: {validation: true, cb: validURL},
  };

  const {control, handleSubmit} = useForm();

  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.authentication.isLoading);

  const onPressSignUp = () => {
    navigate('Signup');
  };

  const onPressSignIn = data => {
    const {email, password, server_url} = data;
    if (!isValidate) return false;

    if (isEmpty(email)) {
      setErrors(prevState => ({...prevState, email: true}));
      return false;
    }
    if (isEmpty(password)) {
      setErrors(prevState => ({...prevState, password: true}));
      return false;
    }

    if (!isEmpty(server_url)) {
      data.server_url = server_url;
    }

    dispatch(userActions.login(data, onSetErrorMessageFromServer));
  };

  const onInputLeave = (name, value) => {
    let objKey = validations?.[name];
    if (objKey?.validation == true) {
      let _errors = {...errors};
      let cb = objKey?.cb;
      let isValidated = true;

      if (cb && typeof cb == 'function') {
        if (!isEmpty(value) && !cb(value)) {
          isValidated = false;
        }
      } else if (isEmpty(value)) {
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

  const onSetErrorMessageFromServer = errors => {
    setErrorMessages(errors);
  };

  useEffect(() => {
    setValidate(Object.keys(errors).length === 0);
  }, [errors]);

  const openUrlLink = link => {
    Linking.openURL(link);
  };

  const onChangeServerUrl = (name, value) => {};

  return (
    <AuthWrapper>
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <FontAwesome5 name="shield-alt" size={30} color={theme.colors.textOnAccent} />
        </View>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your VoIP Suite account</Text>
      </View>

      <View style={styles.form}>
        <Input
          placeholder="Username"
          defaultValue={params.email}
          control={control}
          onInputLeave={onInputLeave}
          isError={errors?.email}
          errors={errorMessages}
          name="email"
          icon={'user'}
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          defaultValue={params.password}
          control={control}
          onInputLeave={onInputLeave}
          isError={errors?.password}
          errors={errorMessages}
          name="password"
          icon={'lock'}
        />

        <View style={styles.serverUrlWrapper}>
          <Input
            placeholder="https://voip.operationprivacy.com"
            keyboardType="url"
            autoCapitalize="none"
            defaultValue={params.server_url}
            control={control}
            name="server_url"
            onInputLeave={onInputLeave}
            onChangeInput={onChangeServerUrl}
          />
          {errors?.server_url ? (
            <Text style={styles.fieldErrorMessage}>Incorrect URL</Text>
          ) : (
            <Text style={styles.hintText}>Custom server (optional) · self-hosted instances supported</Text>
          )}
        </View>
      </View>

      <Button title="Log In" onPress={handleSubmit(onPressSignIn)} loading={isLoading} containerStyle={styles.submitButton} />

      <View style={styles.createAccountWrap}>
        <Text style={styles.mutedText}>Don't have an account?</Text>
        <TouchableOpacity onPress={onPressSignUp}>
          <Text style={styles.createAccountText}> Sign up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.socialLinksWrap}>
        <TouchableOpacity style={styles.socialLinksItem} onPress={() => openUrlLink('https://www.twitter.com/0perationP')}>
          <FontAwesome5 name="twitter" size={20} color={theme.colors.textTertiary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialLinksItem} onPress={() => openUrlLink('https://github.com/0perationPrivacy/')}>
          <FontAwesome5 name="github" size={20} color={theme.colors.textTertiary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialLinksItem} onPress={() => openUrlLink('https://www.operationprivacy.com/donate')}>
          <FontAwesome5 name="credit-card" size={20} color={theme.colors.textTertiary} />
        </TouchableOpacity>
      </View>

      <Version />
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
    serverUrlWrapper: {
      marginTop: theme.spacing.xs,
    },
    hintText: {
      ...theme.typography.caption,
      color: theme.colors.textTertiary,
      marginTop: -theme.spacing.sm,
      marginLeft: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    fieldErrorMessage: {
      ...theme.typography.caption,
      color: theme.colors.destructive,
      marginTop: -theme.spacing.sm,
      marginLeft: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    submitButton: {
      marginTop: theme.spacing.xs,
    },
    createAccountWrap: {
      marginTop: theme.spacing.xl,
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
    socialLinksWrap: {
      flexDirection: 'row',
      marginTop: theme.spacing.xxl,
      justifyContent: 'center',
    },
    socialLinksItem: {
      marginHorizontal: theme.spacing.md,
    },
  });

export default Login;
