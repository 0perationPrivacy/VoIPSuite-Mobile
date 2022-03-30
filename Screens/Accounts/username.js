import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Image } from 'react-native-elements'
import { AuthWrapper, Input, Button, Header } from '../../components';
import { navigate } from '../../helpers/RootNavigation';
const logo = require('../../assets/logo-b.svg')
import styles from '../authCss';
import globalStyle from '../../style';
import { useForm } from 'react-hook-form'
import { isEmpty } from '../../helpers/utils';
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../../redux/actions'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather'
import Metrics from '../../helpers/Metrics';
import Wrapper from '../../components/Wrapper';
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox';

const ChangeUsername = (props) => {
  const [params, setParams] = useState({ username: "" });
  const [isValidate, setValidate] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [userData, setUserData] = useState({});

  const validations = {
    email: true,
    password: true,
  }

  const { control, handleSubmit } = useForm();

  const dispatch = useDispatch();
  const user = useSelector(state => state.authentication.user);

  useEffect(() => {
    if (user && user?.token) {
      const { email } = user.data
      setUserData(user.data);
      setParams({ username: email });
    }
  }, [])

  const onPressSignUp = () => {
    navigate('Signup');
  }

  const onPressSignIn = (data) => {
    // const { email, password } = data;

    // console.log(data);

    // if (!isValidate) return false;

    // if (isEmpty(email)) {
    // 	setErrors(prevState => ({ ...prevState, email: true }));
    // 	return false;
    // }
    // if (isEmpty(password)) {
    // 	setErrors(prevState => ({ ...prevState, password: true }));
    // 	return false;
    // }

    // dispatch(userActions.login(data, onSetErrorMessageFromServer))
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
          keyboardType="url"
          defaultValue={params.username}
          onChangeText={(text) => setServerUrl(text)}
          control={control}
          onInputLeave={onInputLeave}
        />
      </View>
      <Button containerStyle={styles.button} buttonStyle={styles.signInButton} title="Change" onPress={handleSubmit(onPressSignIn)} />
    </Wrapper>
  )
}

export default ChangeUsername;