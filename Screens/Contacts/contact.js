import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Dimensions } from 'react-native';
import globalStyles from '../../style';
import { useForm } from 'react-hook-form'
import { Input } from '../../components';
import Wrapper from '../../components/Wrapper';
import { Button, Header } from '../../components';
import Feather from 'react-native-vector-icons/Feather';
const windowWidth = Dimensions.get('window').width;

const Contact = () => {
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [phone, setPhone] = useState(null);
    const [note, setNote] = useState(null);
    const [file, setFile] = useState([]);
    const { control, handleSubmit } = useForm();

    const fileOptions = {};

    useEffect(() => { }, [])

    const onPressSaveMessage = (data) => {
        alert(JSON.stringify(data))
    }

    const onPressContactImport = async () => {
        alert('contact has been imported')
    }

    const onPressSearch = () => {
        alert('search press')
    }

    const renderHeader = () => {
        return <Header headerBody={renderSearchField()} headerRight={renderHeaderRight()} />
    }

    const renderSearchField = () => {
        return (
            <View style={styles.searchInputWrapper}>
                <TextInput style={styles.searchInput} />
                <TouchableOpacity onPress={onPressSearch} style={styles.searchIconWrap}>
                    <Feather name="search" size={18} color="#ececec" />
                </TouchableOpacity>
            </View>
        )
    }
    const renderHeaderRight = () => {
        return (
            <TouchableOpacity>
                <Feather name="trash" size={24} color="red" />
            </TouchableOpacity>
        )
    }

    const renderInputs = () => {
        return (
            <>
                <Input
                    placeholder="First Name"
                    autoFocus
                    value={firstName}
                    onChangeText={(text) => setFirstName(text)}
                    control={control}
                    name="firstName"
                />
                <Input
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={(text) => setLastName(text)}
                    control={control}
                    name="lastName"
                />
                <Input
                    placeholder="Phone"
                    keyboardType={'numeric'}
                    value={phone}
                    onChangeText={(text) => setPhone(text)}
                    control={control}
                    name="phone"
                />
                <Input
                    placeholder="Note"
                    value={note}
                    onChangeText={(text) => setNote(text)}
                    control={control}
                    name="note"
                    multiline={true}
                    customStyle={globalStyles.textAreaContainer}
                />
            </>
        )
    }

    const renderButton = () => {
        return <Button title="Save" onPress={handleSubmit(onPressSaveMessage)} />
    }

    const renderFileUploadButton = () => {
        return (
            <TouchableOpacity style={styles.uploadButtonWrap} onPress={onPressContactImport}>
                <Feather name="upload" size={25} />
                <Text>Import Contact</Text>
            </TouchableOpacity>
        )
    }

    return (
        <Wrapper header={renderHeader()}>
            <View style={globalStyles.flexOne}>
                {renderInputs()}
                {renderFileUploadButton()}
                {renderButton()}
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
    searchInputWrapper: {
        borderWidth: 1,
        borderColor: '#ececec',
        fontSize: 16,
        padding: 5,
        marginBottom: 15,
        width: windowWidth - 100,
        flexDirection: 'row'
    },
    searchInput: {
        borderRightWidth: 1,
        borderRightColor: '#ececec',
        flex: 0.9,
        marginRight: 5
    },
    searchIconWrap: {
        alignItems: 'center',
        flex: 0.1
    }
});

export default Contact;