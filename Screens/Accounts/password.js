import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Input, Button, Header } from '../../components';
import { navigate } from '../../helpers/RootNavigation';
const logo = require('../../assets/logo-b.svg')
import styles from '../authCss';
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../redux/actions'
import Wrapper from '../../components/Wrapper';
import _ from 'lodash';
import { isEmpty, validURL } from '../../helpers/utils';

const ChangePassword = (props) => {
  const [params, setParams] = useState({ c_password: "", old_password: "", password: "" });
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [isValidate, setValidate] = useState(false);

  const isPasswordHide = {
    old_password: true,
    password: true,
    c_password: true
  }

  const { control, handleSubmit } = useForm();

  const dispatch = useDispatch();
  const user = useSelector(state => state.authentication.user);
  const isLoading = useSelector(state => state.authentication.isLoading);

  useEffect(() => {
    if (user && user?.token) {
      const { email } = user.data
      // setUserData(user.data);
      // setParams({ email: email });
    }
  }, [])

  const onPressChange = (data) => {
    const { c_password, old_password, password } = params;
    // if (!isValidate) return false;

    if (isEmpty(old_password)) {
      setErrors(prevState => ({ ...prevState, old_password: true }));
      return false;
    }
    if (isEmpty(password)) {
      setErrors(prevState => ({ ...prevState, password: true }));
      return false;
    }
    if (isEmpty(c_password)) {
      setErrors(prevState => ({ ...prevState, c_password: true }));
      return false;
    }
    if (c_password != password) {
      setErrors(prevState => ({ ...prevState, c_password: true, password: true }));
      return false;
    }

    dispatch(userActions.changePasswordAction(params))
  }

  const onChangeText = (name, text) => {
    setParams(prevState => ({ ...prevState, [name]: text }));
    let _errors = { ...errors };

    if (name === 'c_password') {
      if (text != params.password) {
        Object.assign(_errors, { [name]: true })
      } else {
        delete _errors[name]
      }

      setErrors(_errors)
    }
  }

  const renderHeader = () => {
    return <Header title={'Change Password'} />
  }

  const onInputLeave = (name, value) => {
    let objKey = isPasswordHide?.[name];
    if (objKey == true) {
      let _errors = { ...errors };
      let isValidated = true;

      if (name === 'c_password' && value != params.password) {
        isValidated = false;
      }

      if (isEmpty(value)) {
        isValidated = false;
      }

      if (isValidated) {
        delete _errors[name]
      } else {
        Object.assign(_errors, { [name]: true })
      }

      setErrors(_errors);
    }

  }

  const onSetErrorMessageFromServer = (errors) => {
    setErrorMessages(errors);
  }

  useEffect(() => {
    setValidate(Object.keys(errors).length === 0)
  }, [errors])

  return (
    <Wrapper header={renderHeader()}>
      <Input
        placeholder="Old Password"
        defaultValue={params.old_password}
        control={control}
        name={'old_password'}
        // autoFocus
        onChangeInput={onChangeText}
        secureTextEntry={isPasswordHide.old_password}
        onInputLeave={onInputLeave}
        isError={errors?.old_password}
        errors={errorMessages}
      />
      <Input
        placeholder="New Password"
        defaultValue={params.password}
        control={control}
        name={'password'}
        onChangeInput={onChangeText}
        secureTextEntry={isPasswordHide.old_password}
        onInputLeave={onInputLeave}
        isError={errors?.password}
        errors={errorMessages}
      />
      <Input
        placeholder="Confirm Password"
        defaultValue={params.c_password}
        control={control}
        onChangeInput={onChangeText}
        name={'c_password'}
        secureTextEntry={isPasswordHide.old_password}
        onInputLeave={onInputLeave}
        isError={errors?.c_password}
        errors={errorMessages}
      />
      <Button
        containerStyle={styles.button}
        buttonStyle={styles.signInButton}
        title="Change"
        onPress={handleSubmit(onPressChange)}
        loading={isLoading} />
    </Wrapper>
  )
}

export default ChangePassword;