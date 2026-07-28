import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Input, Button, Header} from '../../components';
import SwitchRow from '../../components/SwitchRow';
import {useForm} from 'react-hook-form';
import {isEmpty} from '../../helpers/utils';
import {useDispatch, useSelector} from 'react-redux';
import {emailActions, profileActions} from '../../redux/actions';
import Wrapper from '../../components/Wrapper';
import _ from 'lodash';
import {useTheme} from '../../theme';

const EmailSettings = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [params, setParams] = useState({email: '', password: '', sender_email: '', to_email: '', host: '', port: '', secure: false});
  const [isValidate, setValidate] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEmailInfo, setEmailInfo] = useState(false);

  const validations = {
    email: true,
    password: true,
    sender_email: true,
    to_email: true,
    host: true,
    port: true,
  };

  const {control, handleSubmit} = useForm();

  const dispatch = useDispatch();
  const settings = useSelector(state => state.email.settings);
  const isLoading = useSelector(state => state.email.isLoading);
  const profiles = useSelector(state => state.profile.items);

  useEffect(() => {
    getEmailSettings();
  }, []);

  useEffect(() => {
    if (!_.isEmpty(settings)) {
      setParams(settings);
      setEmailInfo(true);
    }
  }, [settings]);

  const getEmailSettings = () => {
    dispatch(emailActions.getEmailSettingsAction());
  };

  const onPressSaveEmail = () => {
    if (!isValidate) return false;

    dispatch(emailActions.createEmailCredAction(params, onSetErrorMessageFromServer));
  };

  const onPressChangeProfileEmailSettings = (id, isChecked) => {
    let status = isChecked ? 'false' : 'true';
    let data = {setting_id: id, status};

    dispatch(emailActions.saveProfileEmailSettingsAction(data, onSuccessProfleSettingsSave));
  };

  const onInputLeave = (name, value) => {
    if (validations?.[name]) {
      let _errors = {...errors};
      if (isEmpty(value)) {
        Object.assign(_errors, {[name]: true});
      } else {
        delete _errors[name];
      }

      setErrors(_errors);
    }
  };

  const onSetErrorMessageFromServer = _errors => {
    setErrors(_errors);
  };

  const onChangeInputs = (name, val) => {
    setParams(prevState => ({...prevState, [name]: val}));
  };

  const onSuccessProfleSettingsSave = profile => {
    const {emailnotification, id} = profile;
    let __profiles = [...profiles];

    __profiles.filter(item => {
      if (item.id === id) {
        item.emailnotification = emailnotification;
        return true;
      }
    });

    dispatch(profileActions.setProfileList(__profiles));
  };

  useEffect(() => {
    setValidate(Object.keys(errors).length === 0);
  }, [errors]);

  const onChangeSecure = () => {
    setParams(prevState => ({...prevState, secure: !prevState.secure}));
  };

  const renderSectionTitle = (title, description) => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {!!description && <Text style={styles.sectionDescription}>{description}</Text>}
      </View>
    );
  };

  const renderProfileList = () => {
    if (!isEmailInfo || !profiles?.length) return null;

    return (
      <View style={styles.card}>
        {renderSectionTitle('Forward per profile', 'Choose which profiles forward incoming messages to your inbox.')}
        {profiles.map((item, index) => {
          const {profile, emailnotification, id} = item;
          const isChecked = emailnotification === 'true';
          const isLast = index + 1 === profiles.length;

          return (
            <SwitchRow
              key={index}
              title={profile}
              value={isChecked}
              onValueChange={() => onPressChangeProfileEmailSettings(id, isChecked)}
              style={!isLast && styles.dividedRow}
            />
          );
        })}
      </View>
    );
  };

  return (
    <Wrapper header={<Header title={'Email forwarding'} />}>
      <View style={styles.card}>
        {renderSectionTitle('SMTP account', 'Messages are forwarded through your own mail server — nothing goes through a third party.')}
        <Input
          placeholder="SMTP username"
          autoCapitalize="none"
          defaultValue={params.email}
          onChangeInput={onChangeInputs}
          control={control}
          onInputLeave={onInputLeave}
          isError={errors?.email}
          name="email"
          icon={'user'}
        />
        <Input
          placeholder="SMTP password"
          autoCapitalize="none"
          defaultValue={params.password}
          onChangeInput={onChangeInputs}
          control={control}
          onInputLeave={onInputLeave}
          secureTextEntry
          isError={errors?.password}
          name="password"
          icon={'lock'}
        />
        <Input
          placeholder="Host (smtp.domain.com)"
          autoCapitalize="none"
          keyboardType="url"
          defaultValue={params.host}
          onChangeInput={onChangeInputs}
          control={control}
          onInputLeave={onInputLeave}
          isError={errors?.host}
          name="host"
          icon={'server'}
        />
        <Input
          placeholder="Port (465 or 587)"
          keyboardType="number-pad"
          defaultValue={params.port}
          onChangeInput={onChangeInputs}
          control={control}
          onInputLeave={onInputLeave}
          isError={errors?.port}
          name="port"
          icon={'plug'}
        />
        <SwitchRow title="Use TLS/SSL" description="Recommended. Required for port 465." value={!!params.secure} onValueChange={onChangeSecure} />
      </View>

      <View style={styles.card}>
        {renderSectionTitle('Addresses')}
        <Input
          placeholder="From address"
          keyboardType={'email-address'}
          autoCapitalize="none"
          defaultValue={params.sender_email}
          onChangeInput={onChangeInputs}
          control={control}
          onInputLeave={onInputLeave}
          isError={errors?.sender_email}
          name="sender_email"
          icon={'paper-plane'}
        />
        <Input
          placeholder="Forward to address"
          keyboardType={'email-address'}
          autoCapitalize="none"
          defaultValue={params.to_email}
          onChangeInput={onChangeInputs}
          control={control}
          onInputLeave={onInputLeave}
          isError={errors?.to_email}
          name="to_email"
          icon={'inbox'}
          customStyle={styles.lastInput}
        />
      </View>

      {renderProfileList()}

      <Button title="Save settings" onPress={handleSubmit(onPressSaveEmail)} loading={isLoading} />
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
    sectionHeader: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.headline,
      color: theme.colors.textPrimary,
    },
    sectionDescription: {
      ...theme.typography.footnote,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    dividedRow: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },
    lastInput: {
      marginBottom: 0,
    },
  });

export default EmailSettings;
