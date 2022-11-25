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

const ChangePassword = (props) => {
  const [params, setParams] = useState({ c_password: "", old_password: "", password: "" });
  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState({});
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

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

  const onPressSignUp = () => {
    navigate('Signup');
  }

  const onPressChange = (data) => {
    dispatch(userActions.changePasswordAction(params))
  }

  const onChangeText = (name, text) => {
    setParams(prevState => ({ ...prevState, [name]: text }));
    if (name === 'c_password') {
      setConfirmPasswordError(text != params.password)
    }
  }

  const renderHeader = () => {
    return <Header title={'Change Password'} />
  }

  return (
    <Wrapper header={renderHeader()}>
      <Input
        placeholder="Old Password"
        defaultValue={params.old_password}
        control={control}
        name={'old_password'}
        autoFocus
        onChangeInput={onChangeText}
        secureTextEntry={isPasswordHide.old_password}
      />
      <Input
        placeholder="New Password"
        defaultValue={params.password}
        control={control}
        name={'password'}
        onChangeInput={onChangeText}
        secureTextEntry={isPasswordHide.old_password}
      />
      <Input
        placeholder="Confirm Password"
        defaultValue={params.c_password}
        control={control}
        onChangeInput={onChangeText}
        name={'c_password'}
        isError={confirmPasswordError}
        secureTextEntry={isPasswordHide.old_password}
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