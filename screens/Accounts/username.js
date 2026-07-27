import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Input, Button, Header} from '../../components';
import {useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {userActions} from '../../redux/actions';
import Wrapper from '../../components/Wrapper';
import {useTheme} from '../../theme';

const ChangeUsername = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [params, setParams] = useState({email: ''});
  const [errorMessages, setErrorMessages] = useState({});
  const [isBtnDisable, setIsBtnDisable] = useState(true);

  const {control, handleSubmit} = useForm();

  const dispatch = useDispatch();
  const user = useSelector(state => state.authentication.user);
  const isLoading = useSelector(state => state.authentication.isLoading);

  useEffect(() => {
    initUserData();
  }, []);

  const initUserData = () => {
    if (user && user?.token) {
      const {email} = user.data;
      setParams({email: email});
      setIsBtnDisable(true);
    }
  };

  const onPressChange = data => {
    dispatch(userActions.changeUsernameAction(data, initUserData, onSetErrorMessageFromServer));
  };

  const onSetErrorMessageFromServer = errors => {
    setErrorMessages(errors);
  };

  return (
    <Wrapper header={<Header title={'Change username'} />}>
      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <Input
          placeholder="Enter username"
          autoCapitalize="none"
          defaultValue={params.email}
          control={control}
          name={'email'}
          icon={'user'}
          errors={errorMessages}
          onChangeInput={() => setIsBtnDisable(false)}
          customStyle={styles.lastInput}
        />
        <Text style={styles.hint}>This is the name you sign in with. It is never shared with your number provider.</Text>
      </View>
      <Button title="Save" onPress={handleSubmit(onPressChange)} loading={isLoading} disabled={isBtnDisable} />
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
  });

export default ChangeUsername;
