import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, Platform, ActivityIndicator, Dimensions } from 'react-native';
import globalStyles from '../../style';
import { useForm } from 'react-hook-form'
import { Header, Input } from '../../components';
import Wrapper from '../../components/Wrapper';
import { Button, Select } from '../../components';
import Feather from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { contactActions, messagesActions, uploadsActions } from '../../redux/actions';
import _ from 'lodash';
import { navigateAndReset } from '../../helpers/RootNavigation';
import NumberList from '../../components/NumberList';
import RBSheet from "react-native-raw-bottom-sheet";
import { getColorByTheme } from '../../helpers/utils';
import Metrics from '../../helpers/Metrics';

const Compose = () => {
    const [phone, setPhone] = useState(null);
    const [message, setMessage] = useState(null);
    const [files, setFiles] = useState([]);
    const { control, handleSubmit } = useForm();
    const [selectedContact, setSelectedContact] = useState([]);
    const [contactList, setContactList] = useState([]);
    const [profileID, setProfileId] = useState(null);

    const dispatch = useDispatch();
    const imageLoading = useSelector(state => state.uploads.isLoading);
    const contacts = useSelector(state => state.contact.items);
    const profileSettings = useSelector(state => state.settings.profileSettings);
    const user = useSelector(state => state.authentication.user);
    const messageLoading = useSelector(state => state.messages.isLoading);

    const refRBSheet = useRef();

    const fileOptions = {};

    useEffect(() => {
        getAllContacts();
    }, [])

    useEffect(() => {
        if (profileSettings && !_.isEmpty(profileSettings)) {
            const { id } = profileSettings;
            setProfileId(profileSettings);
        }
    }, [profileSettings])

    const getAllContacts = () => {
        dispatch(contactActions.getAllContactsAction())
    }

    useEffect(() => {
        if (_.isArray(contacts)) {
            let data = [];
            contacts.forEach((item) => {
                const { number, _id } = item;
                data.push({ label: number, value: number })
            })
            setContactList(data)
        }
    }, [contacts])

    const onPressFileUpload = async () => {
        const result = await launchImageLibrary(fileOptions);

        if (result?.assets) {
            const file = result.assets[0]

            const data = new FormData();
            data.append('file', {
                name: file.fileName,
                type: file.type,
                uri: Platform.OS === 'ios' ?
                    file.uri.replace('file://', '')
                    : file.uri,
            });

            dispatch(uploadsActions.uploadMediaAction(data, onFileUploadSuccess))
        }

    }

    const onFileUploadSuccess = (data) => {
        const fileArray = [...files]
        fileArray.push(data.media);

        setFiles(fileArray)
    }

    const onChangeContactList = (value) => {
        if (!value) return;

        let data = [...selectedContact];

        if (!data.includes(value)) {
            data.push(value)
            setSelectedContact(data)
        }

        onCloseBottomSheet()
    }

    const onPressRemoveTag = (index) => {
        let data = [...selectedContact];
        if (index > -1) {
            data.splice(index, 1);
        }
        setSelectedContact(data)
    }

    const onSubmitPhone = () => {
        if (phone) {
            onChangeContactList(phone)
            setTimeout(() => {
                setPhone(null)
            }, 500);
        }
    }

    const onSendMessage = () => {
        const { _id } = user.data
        let data = { media: files, message: message, numbers: selectedContact, profile: profileID, user: _id }
        dispatch(messagesActions.sendMessageDetailsAction(data, onSuccessSendMessage))
    }

    const onSuccessSendMessage = () => {
        navigateAndReset('Messages')
    }

    const openBottomSheet = () => {
        refRBSheet.current.open()
    }

    const onCloseBottomSheet = () => {
        refRBSheet.current.close()
    }

    const renderSelectField = () => {
        return (
            <TouchableOpacity style={[styles.selectContactContainer]} onPress={openBottomSheet}>
                <Text style={globalStyles.defaultTextColor}>Select Contact</Text>
            </TouchableOpacity>
        )
    }

    const renderInputs = () => {
        return (
            <>
                <Input
                    placeholder="Enter Phone Number"
                    keyboardType={'numeric'}
                    value={phone}
                    onChangeInput={(name, text) => setPhone(text)}
                    control={control}
                    name="phone"
                    onSubmitEditing={onSubmitPhone}
                    onInputLeave={onSubmitPhone}
                />
                {
                    selectedContact.length > 0 &&
                    <View style={styles.tagsContainer}>
                        {
                            selectedContact.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} style={styles.tagItem} onPress={() => onPressRemoveTag(index)}>
                                        <Text style={[globalStyles.defaultTextColor, styles.tagItemText]}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                }
                <Input
                    placeholder="Type Message Here"
                    value={message}
                    onChangeInput={(name, text) => setMessage(text)}
                    control={control}
                    name="message"
                    multiline={true}
                    customStyle={globalStyles.textAreaContainer}
                />
            </>
        )
    }

    const renderButton = () => {
        return <Button title="Send Message" onPress={onSendMessage} loading={messageLoading} />
    }

    const renderFileUploadButton = () => {
        return (
            <TouchableOpacity style={styles.uploadButtonWrap} onPress={onPressFileUpload}>
                <Feather name="upload" size={25} style={globalStyles.defaultIconColor} />
                <Text style={globalStyles.defaultTextColor}>Upload Image</Text>
            </TouchableOpacity>
        )
    }

    const renderImageItems = (uri, index) => {
        return (
            <Image source={{ uri }} width={50} height={50} key={index} />
        )
    }

    const renderHeader = () => {
        return <Header />
    }

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
                    container: globalStyles.bottomSheetContainer
                }}
            >
                <NumberList onPressBack={onCloseBottomSheet} data={contactList} onSubmit={onChangeContactList} />
            </RBSheet>
        )
    }

    return (
        <Wrapper header={renderHeader()}>
            <View style={globalStyles.flexOne}>
                {renderSelectField()}
                {renderInputs()}
                {imageLoading ? <ActivityIndicator size={'large'} color="#3770e4" /> : renderFileUploadButton()}
                {renderButton()}
                <View style={styles.uploadButtonWrap}>
                    {
                        files && files.map((item, index) => {
                            return renderImageItems(item, index)
                        })
                    }
                </View>
            </View>
            {renderBottomSheet()}
        </Wrapper>
    )
}

const styles = StyleSheet.create({
    uploadButtonWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10
    },
    tagsContainer: {
        borderWidth: 1,
        borderColor: '#ececec',
        // justifyContent: "space-between",
        marginBottom: '5%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    tagItem: {
        borderWidth: 1,
        borderColor: '#ececec',
        borderRadius: 50,
        paddingVertical: 5,
        alignItems: 'center',
        width: '50%',
        backgroundColor: '#e2e2e2',
        marginBottom: '5%',
    },
    tagItemText: {
        color: getColorByTheme('#000', '#000'),
    },
    selectContactContainer: {
        borderWidth: 1,
        borderColor: getColorByTheme('#ececec', '#3f3f3f'),
        fontSize: 14,
        padding: 5,
        height: 45,
        marginBottom: 15,
        color: getColorByTheme('#000', '#fff'),
        fontFamily: Metrics.fontRegular,
        justifyContent: 'center'
    },
    selectContactText: {
    }
});

export default Compose;