import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {useForm} from 'react-hook-form';
import {Input} from '../../components';
import Wrapper from '../../components/Wrapper';
import {Button, Header} from '../../components';
import Feather from 'react-native-vector-icons/Feather';
import {isEmpty} from '../../helpers/utils';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import {profileActions, settingsActions} from '../../redux/actions';
import {callActions} from '../../redux/actions/call';
import Confirmation from '../../components/Confirmation';
import {navigateAndReset} from '../../helpers/RootNavigation';
import RBSheet from 'react-native-raw-bottom-sheet';
import NumberList from '../../components/NumberList';
import {useTheme} from '../../theme';

const ProfileSettings = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [profileName, setProfileName] = useState(null);
  const [activeTab, setActiveTab] = useState('twilio');
  const [tiwlioSid, setTiwlioSid] = useState(null);
  const [tiwlioToken, setTiwlioToken] = useState(null);
  const [telnyxKey, setTelnyxKey] = useState(null);
  const [telnyxPublicKey, setTelnyxPublicKey] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [isDeleteBtn, setIsDeleteBtn] = useState(false);
  const [numbersList, setNumberList] = useState([]);
  const [telnyxNumbersList, setTelnyxNumberList] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [__SID, setSID] = useState(null);

  //modal
  const [isModalVisible, setIsVisibleModal] = useState(false);
  const [isModalDeleteVisible, setIsVisibleDeleteModal] = useState(false);

  const {control} = useForm();

  const isLoading = useSelector(state => state.settings.isLoading);
  const profileSettings = useSelector(state => state.settings.profileSettings);
  const numbers = useSelector(state => state.settings.numbers);
  const user = useSelector(state => state.authentication.user);

  const dispatch = useDispatch();
  const refRBSheet = useRef();

  useEffect(() => {
    if (profileSettings && !_.isEmpty(profileSettings)) {
      const {profile, type, id, sid, number} = profileSettings;
      setProfileName(profile);
      setProfileId(id);
      setActiveTab(type);

      if (type === 'telnyx') {
        const {api_key, telnyx_public_key} = profileSettings;
        setTelnyxKey(api_key);
        setTelnyxPublicKey(telnyx_public_key);
        if (api_key) {
          setIsDeleteBtn(true);
        }
      } else {
        const {twilio_sid, twilio_token} = profileSettings;
        setTiwlioSid(twilio_sid);
        setTiwlioToken(twilio_token);

        if (twilio_token) {
          setIsDeleteBtn(true);
        }
      }

      setPhoneNumber(number);
      setSID(sid);

      onPressGetNumber();
    }
  }, []);

  useEffect(() => {
    if (numbers && _.isArray(numbers)) {
      let data = [];
      numbers.forEach(item => {
        const {phoneNumber, phone_number, sid, id} = item;
        let number = activeTab === 'twilio' ? phoneNumber : phone_number;
        let _sid = activeTab === 'twilio' ? sid : id;

        data.push({label: number, value: {number, _sid}});
      });

      if (activeTab === 'twilio') {
        setNumberList(data);
      } else {
        setTelnyxNumberList(data);
      }
    }
  }, [numbers]);

  const returnData = () => {
    let data = {};
    if (activeTab === 'twilio') {
      data = {
        ...profileSettings,
        type: activeTab,
        twilio_sid: tiwlioSid,
        twilio_token: tiwlioToken,
        sid: __SID,
        twilio_number: phoneNumber,
      };
    } else {
      data = {
        ...profileSettings,
        type: activeTab,
        api_key: telnyxKey,
        telnyx_public_key: telnyxPublicKey,
        sid: __SID,
        number: phoneNumber,
      };
    }

    const {_id} = user.data;
    Object.assign(data, {setting: profileId, user: _id});

    return data;
  };

  const onPressSave = () => {
    let data = returnData();
    dispatch(
      settingsActions.checkProfileSettingsAction(data, checkProfileSuccess),
    );
  };

  const checkProfileSuccess = () => {
    setIsVisibleModal(true);
  };

  const onCancelConfirmCheckModal = () => {
    setIsVisibleModal(false);
  };

  const onOkConfirmCheckModal = () => {
    setIsVisibleModal(false);

    let data = returnData();
    Object.assign(data, {override: 'true'});

    dispatch(
      settingsActions.createProfileSettingsAction(data, () => {
        // Provisioning the SIP credentials just now doesn't retroactively
        // connect the call engine — it only (re)registers when explicitly
        // told to, on login or profile switch (HomeHeader). Without this,
        // the dialpad would keep showing "not set up" until the user
        // switched away from and back to this profile.
        if (profileId) {
          dispatch(callActions.connectCallEngineAction(profileId));
        }
      }),
    );
  };

  const onPressDeleteProfile = () => {
    if (user && user?.token) {
      const {_id} = user.data;
      let data = {user: _id, profile_id: profileId};
      dispatch(profileActions.deleteProfileAction(data, onDeleteSuccess));
    }
  };

  const onDeleteSuccess = () => {
    navigateAndReset('Messages');
  };

  const onPressTabChange = tabVal => {
    setActiveTab(tabVal);
  };

  const onPressGetNumber = () => {
    // if (profileSettings && !_.isEmpty(profileSettings)) {
    let data = returnData();
    dispatch(settingsActions.getNumbersListByProfileAction(data, activeTab));
    // }
  };

  const onChangePhone = obj => {
    setPhoneNumber(obj.number);
    setSID(obj._sid);
  };


  const openBottomSheet = () => {
    refRBSheet.current.open();
  };

  const onCloseBottomSheet = () => {
    refRBSheet.current.close();
  };

  const onChangeNumber = value => {
    if (isEmpty(value)) return;

    onChangePhone(value);
    onCloseBottomSheet();
  };

  const renderHeader = () => {
    return <Header title="Profile Settings" />;
  };

  const renderTabs = () => {
    return (
      <View style={styles.tabsWrapper}>
        <TouchableOpacity
          style={[styles.tabItemButton, activeTab === 'telnyx' && styles.activeTabItemButton]}
          onPress={() => onPressTabChange('telnyx')}>
          <Text style={[styles.tabItemButtonText, activeTab === 'telnyx' && styles.activeTabItemButtonText]}>Telnyx</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItemButton, activeTab === 'twilio' && styles.activeTabItemButton]}
          onPress={() => onPressTabChange('twilio')}>
          <Text style={[styles.tabItemButtonText, activeTab === 'twilio' && styles.activeTabItemButtonText]}>Twilio</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderProfileSettingInput = () => {
    return (
      <View style={styles.profileSettingsInputWrapper}>
        <Input
          name="profileName"
          control={control}
          onChangeText={text => setProfileName(text)}
          customStyle={styles.profileInput}
          placeholder="Profile"
          defaultValue={profileName}
          icon="user"
        />
        <TouchableOpacity onPress={() => setIsVisibleDeleteModal(true)} style={styles.deleteProfileIcon}>
          <Feather name="trash" size={20} color={theme.colors.destructive} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderTwilioInputs = () => {
    return (
      <>
        <Text style={styles.providersInputTitle}>Twilio Keys</Text>
        <Input
          name="tiwlioSid"
          control={control}
          onChangeInput={(name, text) => setTiwlioSid(text)}
          placeholder="Enter Twilio SID"
          defaultValue={tiwlioSid}
          icon="key"
        />
        <Input
          name="tiwlioToken"
          control={control}
          onChangeInput={(name, text) => setTiwlioToken(text)}
          placeholder="Enter Twilio Token"
          defaultValue={tiwlioToken}
          icon="key"
        />
      </>
    );
  };

  const renderTelnyxInputs = () => {
    return (
      <>
        <Text style={styles.providersInputTitle}>Telnyx Key</Text>
        <Input
          name="telnyxKey"
          control={control}
          onChangeInput={(name, text) => setTelnyxKey(text)}
          placeholder="Enter Telnyx API Key"
          defaultValue={telnyxKey}
          icon="key"
        />
        <Input
          name="telnyxPublicKey"
          control={control}
          onChangeInput={(name, text) => setTelnyxPublicKey(text)}
          placeholder="Enter Telnyx Public Key"
          defaultValue={telnyxPublicKey}
          icon="shield"
        />
        <Text style={styles.providersInputHint}>
          From your Telnyx Portal under Account → Public Key. Required to verify that incoming messages really came from Telnyx.
        </Text>
      </>
    );
  };

  const renderNumberList = () => {
    return (
      <View style={styles.getNumberOuterRow}>
        <View style={styles.getNumberContainer}>
          <Button buttonStyle={styles.getNumberBtn} title={'Get Number'} onPress={onPressGetNumber} containerStyle={styles.getNumberBtnContainer} />
          <TouchableOpacity style={styles.selectContactContainer} onPress={openBottomSheet}>
            <Text style={styles.selectContactText} numberOfLines={1}>
              {phoneNumber ? phoneNumber : 'Select Number'}
            </Text>
          </TouchableOpacity>
        </View>
        {isDeleteBtn && (
          <TouchableOpacity style={styles.numberDeleteIcon}>
            <Feather name="trash" size={20} color={theme.colors.destructive} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderBottomSheet = () => {
    let height = Dimensions.get('window').height - 100;

    return (
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={height}
        customStyles={{
          container: styles.sheetContainer,
        }}>
        <NumberList
          onPressBack={onCloseBottomSheet}
          data={activeTab === 'twilio' ? numbersList : telnyxNumbersList}
          onSubmit={onChangeNumber}
        />
      </RBSheet>
    );
  };

  return (
    <Wrapper header={renderHeader()}>
      <View style={styles.container}>
        {renderTabs()}
        {renderProfileSettingInput()}
        <View style={styles.providersContainer}>
          {activeTab === 'telnyx' ? renderTelnyxInputs() : renderTwilioInputs()}
        </View>
        {renderNumberList()}
        <Button title="Save" onPress={onPressSave} loading={isLoading} containerStyle={styles.saveButton} />
        <Confirmation
          isVisible={isModalVisible}
          onPressCancel={onCancelConfirmCheckModal}
          onPressOk={onOkConfirmCheckModal}
        />
        <Confirmation
          isVisible={isModalDeleteVisible}
          onPressCancel={() => setIsVisibleDeleteModal(false)}
          onPressOk={onPressDeleteProfile}
          title=""
          description="Do you want to delete this Profile?"
          okText="Yes, Delete"
          cancelText="No"
        />
        {renderBottomSheet()}
      </View>
    </Wrapper>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    tabsWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xs,
    },
    tabItemButton: {
      width: '49%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.md,
    },
    activeTabItemButton: {
      backgroundColor: theme.colors.accent,
    },
    tabItemButtonText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textSecondary,
    },
    activeTabItemButtonText: {
      color: theme.colors.textOnAccent,
    },
    profileSettingsInputWrapper: {
      marginTop: theme.spacing.xl,
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileInput: {
      flex: 1,
      marginBottom: 0,
    },
    deleteProfileIcon: {
      marginLeft: theme.spacing.md,
    },
    providersContainer: {
      marginVertical: theme.spacing.xl,
    },
    providersInputTitle: {
      ...theme.typography.title2,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
    },
    providersInputHint: {
      ...theme.typography.footnote,
      color: theme.colors.textSecondary,
      marginTop: -theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    getNumberOuterRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    getNumberContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    getNumberBtnContainer: {
      width: 'auto',
      marginRight: theme.spacing.sm,
    },
    getNumberBtn: {
      paddingHorizontal: theme.spacing.lg,
    },
    selectContactContainer: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.radius.lg,
      paddingHorizontal: theme.spacing.md,
      height: 48,
      justifyContent: 'center',
    },
    selectContactText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },
    numberDeleteIcon: {
      marginLeft: theme.spacing.md,
    },
    sheetContainer: {
      borderTopRightRadius: theme.radius.xl,
      borderTopLeftRadius: theme.radius.xl,
      backgroundColor: theme.colors.surface,
    },
    saveButton: {
      marginTop: theme.spacing.sm,
    },
  });

export default ProfileSettings;
