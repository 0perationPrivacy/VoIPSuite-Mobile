import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Dimensions } from 'react-native';
import globalStyles from '../../style';
import { useForm } from 'react-hook-form'
import { Input, Select } from '../../components';
import Wrapper from '../../components/Wrapper';
import { Button, Header } from '../../components';
import Feather from 'react-native-vector-icons/Feather';
import Metrics from '../../helpers/Metrics';
import { getColorByTheme } from '../../helpers/utils';
import { useDispatch, useSelector } from 'react-redux';
const windowWidth = Dimensions.get('window').width;
import _ from 'lodash';
import { profileActions, settingsActions } from '../../redux/actions';
import { Root, Popup } from 'react-native-popup-confirm-toast'
import Confirmation from '../../components/Confirmation';
import { navigateAndReset } from '../../helpers/RootNavigation';

const ProfileSettings = () => {
    const [profileName, setProfileName] = useState(null);
    const [activeTab, setActiveTab] = useState("twilio");
    const [tiwlioSid, setTiwlioSid] = useState(null);
    const [tiwlioToken, setTiwlioToken] = useState(null);
    const [telnyxKey, setTelnyxKey] = useState(null);
    const [profileId, setProfileId] = useState(null);
    const [isDeleteBtn, setIsDeleteBtn] = useState(false);
    const [numbersList, setNumberList] = useState([]);
    const [telnyxNumbersList, setTelnyxNumberList] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [__SID, setSID] = useState(null);

    //modal
    const [isModalVisible, setIsVisibleModal] = useState(false);
    const [isModalDeleteVisible, setIsVisibleDeleteModal] = useState(false);

    const { control, handleSubmit } = useForm();

    const isLoading = useSelector(state => state.settings.isLoading);
    const profileSettings = useSelector(state => state.settings.profileSettings);
    const numbers = useSelector(state => state.settings.numbers);
    const user = useSelector(state => state.authentication.user);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log(profileSettings, '<=========== profileSettings')
        if (profileSettings && !_.isEmpty(profileSettings)) {
            const { profile, type, id, sid, number } = profileSettings;
            setProfileName(profile)
            setProfileId(id);
            console.log('tyo', type)
            setActiveTab(type);

            if (type === 'telnyx') {
                const { api_key } = profileSettings;
                setTelnyxKey(api_key);
                if (api_key) {
                    setIsDeleteBtn(true)
                }
            } else {
                const { twilio_sid, twilio_token } = profileSettings;
                setTiwlioSid(twilio_sid);
                setTiwlioToken(twilio_token);

                if (twilio_token) {
                    setIsDeleteBtn(true)
                }
            }

            setPhoneNumber(number);
            setSID(sid);

            setTimeout(() => {
                console.log('haan ==============>', tiwlioSid, type, number, sid, 'no ==============>')
                onPressGetNumber()
            }, 2000);
        }
    }, [])

    useEffect(() => {
        if (numbers && _.isArray(numbers)) {
            let data = [];
            numbers.map((item) => {
                const { phoneNumber, phone_number, sid, id } = item;
                let number = activeTab === 'twilio' ? phoneNumber : phone_number;
                let _sid = activeTab === 'twilio' ? sid : id;

                data.push({ label: number, value: { number, _sid } })
            });

            if (activeTab === 'twilio') {
                setNumberList(data);
            } else {
                setTelnyxNumberList(data);
            }
        }
    }, [numbers])

    const returnData = () => {
        let data = {}
        let __phone = phoneNumber;
        console.log(profileSettings, 'profile')
        if (activeTab === 'twilio') {
            data = {
                ...profileSettings,
                type: activeTab, twilio_sid: tiwlioSid, twilio_token: tiwlioToken,
                sid: __SID, twilio_number: phoneNumber
            }
        } else {
            data = {
                ...profileSettings, type: activeTab, api_key: telnyxKey,
                sid: __SID, number: phoneNumber
            }
        }

        const { _id } = user.data
        Object.assign(data, { setting: profileId, user: _id });

        return data;
    }

    const onPressSave = () => {
        let data = returnData();

        console.log(data, 'check setting  ===========', telnyxKey)

        dispatch(settingsActions.checkProfileSettingsAction(data, checkProfileSuccess))
    }

    const checkProfileSuccess = () => {
        setIsVisibleModal(true)
    }

    const onCancelConfirmCheckModal = () => {
        setIsVisibleModal(false)
    }

    const onOkConfirmCheckModal = () => {
        setIsVisibleModal(false);

        let data = returnData();
        Object.assign(data, { override: "true" });
        console.log(data)

        dispatch(settingsActions.createProfileSettingsAction(data))
    }

    const onPressDeleteProfile = () => {
        if (user && user?.token) {
            const { _id } = user.data
            let data = { user: _id, profile_id: profileId }
            dispatch(profileActions.deleteProfileAction(data, onDeleteSuccess));
        }
    }

    const onDeleteSuccess = () => {
        navigateAndReset('Messages')
    }

    const onPressTabChange = (tabVal) => {
        setActiveTab(tabVal)
    }

    const onPressGetNumber = () => {
        // if (profileSettings && !_.isEmpty(profileSettings)) {
            let data = returnData();
            console.log('bhrwa', data)
            dispatch(settingsActions.getNumbersListByProfileAction(data, activeTab))
        // }
    }

    const onChangePhone = (obj) => {
        console.log('obj', obj);
        setPhoneNumber(obj.number);
        setSID(obj._sid);
    }

    const getProfileSettings = () => {
        if (user && user?.token) {
            const { _id } = user.data
            let data = { user: _id, setting: profileId }
            dispatch(settingsActions.getProfileSettings(data));
        }
    }

    const renderHeader = () => {
        return <Header title="Profile Settings" />
    }

    const renderTabs = () => {
        return (
            <View style={styles.tabsWrapper}>
                <TouchableOpacity style={[styles.tabItemButton, activeTab === "telnyx" && styles.activeTabItemButton]} onPress={() => onPressTabChange("telnyx")}>
                    <Text style={[activeTab === 1 && styles.activeTabItemButtonText, styles.tabItemButtonText]}>Telnyx</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabItemButton, activeTab === "twilio" && styles.activeTabItemButton]} onPress={() => onPressTabChange("twilio")}>
                    <Text style={[activeTab === 2 && styles.activeTabItemButtonText, styles.tabItemButtonText]}>Twilio</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderProfileSettingInput = () => {
        return (
            <View style={styles.profileSettingsInputWrapper}>
                <Feather name="user" size={20} style={globalStyles.defaultIconColor} />
                <Input
                    name="profileName"
                    control={control}
                    onChangeText={(text) => setProfileName(text)}
                    customStyle={styles.profileInput}
                    placeholder="Profile"
                    defaultValue={profileName}
                />
                <TouchableOpacity onPress={() => setIsVisibleDeleteModal(true)}>
                    <Feather name="trash" size={20} color="red" />
                </TouchableOpacity>
            </View>
        )
    }

    const renderTwilioInputs = () => {
        return (
            <>
                <Text style={styles.providersInputTitle}>Twilio Keys</Text>
                <View style={[styles.profileSettingsInputWrapper, styles.providersInputWrapper]}>
                    <Feather name="key" size={20} style={globalStyles.defaultIconColor} />
                    <Input
                        name="tiwlioSid"
                        control={control}
                        onChangeInput={(name, text) => setTiwlioSid(text)}
                        customStyle={styles.profileInput}
                        placeholder="Enter Twilio SID"
                        defaultValue={tiwlioSid}
                    />
                </View>
                <View style={[styles.profileSettingsInputWrapper, styles.providersInputWrapper]}>
                    <Feather name="key" size={20} style={globalStyles.defaultIconColor} />
                    <Input
                        name="tiwlioToken"
                        control={control}
                        onChangeInput={(name, text) => setTiwlioToken(text)}
                        customStyle={styles.profileInput}
                        placeholder="Enter Twilio Token"
                        defaultValue={tiwlioToken}
                    />
                </View>
            </>
        )
    }

    const renderTelnyxInputs = () => {
        return (
            <>
                <Text style={styles.providersInputTitle}>Telnyx Key</Text>
                <View style={[styles.profileSettingsInputWrapper, styles.providersInputWrapper]}>
                    <Feather name="key" size={20} style={globalStyles.defaultIconColor} />
                    <Input
                        name="telnyxKey"
                        control={control}
                        onChangeInput={(name, text) => setTelnyxKey(text)}
                        customStyle={styles.profileInput}
                        placeholder="Enter Telnyx API Key"
                        defaultValue={telnyxKey}
                    />
                </View>
            </>
        )
    }

    const renderNumberList = () => {
        return (
            <View style={styles.getNumberContainer}>
                <View style={styles.getNumberContainer}>
                    <Button buttonStyle={styles.getNumberBtn} title={'Get Number'} onPress={onPressGetNumber} />
                    <View style={{ flex: 0.9 }}>
                        <Select placeholder="Select Number" containerStyle={{ height: 40 }} items={activeTab === 'twilio' ? numbersList : telnyxNumbersList} onChange={onChangePhone} />
                    </View>
                </View>
                {
                    isDeleteBtn && <TouchableOpacity>
                        <Feather name='trash' size={22} />
                    </TouchableOpacity>
                }
            </View>
        )
    }

    return (
        <Wrapper header={renderHeader()}>
            <View style={globalStyles.flexOne}>
                {renderTabs()}
                {renderProfileSettingInput()}
                <View style={styles.providersContainer}>
                    {activeTab === 'telnyx' ? renderTelnyxInputs() : renderTwilioInputs()}
                </View>
                {renderNumberList()}
                <Button title="Save" onPress={onPressSave} loading={isLoading} />
                <Confirmation isVisible={isModalVisible} onPressCancel={onCancelConfirmCheckModal} onPressOk={onOkConfirmCheckModal} />
                <Confirmation
                    isVisible={isModalDeleteVisible}
                    onPressCancel={() => setIsVisibleDeleteModal(false)}
                    onPressOk={onPressDeleteProfile}
                    title=""
                    description='Do you want to delete this Profile?'
                    okText='Yes, Delete'
                    cancelText='No'
                />
            </View>
        </Wrapper>
    )
}

const styles = StyleSheet.create({
    tabsWrapper: {
        flexDirection: 'row',
    },
    tabItemButton: {
        borderWidth: 1,
        borderColor: '#0d6efd',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        borderRadius: 5
    },
    activeTabItemButton: {
        backgroundColor: '#0d6efd'
    },
    tabItemButtonText: {
        color: getColorByTheme('#000', '#fff')
    },
    activeTabItemButtonText: {
        color: '#fff'
    },
    profileSettingsInputWrapper: {
        marginTop: Metrics.ratio(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
        // marginBottom: Metrics.doubleBaseMargin
    },
    profileInput: {
        height: Metrics.ratio(30),
        fontSize: 14,
        marginHorizontal: Metrics.baseMargin,
        marginBottom: 0
    },
    providersContainer: {
        marginVertical: Metrics.doubleBaseMargin
    },
    providersInputWrapper: {
        marginBottom: Metrics.smallMargin
    },
    providersInputTitle: {
        fontSize: Metrics.ratio(20),
        color: getColorByTheme('#000', '#fff')
    },
    getNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    getNumberBtn: {
        backgroundColor: '#6c757d',
        borderColor: '#6c757d',
        marginRight: Metrics.ratio(10)
    }
});

export default ProfileSettings;