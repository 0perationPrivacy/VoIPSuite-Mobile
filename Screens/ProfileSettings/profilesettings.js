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
import { settingsActions } from '../../redux/actions';

const ProfileSettings = () => {
    const [profileName, setProfileName] = useState(null);
    const [activeTab, setActiveTab] = useState(1);
    const [tiwlioSid, setTiwlioSid] = useState(null);
    const [tiwlioToken, setTiwlioToken] = useState(null);
    const [telnyxKey, setTelnyxKey] = useState(null);
    const { control, handleSubmit } = useForm();

    const isLoading = useSelector(state => state.settings.isLoading);
    const profileSettings = useSelector(state => state.settings.profileSettings);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log(profileSettings, '<=========== profileSettings')
        if (profileSettings && !_.isEmpty(profileSettings)) {
            const { profile, type } = profileSettings;
            setProfileName(profile)

            if (type === 'telnyx') {
                const { api_key } = profileSettings;
                setTelnyxKey(api_key)
            } else {
                const { twilio_sid, twilio_token } = profileSettings;
                setTiwlioSid(twilio_sid);
                setTiwlioToken(twilio_token);
            }
        }
    }, [])

    const onPressSave = () => {
        alert('save press')
    }

    const onPressTabChange = (tabVal) => {
        setActiveTab(tabVal)
    }

    const onPressGetNumber = () => {
        if (profileSettings && !_.isEmpty(profileSettings)) {
            dispatch(settingsActions.getNumbersListByProfileAction(profileSettings))
        }
    }

    const renderHeader = () => {
        return <Header title="Profile Settings" />
    }

    const renderTabs = () => {
        return (
            <View style={styles.tabsWrapper}>
                <TouchableOpacity style={[styles.tabItemButton, activeTab === 1 && styles.activeTabItemButton]} onPress={() => onPressTabChange(1)}>
                    <Text style={[activeTab === 1 && styles.activeTabItemButtonText, styles.tabItemButtonText]}>Telnyx</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabItemButton, activeTab === 2 && styles.activeTabItemButton]} onPress={() => onPressTabChange(2)}>
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
                <Feather name="trash" size={20} color="red" />
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
                        onChangeText={(text) => setTiwlioSid(text)}
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
                        onChangeText={(text) => setTiwlioToken(text)}
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
                        onChangeText={(text) => setTelnyxKey(text)}
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
                        <Select placeholder="Select Number" containerStyle={{ height: 40 }} />
                    </View>
                </View>
                <TouchableOpacity>
                    <Feather name='trash' size={22} />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <Wrapper header={renderHeader()}>
            <View style={globalStyles.flexOne}>
                {renderTabs()}
                {renderProfileSettingInput()}
                <View style={styles.providersContainer}>
                    {activeTab === 1 ? renderTelnyxInputs() : renderTwilioInputs()}
                </View>
                {renderNumberList()}
                <Button title="Save" onPress={onPressSave} loading={isLoading} />
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
        // marginBottom: Metrics.doubleBaseMargin
    },
    profileInput: {
        flex: 1,
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