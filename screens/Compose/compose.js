import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image, Platform, ActivityIndicator, Dimensions} from 'react-native';
import {useForm} from 'react-hook-form';
import {Header, Input, Button} from '../../components';
import Wrapper from '../../components/Wrapper';
import Feather from 'react-native-vector-icons/Feather';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {contactActions, messagesActions, uploadsActions} from '../../redux/actions';
import _ from 'lodash';
import {navigateAndReset} from '../../helpers/RootNavigation';
import NumberList from '../../components/NumberList';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useTheme} from '../../theme';

const Compose = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [phone, setPhone] = useState(null);
  const [message, setMessage] = useState(null);
  const [files, setFiles] = useState([]);
  const {control} = useForm();
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
  }, []);

  useEffect(() => {
    if (profileSettings && !_.isEmpty(profileSettings)) {
      setProfileId(profileSettings);
    }
  }, [profileSettings]);

  const getAllContacts = () => {
    dispatch(contactActions.getAllContactsAction());
  };

  useEffect(() => {
    if (_.isArray(contacts)) {
      let data = [];
      contacts.forEach(item => {
        const {number} = item;
        data.push({label: number, value: number});
      });
      setContactList(data);
    }
  }, [contacts]);

  const onPressFileUpload = async () => {
    const result = await launchImageLibrary(fileOptions);

    if (result?.assets) {
      const file = result.assets[0];

      const data = new FormData();
      data.append('file', {
        name: file.fileName,
        type: file.type,
        uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
      });

      dispatch(uploadsActions.uploadMediaAction(data, onFileUploadSuccess));
    }
  };

  const onFileUploadSuccess = data => {
    const fileArray = [...files];
    fileArray.push(data.media);

    setFiles(fileArray);
  };

  const onChangeContactList = value => {
    if (!value) return;

    let data = [...selectedContact];

    if (!data.includes(value)) {
      data.push(value);
      setSelectedContact(data);
    }

    onCloseBottomSheet();
  };

  const onPressRemoveTag = index => {
    let data = [...selectedContact];
    if (index > -1) {
      data.splice(index, 1);
    }
    setSelectedContact(data);
  };

  const onPressRemoveFile = index => {
    let data = [...files];
    if (index > -1) {
      data.splice(index, 1);
    }
    setFiles(data);
  };

  const onSubmitPhone = () => {
    if (phone) {
      onChangeContactList(phone);
      setTimeout(() => {
        setPhone(null);
      }, 500);
    }
  };

  const onSendMessage = () => {
    const {_id} = user.data;
    let data = {media: files, message: message, numbers: selectedContact, profile: profileID, user: _id};
    dispatch(messagesActions.sendMessageDetailsAction(data, onSuccessSendMessage));
  };

  const onSuccessSendMessage = () => {
    navigateAndReset('Messages');
  };

  const openBottomSheet = () => {
    refRBSheet.current.open();
  };

  const onCloseBottomSheet = () => {
    refRBSheet.current.close();
  };

  const canSend = selectedContact.length > 0 && (!!message || files.length > 0);

  const renderRecipients = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.label}>To</Text>
        <Input
          placeholder="Enter phone number"
          keyboardType={'phone-pad'}
          value={phone}
          onChangeInput={(name, text) => setPhone(text)}
          control={control}
          name="phone"
          icon={'phone'}
          returnKeyType={'done'}
          onSubmitEditing={onSubmitPhone}
          onInputLeave={onSubmitPhone}
        />
        <TouchableOpacity style={styles.selectContactRow} onPress={openBottomSheet} activeOpacity={0.7}>
          <Feather name="users" size={18} color={theme.colors.accent} />
          <Text style={styles.selectContactText}>Choose from contacts</Text>
          <Feather name="chevron-right" size={18} color={theme.colors.textTertiary} />
        </TouchableOpacity>
        {selectedContact.length > 0 && (
          <View style={styles.tagsContainer}>
            {selectedContact.map((item, index) => (
              <TouchableOpacity key={index} style={styles.tagItem} onPress={() => onPressRemoveTag(index)} activeOpacity={0.7}>
                <Text style={styles.tagItemText}>{item}</Text>
                <Feather name="x" size={14} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderMessage = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.label}>Message</Text>
        <Input
          placeholder="Type your message…"
          value={message}
          onChangeInput={(name, text) => setMessage(text)}
          control={control}
          name="message"
          multiline={true}
          textAlignVertical={'top'}
          customStyle={styles.textArea}
        />
      </View>
    );
  };

  const renderAttachments = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.label}>Attachments</Text>
        {imageLoading ? (
          <View style={styles.uploadRow}>
            <ActivityIndicator size={'small'} color={theme.colors.accent} />
            <Text style={styles.uploadText}>Uploading…</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadRow} onPress={onPressFileUpload} activeOpacity={0.7}>
            <Feather name="image" size={18} color={theme.colors.accent} />
            <Text style={styles.uploadText}>Add image</Text>
          </TouchableOpacity>
        )}
        {files.length > 0 && (
          <View style={styles.previewRow}>
            {files.map((uri, index) => (
              <View key={index} style={styles.previewWrap}>
                <Image source={{uri}} style={styles.preview} />
                <TouchableOpacity style={styles.previewRemove} onPress={() => onPressRemoveFile(index)} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                  <Feather name="x" size={12} color={theme.colors.background} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
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
          container: styles.bottomSheet,
          draggableIcon: {backgroundColor: theme.colors.separator},
        }}>
        <NumberList onPressBack={onCloseBottomSheet} data={contactList} onSubmit={onChangeContactList} />
      </RBSheet>
    );
  };

  return (
    <Wrapper header={<Header title="New message" />}>
      <View style={styles.content}>
        {renderRecipients()}
        {renderMessage()}
        {renderAttachments()}
      </View>
      <Button title="Send message" onPress={onSendMessage} loading={messageLoading} disabled={!canSend} />
      {renderBottomSheet()}
    </Wrapper>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    content: {
      flex: 1,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      ...theme.typography.footnoteMedium,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: theme.spacing.sm,
    },
    selectContactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    selectContactText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    tagsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: theme.spacing.md,
    },
    tagItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.accentSoft,
      borderRadius: theme.radius.pill,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    tagItemText: {
      ...theme.typography.subhead,
      color: theme.colors.textPrimary,
      marginRight: theme.spacing.xs,
    },
    textArea: {
      minHeight: 120,
      alignItems: 'flex-start',
      marginBottom: 0,
    },
    uploadRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    uploadText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
    },
    previewRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.md,
    },
    previewWrap: {
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    preview: {
      width: 68,
      height: 68,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.backgroundSecondary,
    },
    previewRemove: {
      position: 'absolute',
      top: -6,
      right: -6,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.textPrimary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bottomSheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
    },
  });

export default Compose;
