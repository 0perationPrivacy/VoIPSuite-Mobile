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
import { uploadsActions } from '../../redux/actions';
import RNFetchBlob from 'rn-fetch-blob';
import _ from 'lodash';
import axios from 'axios';
import { authHeader } from '../../helpers/auth-header';
import Loader from '../../components/Loader';

const Compose = () => {
    const [phone, setPhone] = useState(null);
    const [message, setMessage] = useState(null);
    const [files, setFiles] = useState([]);
    const { control, handleSubmit } = useForm();

    const dispatch = useDispatch();
    const imageLoading = useSelector(state => state.uploads.isLoading);

    const fileOptions = {};

    useEffect(() => { }, [])

    const onPressSendMessage = (data) => {
        alert(JSON.stringify(data))
    }

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

        setFiles(fileArray)
    }

    const renderSelectField = () => {
        return <Select placeholder="Select Contact" />
    }

    const renderInputs = () => {
        return (
            <>
                <Input
                    placeholder="Enter Phone Number"
                    autoFocus
                    keyboardType={'numeric'}
                    value={phone}
                    onChangeText={(text) => setPhone(text)}
                    control={control}
                    name="phone"
                />
                <Input
                    placeholder="Type Message Here"
                    autoFocus
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    control={control}
                    name="message"
                    multiline={true}
                    customStyle={globalStyles.textAreaContainer}
                />
            </>
        )
    }

    const renderButton = () => {
        return <Button title="Send Message" onPress={handleSubmit(onPressSendMessage)} />
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
        console.log(uri,'< ==========')
        return (
            <Image source={uri} width={50} height={50} key={index} />
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
    }
});

export default Compose;