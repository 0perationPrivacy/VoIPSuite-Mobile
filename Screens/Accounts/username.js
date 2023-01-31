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

const ChangeUsername = (props) => {
  const [params, setParams] = useState({ email: "" });
  const [isValidate, setValidate] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [userData, setUserData] = useState({});
  const [isBtnDisable, setIsBtnDisable] = useState(true);

  const validations = {
    email: true,
    password: true,
  }

  const { control, handleSubmit } = useForm();

  const dispatch = useDispatch();
  const user = useSelector(state => state.authentication.user);
  const isLoading = useSelector(state => state.authentication.isLoading);

  useEffect(() => {
    initUserData()
  }, [])

  const initUserData = () => {
    if (user && user?.token) {
      const { email } = user.data
      setUserData(user.data);
      setParams({ email: email });
      setIsBtnDisable(true)
    }
  }

  const onPressSignUp = () => {
    navigate('Signup');
  }

  const onPressChange = (data) => {
    dispatch(userActions.changeUsernameAction(data, initUserData, onSetErrorMessageFromServer))
  }

  const onInputLeave = (name, value) => {
    // if (validations?.[name]) {
    // 	let _errors = { ...errors };
    // 	if (isEmpty(value)) {
    // 		Object.assign(_errors, { [name]: true })
    // 	}
    // 	else { delete _errors[name] }

    // 	setErrors(_errors);
    // }

  }

  const onSetErrorMessageFromServer = (errors) => {
    setErrorMessages(errors);
  }

  useEffect(() => {
    setValidate(Object.keys(errors).length === 0)
  }, [errors])


  const renderHeader = () => {
    return <Header title={'Change Username'} />
  }

  return (
    <Wrapper header={renderHeader()}>
      <View>
        <Input
          placeholder="Enter Username"
          defaultValue={params.email}
          control={control}
          onInputLeave={onInputLeave}
          name={'email'}
          onChangeInput={() => setIsBtnDisable(false)}
        />
      </View>
      <Button
        containerStyle={styles.button}
        buttonStyle={styles.signInButton}
        title="Change"
        onPress={handleSubmit(onPressChange)}
        loading={isLoading}
        disabled={isBtnDisable}
      />
    </Wrapper>
  )
}

export default ChangeUsername;