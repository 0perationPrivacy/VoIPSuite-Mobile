import React, {useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {navigate, navigateAndReset} from '../../helpers/RootNavigation';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import {profileActions, userActions} from '../../redux/actions';
import {store} from '../../redux/store';
import {getCurrentActiveProfile, getUserId} from '../../helpers/auth-header';
import Notifications from '../../helpers/notification/init';
import socketInstance from '../../helpers/socket';
import {socketMessageListener} from '../../helpers/notification';

const Splash = () => {
  const _user = useSelector(state => state.authentication);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      const {loggedIn, user} = _user;
      if (loggedIn && user) {
        getProfileList();
      } else {
        store.dispatch(userActions.logout());
      }
    }, 1000);
  }, []);

  const configureNotification = () => {
    Notifications.configure({
      onNotification: details => {
        const {data = {}} = details;
        console.log('huzaifa');
        if (!_.isEmpty(data)) {
          let profile = getCurrentActiveProfile();
          const __data = JSON.parse(JSON.parse(data));
          console.log('active profile ====>', profile);

          if (profile && profile?._id && __data && !_.isEmpty(__data)) {
            delete Object.assign(__data, {['_id']: __data['number']})['number'];

            let params = {number: __data, profile: {id: profile?._id}};
            // let params = {
            //   number: __data,
            //   profile: {id: '63eeb4dd1cb86d00347ecbe4'},
            // };
            console.log('huzaifa', params);
            navigate('Home', {data: params});
          }
        }
      },
    });
  };

  const getProfileList = () => {
    dispatch(profileActions.getProfileAction(navigateToHome));
  };

  const navigateToHome = () => {
    let isConnected = socketInstance.isConnected();
    console.log('is socket connected ====>', isConnected);

    if (!isConnected) {
      socketInstance.connect();
    }

    configureNotification();
    navigateAndReset('Messages');
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color="#3770e4" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Splash;
