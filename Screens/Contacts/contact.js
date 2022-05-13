import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Dimensions } from 'react-native';
import globalStyles from '../../style';
import { useForm } from 'react-hook-form'
import { Input } from '../../components';
import Wrapper from '../../components/Wrapper';
import { Button, Header } from '../../components';
import Feather from 'react-native-vector-icons/Feather';
const windowWidth = Dimensions.get('window').width;
import { isEmpty } from '../../helpers/utils';
import { useDispatch, useSelector } from 'react-redux'
import { contactActions } from '../../redux/actions';
import { navigateAndReset } from '../../helpers/RootNavigation';
import { useRoute } from '@react-navigation/native';

const Contact = () => {
    const [params, setParams] = useState({ first_name: "", last_name: "", note: "", number: "" });
    const [isValidate, setValidate] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMessages, setErrorMessages] = useState({});
    const [file, setFile] = useState([]);
    const [contactId, setId] = useState(null);
    const [isVisible, setVisible] = useState(false);

    const validations = {
        first_name: true,
        last_name: true,
        number: true,
    }

    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.contact.isLoading);

    const route = useRoute();

    const { control, handleSubmit } = useForm();

    useEffect(() => {
        const { params } = route;
        console.log(params, 'params');

        if (params?.item) {
            const { item } = params
            const { created_at, __v, user, ...other } = item
            setParams(other);
            setId(item?._id);
        }

        setVisible(true)

    }, [])

    const onPressSaveContact = (data) => {
        if (!isValidate) return false;
        let isEdit = false;

        if (contactId) {
            Object.assign(data, { contact_id: contactId })
            isEdit = true;
        }

        dispatch(contactActions.createContactAction(data, onContactSaveSuccess, onSetErrorMessageFromServer, isEdit))

        // alert(JSON.stringify(data))
    }

    const onContactSaveSuccess = () => {
        navigateAndReset('ContactList')
    }

    const onPressContactImport = async () => {
        alert('contact has been imported')
    }

    const onPressSearch = () => {
        alert('search press')
    }

    const onInputLeave = (name, value) => {
        if (validations?.[name]) {
            let _errors = { ...errors };
            if (isEmpty(value)) {
                Object.assign(_errors, { [name]: true })
            }
            else { delete _errors[name] }

            setErrors(_errors);
        }

    }

    const onSetErrorMessageFromServer = (errors) => {
        setErrorMessages(errors);
    }

    useEffect(() => {
        setValidate(Object.keys(errors).length === 0)
    }, [errors])

    const renderHeader = () => {
        return <Header title={'Add Contact'} headerRight={renderHeaderRight()} />
    }

    const renderSearchField = () => {
        return (
            <View style={styles.searchInputWrapper}>
                {/* <TextInput style={styles.searchInput} /> */}
                {/* <TouchableOpacity onPress={onPressSearch} style={styles.searchIconWrap}>
                    <Feather name="search" size={18} color="#ececec" />
                </TouchableOpacity> */}
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
        const { first_name, last_name, note, number } = params;
        return (
            <>
                <Input
                    placeholder="First Name"
                    autoFocus
                    defaultValue={first_name}
                    control={control}
                    name="first_name"
                    onInputLeave={onInputLeave}
                    isError={errors?.first_name}
                />
                <Input
                    placeholder="Last Name"
                    defaultValue={last_name}
                    control={control}
                    name="last_name"
                    onInputLeave={onInputLeave}
                    isError={errors?.last_name}
                />
                <Input
                    placeholder="Phone"
                    keyboardType={'numeric'}
                    defaultValue={number}
                    control={control}
                    name="number"
                    onInputLeave={onInputLeave}
                    isError={errors?.number}
                />
                <Input
                    placeholder="Note"
                    defaultValue={note}
                    control={control}
                    name="note"
                    multiline={true}
                    customStyle={globalStyles.textAreaContainer}
                />
            </>
        )
    }

    const renderButton = () => {
        return <Button title="Save" onPress={handleSubmit(onPressSaveContact)} loading={isLoading} />
    }

    const renderFileUploadButton = () => {
        return (
            <TouchableOpacity style={styles.uploadButtonWrap} onPress={onPressContactImport}>
                <Feather style={globalStyles.defaultIconColor} name="upload" size={25} />
                <Text style={globalStyles.defaultTextColor}>Import Contact</Text>
            </TouchableOpacity>
        )
    }

    if (isVisible) {
        return (
            <Wrapper header={renderHeader()}>
                <View style={[globalStyles.flexOne, { marginTop: 10 }]}>
                    {renderInputs()}
                    {renderFileUploadButton()}
                    {renderButton()}
                </View>
            </Wrapper>
        )
    }
    return null;
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
        // marginBottom: 15,
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