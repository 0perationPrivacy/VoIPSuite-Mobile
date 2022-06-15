import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, Platform, ActivityIndicator } from 'react-native';
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
import Tags from "react-native-tags";
import { goBack, navigate, navigateAndReset } from '../../helpers/RootNavigation';

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
            contacts.map((item) => {
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
            console.log(file)

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
        console.log('succcess data', data);
        const fileArray = [...files]
        fileArray.push(data.media);
        console.log(fileArray, '<============ fileArray')

        setFiles(fileArray)
    }

    const onChangeContactList = (value) => {
        let data = [...selectedContact];

        if (!data.includes(value)) {
            data.push(value)
            console.log(data)

            setSelectedContact(data)
        }
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

    const renderSelectField = () => {
        return <Select placeholder="Select Contact" items={contactList} onChange={onChangeContactList} />
    }

    const renderInputs = () => {
        return (
            <>
                <Input
                    placeholder="Enter Phone Number"
                    autoFocus
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
                                        <Text>{item}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                }
                <Input
                    placeholder="Type Message Here"
                    autoFocus
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
        console.log(uri, '< ==========')
        return (
            <Image source={{ uri }} width={50} height={50} key={index} />
        )
    }

    const renderHeader = () => {
        return <Header />
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
        padding: 5,
        alignItems: 'center',
        width: '33%',
        backgroundColor: '#e2e2e2',
        marginBottom: '5%',
    }
});

export default Compose;