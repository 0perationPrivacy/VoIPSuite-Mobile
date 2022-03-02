import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Dimensions } from 'react-native';
import globalStyles from '../../style';
import { useForm } from 'react-hook-form'
import { Input } from '../../components';
import Wrapper from '../../components/Wrapper';
import { Button, Header } from '../../components';
import Feather from 'react-native-vector-icons/Feather';
import Metrics from '../../helpers/Metrics';
const windowWidth = Dimensions.get('window').width;

const ProfileSettings = () => {
    const [profileName, setProfileName] = useState(null);
    const [activeTab, setActiveTab] = useState(1);
    const [tiwlioSid, setTiwlioSid] = useState(1);
    const [tiwlioToken, setTiwlioToken] = useState(1);
    const [telnyxKey, setTelnyxKey] = useState(1);
    const { control, handleSubmit } = useForm();

    useEffect(() => { }, [])

    const onPressSave = () => {
        alert('save press')
    }

    const onPressTabChange = (tabVal) => {
        setActiveTab(tabVal)
    }

    const renderHeader = () => {
        return <Header title="Profile Settings" />
    }

    const renderTabs = () => {
        return (
            <View style={styles.tabsWrapper}>
                <TouchableOpacity style={[styles.tabItemButton, activeTab === 1 && styles.activeTabItemButton]} onPress={() => onPressTabChange(1)}>
                    <Text style={[activeTab === 1 && styles.activeTabItemButtonText]}>Telnyx</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabItemButton, activeTab === 2 && styles.activeTabItemButton]} onPress={() => onPressTabChange(2)}>
                    <Text style={[activeTab === 2 && styles.activeTabItemButtonText]}>Twilio</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderProfileSettingInput = () => {
        return (
            <View style={styles.profileSettingsInputWrapper}>
                <Feather name="user" size={20} />
                <Input
                    name="profileName"
                    control={control}
                    onChangeText={(text) => setProfileName(text)}
                    customStyle={styles.profileInput}
                    placeholder="Profile"
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
                    <Feather name="key" size={20} />
                    <Input
                        name="tiwlioSid"
                        control={control}
                        onChangeText={(text) => setTiwlioSid(text)}
                        customStyle={styles.profileInput}
                        placeholder="Enter Twilio SID"
                    />
                </View>
                <View style={[styles.profileSettingsInputWrapper, styles.providersInputWrapper]}>
                    <Feather name="key" size={20} />
                    <Input
                        name="tiwlioToken"
                        control={control}
                        onChangeText={(text) => setTiwlioToken(text)}
                        customStyle={styles.profileInput}
                        placeholder="Enter Twilio Token"
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
                    <Feather name="key" size={20} />
                    <Input
                        name="telnyxKey"
                        control={control}
                        onChangeText={(text) => setTelnyxKey(text)}
                        customStyle={styles.profileInput}
                        placeholder="Enter Telnyx API Key"
                    />
                </View>
            </>
        )
    }

    return (
        <Wrapper header={renderHeader()}>
            <View style={globalStyles.flexOne}>
                {renderTabs()}
                {renderProfileSettingInput()}
                <View style={styles.providersContainer}>
                    { activeTab === 1 ?  renderTelnyxInputs() : renderTwilioInputs()}
                </View>
                <Button title="Save" onPress={onPressSave}/>
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
    activeTabItemButtonText: {
        color: '#fff'
    },
    profileSettingsInputWrapper: {
        marginTop: 10,
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
        fontSize: Metrics.ratio(20)
    }
});

export default ProfileSettings;