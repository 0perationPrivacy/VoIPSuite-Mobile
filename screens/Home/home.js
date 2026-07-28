import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
  Keyboard,
} from 'react-native';
import {GiftedChat, Send, Bubble} from 'react-native-gifted-chat/src';
import MessageInput from '../../components/CustomInputToolbar';
import {generateRandomString} from '../../helpers/utils';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import {alertActions, messagesActions, uploadsActions} from '../../redux/actions';
import {callActions} from '../../redux/actions/call';
import {useRoute} from '@react-navigation/native';
import {goBack, navigate, navigateAndReset} from '../../helpers/RootNavigation';
import RBSheet from 'react-native-raw-bottom-sheet';
import ContactDetail from '../../components/ContactDetail';
import {launchImageLibrary} from 'react-native-image-picker';
import socketClient from '../../helpers/socket';

//icons
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getUserId} from '../../helpers/auth-header';
import GalleryItem from './GalleryItem';
import {useTheme} from '../../theme';

const Home = props => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [__messages, setMessages] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [contactNumber, setContactNumber] = useState(null);
  const [profileID, setProfileId] = useState(null);
  const [files, setFiles] = useState([]);
  const [filesId, setFilesId] = useState([]);
  const [showSend, setShowSend] = useState(false);
  const [isSocketInit, setSocketInit] = useState(false);
  const [messageInputText, setMessageInputText] = useState(null);

  const dispatch = useDispatch();
  const route = useRoute();

  const isLoading = useSelector(state => state.messages.isLoading);
  const messages = useSelector(state => state.messages.messages);
  const profileSettings = useSelector(state => state.settings.profileSettings);
  const user = useSelector(state => state.authentication.user);
  const registrationState = useSelector(state => state.call.registrationState);
  const registrationMessage = useSelector(state => state.call.registrationMessage);

  const refRBSheet = useRef();

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const {data} = route.params;
    const {number} = data;
    console.log('data ===>', data);
    const {contact, _id} = number;

    if (contact) {
      setContactInfo(contact);
    }

    setContactNumber(_id);

    if (data) {
      onPressMessageList(data);
      return;
    }

    goBack();
  };

  useEffect(() => {
    if (profileSettings && !_.isEmpty(profileSettings)) {
      setProfileId(profileSettings);
    }
  }, [profileSettings]);

  const onPressMessageList = data => {
    dispatch(messagesActions.getMessageDetailsAction(data));
  };

  useEffect(() => {
    if (_.isArray(messages)) {
      let data = [];
      messages.forEach(mItem => {
        const {_id, message, created_at, contact, type, number, user, media} =
          mItem;
        // let _contact = contact ? contact?.first_name + ' ' + contact?.last_name : number;
        let _contactUser = contact ? user : _id;

        let images = media ? JSON.parse(media) : [];

        data.unshift({
          _id,
          text: message,
          createdAt: new Date(created_at),
          user: {_id: type === 'send' ? 1 : _contactUser},
          image: images && images.length > 0 ? images[0] : null,
        });
      });

      setMessages(data);
    }
  }, [messages]);

  useEffect(() => {
    (async () => {
      await initSocket();
      setSocketInit(true);
    })();

    return () => {
      setMessages([]);
      // this now gets called when the component unmounts
    };
  }, [contactNumber]);

  const initSocket = async () => {
    let isConnected = socketClient.isConnected();

    if (!isConnected) {
      socketClient.init();
    }

    const userId = getUserId();
    socketClient.joinRoomByUserId(userId);
    socketClient.listenEventForMessage(async function (data) {
      if (!data) return;
      const {number, message} = data;
      if (number == contactNumber) {
        appendMessage([
          {
            _id: generateRandomString(),
            text: message,
            createdAt: new Date(),
            user: {
              _id: 2,
            },
          },
        ]);
      }
    });
  };

  const onSendMessage = () => {
    const {_id} = user.data;
    const number = contactNumber;

    let data = {
      media: getFilesData(),
      message: messageInputText,
      numbers: [number],
      profile: profileID,
      user: _id,
    };
    dispatch(
      messagesActions.sendMessageDetailsAction(
        data,
        () => onSuccessSendMessage(messages),
        false,
      ),
    );
  };

  const onSuccessSendMessage = (messages = []) => {
    init();
    setFiles([]);
    setMessageInputText(null);
    Keyboard.dismiss();
    // setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  };

  const appendMessage = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const onPressAddContact = number => {
    navigate('Contact', {number});
  };

  const onPressDeleteIcon = () => {
    dispatch(
      messagesActions.deleteMessageAction(contactNumber, function () {
        navigateAndReset('Messages');
      }),
    );
  };

  const onPressCall = () => {
    if (!contactNumber) return;

    if (registrationState === 'failed') {
      dispatch(alertActions.error(`Registration failed${registrationMessage ? `: ${registrationMessage}` : ''} — check your SIP credentials in Profile Settings.`));
      return;
    }

    if (registrationState !== 'ok') {
      dispatch(alertActions.error("Calling isn't set up for this profile yet — open Profile Settings and save again to finish provisioning."));
      return;
    }

    dispatch(callActions.startCallAction(contactNumber));
  };

  const onPressContactName = () => {
    refRBSheet.current.open();
  };

  const closeContactBottomSheet = () => {
    refRBSheet.current.close();
  };

  const onPressFileUpload = async () => {
    const fileOptions = {};
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
    fileArray.push(data);
    setFiles(fileArray);
  };

  const onPressRemoveFile = index => {
    const fileArray = [...files];
    if (index > -1) {
      fileArray.splice(index, 1);
    }

    setFiles(fileArray);
  };

  const getFilesData = () => {
    const data = files.map(item => {
      return item?.media;
    });

    return data;
  };

  useEffect(() => {
    let status = true;
    if (files.length > 0) {
      status = true;
    }

    setShowSend(status);
  }, [files]);

  const headerBody = () => {
    if (contactInfo && _.isObject(contactInfo)) {
      return (
        <TouchableOpacity
          style={styles.headerBodyTextContainer}
          onPress={onPressContactName}>
          <Icon name={'user'} size={22} color={theme.colors.textPrimary} />
          <Text style={styles.headerBodyText}>
            {contactInfo?.first_name} {contactInfo?.last_name}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.headerContactNumberContainer}>
        <Text style={styles.headerBodyText}>{contactNumber}</Text>
        <TouchableOpacity style={styles.composeButtonWrap} onPress={() => onPressAddContact(contactNumber)}>
          <Icon name="plus" color={theme.colors.textOnAccent} size={18}></Icon>
        </TouchableOpacity>
      </View>
    );
  };

  const headerLeft = () => {
    return (
      <TouchableOpacity onPress={() => goBack()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <Icon name={'arrow-left'} size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity>
    );
  };

  const headerRight = () => {
    return (
      <View style={styles.headerRightContainer}>
        <TouchableOpacity onPress={onPressCall} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon size={21} name="phone" color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerDeleteIcon} onPress={onPressDeleteIcon} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon size={21} name="trash" color={theme.colors.destructive} />
        </TouchableOpacity>
      </View>
    );
  };

  const customHeader = () => {
    return (
      <View style={styles.customHeaderContainer}>
        <View style={styles.customHeaderLeftContainer}>
          {headerLeft()}
          {headerBody()}
        </View>
        {headerRight()}
      </View>
    );
  };

  const renderBottomSheet = () => {
    let height = Dimensions.get('window').height / 2 + 100;

    return (
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={height}
        customStyles={{
          container: styles.sheetContainer,
        }}>
        <ContactDetail
          onPressBack={closeContactBottomSheet}
          contact={contactInfo}
          onPressMessage={closeContactBottomSheet}
        />
      </RBSheet>
    );
  };

  const renderImageGallery = () => {
    return (
      <View style={styles.messageGalleryContainer}>
        <FlatList
          data={files}
          renderItem={renderImageGalleryItem}
          keyExtractor={item => item?._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{width: 10}} />}
          contentContainerStyle={styles.messageGalleryItemContainer}
        />
      </View>
    );
  };

  const renderImageGalleryItem = ({item, index}) => {
    return (
      <GalleryItem
        item={item}
        index={index}
        onPressRemove={onPressRemoveFile}
      />
    );
  };

  const renderSend = props => {
    let icon = isLoading ? 'loader' : 'arrow-right';
    return (
      <View style={styles.btnSendContainer}>
        <TouchableOpacity onPress={onPressFileUpload}>
          <Ionicons size={26} name="attach" color={theme.colors.accent} />
        </TouchableOpacity>
        <Send
          {...props}
          disabled={isLoading}
          sendButtonProps={{
            ...props,
            onPress: text => onSendMessage(),
          }}>
          <View style={styles.btnSend}>
            <Icon name={icon} size={18} color={theme.colors.textOnAccent} />
          </View>
        </Send>
      </View>
    );
  };

  const renderBubble = props => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: styles.bubbleRight,
        left: styles.bubbleLeft,
      }}
      textStyle={{
        right: styles.bubbleTextRight,
        left: styles.bubbleTextLeft,
      }}
    />
  );

  return (
    <View style={styles.flexOne}>
      {customHeader()}

      <GiftedChat
        messages={__messages}
        user={{
          _id: 1,
        }}
        messagesContainerStyle={styles.messagesContainer}
        isAnimated
        renderAvatar={null}
        renderBubble={renderBubble}
        renderSend={renderSend}
        textInputStyle={styles.composer}
        placeholder={'Type message here'}
        placeholderTextColor={theme.colors.textTertiary}
        renderInputToolbar={props => (
          <MessageInput {...props} backgroundColor={theme.colors.background} borderColor={theme.colors.separator} />
        )}
        renderFooter={files.length > 0 ? renderImageGallery : null}
        alwaysShowSend={showSend}
        minInputToolbarHeight={60}
        tool
        shouldUpdateMessage={(props, nextProps) => __messages}
        onInputTextChanged={text => setMessageInputText(text)}
        text={messageInputText}
      />
      {renderBottomSheet()}
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    flexOne: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    composeButtonWrap: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.accent,
      marginLeft: theme.spacing.sm,
    },
    headerBodyText: {
      ...theme.typography.headline,
      color: theme.colors.textPrimary,
      marginLeft: theme.spacing.xs,
    },
    headerContactNumberContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: theme.spacing.sm,
    },
    customHeaderContainer: {
      backgroundColor: theme.colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.md,
    },
    customHeaderLeftContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 1,
    },
    headerBodyTextContainer: {
      marginLeft: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerRightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerDeleteIcon: {
      marginLeft: theme.spacing.lg,
    },
    sheetContainer: {
      borderTopRightRadius: theme.radius.xl,
      borderTopLeftRadius: theme.radius.xl,
      backgroundColor: theme.colors.surface,
    },
    messagesContainer: {
      backgroundColor: theme.colors.background,
    },
    bubbleRight: {
      backgroundColor: theme.colors.bubbleSentBackground,
      borderRadius: theme.radius.bubble,
    },
    bubbleLeft: {
      backgroundColor: theme.colors.bubbleReceivedBackground,
      borderRadius: theme.radius.bubble,
    },
    bubbleTextRight: {
      color: theme.colors.bubbleSentText,
      ...theme.typography.body,
    },
    bubbleTextLeft: {
      color: theme.colors.bubbleReceivedText,
      ...theme.typography.body,
    },
    composer: {
      borderRadius: theme.radius.pill,
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
      paddingBottom: 0,
      paddingTop: 0,
      fontSize: theme.typography.body.fontSize,
      fontFamily: theme.typography.body.fontFamily,
      backgroundColor: theme.colors.backgroundSecondary,
      textAlignVertical: 'center',
      color: theme.colors.textPrimary,
    },
    btnSendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 60,
    },
    btnSend: {
      height: 36,
      width: 36,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
      backgroundColor: theme.colors.accent,
      borderRadius: 18,
    },
    messageGalleryContainer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },
    messageGalleryItemContainer: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
  });

export default Home;
