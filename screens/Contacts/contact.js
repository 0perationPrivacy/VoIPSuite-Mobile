import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useForm} from 'react-hook-form';
import {Input, Button, Header} from '../../components';
import Wrapper from '../../components/Wrapper';
import Feather from 'react-native-vector-icons/Feather';
import {isEmpty} from '../../helpers/utils';
import {useDispatch, useSelector} from 'react-redux';
import {contactActions} from '../../redux/actions';
import {navigate} from '../../helpers/RootNavigation';
import {useRoute} from '@react-navigation/native';
import Contacts from 'react-native-contacts';
import _ from 'lodash';
import {useTheme} from '../../theme';

const Contact = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [params, setParams] = useState({first_name: '', last_name: '', note: '', number: ''});
  const [isValidate, setValidate] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [contactId, setId] = useState(null);
  const [isVisible, setVisible] = useState(false);

  const validations = {
    first_name: true,
    number: true,
  };

  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.contact.isLoading);

  const route = useRoute();

  const {control, handleSubmit} = useForm();

  useEffect(() => {
    const {params} = route;
    if (params?.item) {
      const {item} = params;
      const {created_at, __v, user, ...other} = item;
      setParams(other);
      setId(item?._id);
    }

    if (params?.number) {
      setParams(prevState => ({...prevState, number: params?.number}));
    }

    setVisible(true);
  }, []);

  const onPressSaveContact = data => {
    if (!isValidate) return false;
    let isEdit = false;

    if (contactId) {
      Object.assign(data, {contact_id: contactId});
      isEdit = true;
    }

    dispatch(contactActions.createContactAction(data, onContactSaveSuccess, onSetErrorMessageFromServer, isEdit));
  };

  const onContactSaveSuccess = () => {
    navigate('ContactList');
  };

  const onPressDelete = () => {
    if (!contactId) return;
    dispatch(contactActions.deleteContactAction({contact_id: contactId}, onContactSaveSuccess));
  };

  const onPressContactImport = async () => {
    let importedContacts = [];
    importedContacts = await Contacts.getAll();
    let data = [];

    if (importedContacts && _.isArray(importedContacts)) {
      importedContacts.forEach(item => {
        const {familyName, givenName, phoneNumbers} = item;
        data.push({first_name: familyName, last_name: givenName, number: phoneNumbers?.[0]?.number, note: 'notes go here'});
      });

      dispatch(contactActions.createImportedContactAction(data, onContactSaveSuccess));
    }
  };

  const onInputLeave = (name, value) => {
    if (validations?.[name]) {
      let _errors = {...errors};
      if (isEmpty(value)) {
        Object.assign(_errors, {[name]: true});
      } else {
        delete _errors[name];
      }

      setErrors(_errors);
    }
  };

  const onSetErrorMessageFromServer = errors => {
    setErrorMessages(errors);
  };

  useEffect(() => {
    setValidate(Object.keys(errors).length === 0);
  }, [errors]);

  const renderHeaderRight = () => {
    if (!contactId) return null;

    return (
      <TouchableOpacity onPress={onPressDelete} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <Feather name="trash-2" size={20} color={theme.colors.destructive} />
      </TouchableOpacity>
    );
  };

  const renderInputs = () => {
    const {first_name, last_name, note, number} = params;
    return (
      <>
        <Text style={styles.label}>Name</Text>
        <Input
          placeholder="First name"
          defaultValue={first_name}
          control={control}
          name="first_name"
          onInputLeave={onInputLeave}
          isError={errors?.first_name}
        />
        <Input placeholder="Last name" defaultValue={last_name} control={control} name="last_name" onInputLeave={onInputLeave} />

        <Text style={styles.label}>Phone</Text>
        <Input
          placeholder="Phone number"
          keyboardType={'phone-pad'}
          defaultValue={number}
          control={control}
          name="number"
          onInputLeave={onInputLeave}
          isError={errors?.number}
          icon={'phone'}
        />

        <Text style={styles.label}>Note</Text>
        <Input
          placeholder="Add a note…"
          defaultValue={note}
          control={control}
          name="note"
          multiline={true}
          textAlignVertical={'top'}
          customStyle={styles.textArea}
        />
      </>
    );
  };

  const renderImportButton = () => {
    if (contactId) return null;

    return (
      <TouchableOpacity style={styles.importRow} onPress={onPressContactImport} activeOpacity={0.7}>
        <Feather name="download" size={18} color={theme.colors.accent} />
        <Text style={styles.importText}>Import from phone contacts</Text>
        <Feather name="chevron-right" size={18} color={theme.colors.textTertiary} />
      </TouchableOpacity>
    );
  };

  if (!isVisible) return null;

  return (
    <Wrapper header={<Header title={contactId ? 'Edit contact' : 'New contact'} headerRight={renderHeaderRight} />}>
      <View style={styles.content}>
        {renderInputs()}
        {renderImportButton()}
      </View>
      <Button title="Save contact" onPress={handleSubmit(onPressSaveContact)} loading={isLoading} />
    </Wrapper>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    content: {
      flex: 1,
    },
    label: {
      ...theme.typography.footnoteMedium,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: theme.spacing.sm,
    },
    textArea: {
      minHeight: 100,
      alignItems: 'flex-start',
    },
    importRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      marginTop: theme.spacing.xs,
    },
    importText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
  });

export default Contact;
