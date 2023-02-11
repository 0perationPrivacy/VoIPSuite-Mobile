import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  FlatList,
	Keyboard,
} from 'react-native';
import {GiftedChat, Send} from 'react-native-gifted-chat/src';
import globalStyles from '../../style';
import MessageInput from '../../components/CustomInputToolbar';
import {generateRandomString, getColorByTheme} from '../../helpers/utils';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import {messagesActions, uploadsActions} from '../../redux/actions';
import {useRoute} from '@react-navigation/native';
import {goBack, navigate, navigateAndReset} from '../../helpers/RootNavigation';
import Metrics from '../../helpers/Metrics';
import RBSheet from 'react-native-raw-bottom-sheet';
import ContactDetail from '../../components/ContactDetail';
import {launchImageLibrary} from 'react-native-image-picker';
import socketClient from '../../helpers/socket';
import notifee from '@notifee/react-native';

//icons
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getUserId, isLoggedIn} from '../../helpers/auth-header';
import GalleryItem from './GalleryItem';
import Loader from '../../components/Loader';

const Home = props => {
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

  const refRBSheet = useRef();

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const {data} = route.params;
    const {number} = data;
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
      // this now gets called when the component unmounts
    };
  }, [contactNumber]);

  const initSocket = async () => {
    let isConnected = socketClient.isConnected();

    if (!isConnected) {
      await socketClient.init();
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
		setMessageInputText(null)
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
    // dispatch(messagesActions.deleteMessageAction(contactNumber, function () {
    // 	navigateAndReset('Messages')
    // }))
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
          <Icon
            name={'user'}
            size={24}
            color={getColorByTheme('#000', '#fff')}
          />
          <Text style={styles.headerBodyText}>
            {contactInfo?.first_name} {contactInfo?.last_name}
          </Text>
          {/* <Text style={styles.headerBodyTextSecondary}>{contactInfo?.number}</Text> */}
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.headerContactNumberContainer}>
        <Text style={styles.headerBodyText}>{contactNumber}</Text>
        <TouchableOpacity
          style={[styles.composeButtonWrap, globalStyles.primaryBgColor]}
          onPress={() => onPressAddContact(contactNumber)}>
          <Icon name="plus" color="#fff" size={20}></Icon>
        </TouchableOpacity>
      </View>
    );
  };

  const headerLeft = () => {
    return (
      <TouchableOpacity onPress={() => goBack()}>
        <Icon
          name={'arrow-left'}
          size={25}
          style={globalStyles.defaultIconColor}
        />
      </TouchableOpacity>
    );
  };

  const headerRight = () => {
    return (
      <View style={styles.headerRightContainer}>
        <TouchableOpacity onPress={onPressCall}>
          <Icon size={22} name="phone" style={globalStyles.defaultIconColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerDeleteIcon}
          onPress={onPressDeleteIcon}>
          <Icon
            size={22}
            name="trash"
            color={getColorByTheme('#2e2e2e', '#fff')}
          />
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
          container: globalStyles.bottomSheetContainer,
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
          <Ionicons
            size={Metrics.ratio(30)}
            name="attach"
            color={getColorByTheme('#0d6efd', '#0d6efd')}
          />
        </TouchableOpacity>
        <Send
          {...props}
          disabled={isLoading}
          sendButtonProps={{
            ...props,
            onPress: text => onSendMessage(),
          }}>
          <View style={styles.btnSend}>
            <View style={styles.btnSendIcon}>
              {/* {isLoading ? (
                <Loader color="#fff" />
              ) : (
                <Icon name={icon} size={20} color="#0d6efd" />
              )} */}
              <Icon name={icon} size={20} color="#0d6efd" />
            </View>
          </View>
        </Send>
      </View>
    );
  };

  return (
    <View style={globalStyles.flexOne}>
      {/* <Header headerBody={headerBody} headerRight={headerRight} /> */}
      {customHeader()}

      <GiftedChat
        messages={__messages}
        user={{
          _id: 1,
        }}
        // renderInputToolbar={MessageInput}
        messagesContainerStyle={globalStyles.themeBg}
        // renderComposer={renderComposer}
        isAnimated
        renderAvatar={null}
        renderSend={renderSend}
        textInputStyle={styles.composer}
        placeholder={'Type message here'}
        renderInputToolbar={MessageInput}
        renderFooter={files.length > 0 ? renderImageGallery : null}
        alwaysShowSend={showSend}
        // minComposerHeight={40}
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

const styles = StyleSheet.create({
  composeButtonWrap: {
    width: 20,
    height: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'absolute',
    // bottom: 100,
    left: 10,
  },
  headerContainer: {},
  headerBodyText: {
    fontSize: 18,
    textAlign: 'center',
    color: getColorByTheme('#000', '#fff'),
    fontFamily: Metrics.fontMedium,
    marginLeft: Metrics.ratio(3),
    // borderWidth : 1
  },
  headerBodyTextSecondary: {
    fontSize: 14,
    textAlign: 'justify',
    color: getColorByTheme('#000', '#fff'),
    fontFamily: Metrics.fontRegular,
  },
  headerContactNumberContainer: {
    flexDirection: 'row',
    marginLeft: Metrics.smallMargin,
  },
  headerContactNumberAddBtn: {
    marginLeft: Metrics.ratio(5),
  },
  customHeaderContainer: {
    backgroundColor: getColorByTheme('#f6f6f6', '#2e2e2e'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.smallMargin,
    paddingVertical: Metrics.baseMargin,
  },
  customHeaderLeftContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBodyTextContainer: {
    marginLeft: Metrics.smallMargin,
    flexDirection: 'row',
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  headerDeleteIcon: {
    marginLeft: Metrics.smallMargin,
  },
  sheetContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  composer: {
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 0,
    paddingTop: 0,
    fontSize: 16,
    backgroundColor: getColorByTheme('#e9e9e9', '#3b3b3b'),
    textAlignVertical: 'center',
    color: getColorByTheme('#000', '#fff'),
  },
  btnSendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  btnSend: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Metrics.ratio(10),
    backgroundColor: '#0d6efd',
    borderRadius: 10,
  },
  btnSendIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  messageGalleryContainer: {
    borderTopWidth: 0.5,
  },
  messageGalleryItemContainer: {
    paddingVertical: Metrics.ratio(10),
    paddingHorizontal: Metrics.ratio(10),
    marginVertical: Metrics.ratio(5),
  },
});

export default Home;
