import Icon from 'react-native-vector-icons/Feather';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {openDrawer} from '../helpers/RootNavigation';
import {CustomModal} from '.';
import {useDispatch, useSelector} from 'react-redux';
import {profileActions} from '../redux/actions/profile';
import {callActions} from '../redux/actions/call';
import _ from 'lodash';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Button, Input} from '../components';
import {useForm} from 'react-hook-form';
import {useTheme} from '../theme';

const HomeHeader = ({onPressProfile = () => {}}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [isProfileModalVisible, setProfileModalVisibility] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [activeProfileNumber, setActiveProfileNumber] = useState(null);
  const [profileName, setProfileName] = useState('Choose Profile');
  const [searchText, setSearchText] = useState('');

  const dispatch = useDispatch();

  const isLoading = useSelector(state => state.profile.isLoading);
  const profile = useSelector(state => state.profile.items);
  // profile.profileName is redux-persisted (see redux/store.js's persist
  // whitelist) and survives app restarts on its own — the bug was this
  // component ignoring it and always overwriting it with data[0] below.
  const persistedProfileName = useSelector(state => state.profile.profileName);

  const refRBSheet = useRef();
  const {control, handleSubmit} = useForm();

  useEffect(() => {
    getProfileList();
  }, []);

  useEffect(() => {
    if (profile && _.isArray(profile)) {
      let data = getFormattedProfiles();

      setProfiles(data);

      // Restore whichever profile was last active instead of always
      // defaulting to the first one — every app relaunch was silently
      // switching the active calling profile back to whatever sorts first,
      // regardless of what the user had actually selected.
      const restored = persistedProfileName?.id && data.find(item => item.id === persistedProfileName.id);
      const selected = restored || data[0];

      onSetProfileNameRedux({profile: selected?.profile, id: selected?.id});
      onPressProfile(selected?.id);
      setActiveProfileNumber(selected?.number);
    }
  }, [profile]);

  const getFormattedProfiles = () => {
    let data = [];
    profile.forEach((item, index) => {
      const {id, profile, number, messageCount} = item;
      data.push({id, profile, number, messageCount});
    });

    return data;
  };

  const handleSearch = (name, text) => {
    setSearchText(text);
    let data = getFormattedProfiles();
    if (text === '') {
      setProfiles(data);
    } else {
      const filteredData = data.filter(
        item => item.profile.toLowerCase().includes(text.toLowerCase()) || item.number.toLowerCase().includes(text.toLowerCase()),
      );

      setProfiles(filteredData);
    }
  };

  const showProfileDropDown = () => {
    refRBSheet.current.open();
  };

  const onSetProfileNameRedux = param => {
    setProfileName(param.profile);
    dispatch(profileActions.setProfileName(param));

    // Re-registers the calling engine against whichever profile's number is
    // now active, same as switching SIM slots on a dual-SIM phone.
    if (param.id) {
      dispatch(callActions.connectCallEngineAction(param.id));
    }
  };

  const onSelectProfile = item => {
    const {id, number, profile} = item;

    onPressProfile(id);
    setProfileName(profile);
    setActiveProfileNumber(number);
    onSetProfileNameRedux({profile, id});

    refRBSheet.current.close();
  };

  const getProfileList = () => {
    dispatch(profileActions.getProfileAction());
  };

  const onPressSideMenu = () => {
    openDrawer();
  };

  const onModalOpen = () => {
    refRBSheet.current.close();
    setTimeout(() => {
      setProfileModalVisibility(true);
    }, 500);
  };

  const onModalClose = () => {
    setProfileModalVisibility(false);
  };

  const onPressSaveProfileName = (data, errorCb) => {
    dispatch(profileActions.createProfileAction(data, onSaveProfileCb, errorCb));
  };

  const onSaveProfileCb = () => {
    setProfileModalVisibility(false);
    getProfileList();
  };

  const getProfileListItemHeight = () => {
    let height = Dimensions.get('window').height / 2 + 100;
    let length = profiles.length;

    if (length > 4) {
      return height;
    }

    return length * theme.spacing.xxxl * 2 + 300;
  };

  const renderProfileItem = ({item}) => {
    const {profile, number, messageCount} = item;

    return (
      <TouchableOpacity style={styles.profileItemRow} onPress={() => onSelectProfile(item)}>
        <View style={styles.profileItemTextWrap}>
          <Text style={styles.profileItemName}>{profile}</Text>
          {number && <Text style={styles.profileItemNumber}>{number}</Text>}
        </View>
        {messageCount > 0 && (
          <View style={styles.profileItemBadge}>
            <Text style={styles.profileItemBadgeText}>{messageCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTitleNumber = () => {
    return <Text style={styles.headerNumber}>{activeProfileNumber}</Text>;
  };

  const renderBottomSheet = () => {
    const height = getProfileListItemHeight();

    return (
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={height}
        customStyles={{
          container: styles.sheetContainer,
          draggableIcon: {backgroundColor: theme.colors.border},
        }}>
        <View style={styles.profileListContainer}>
          <Text style={styles.sheetTitle}>Profiles</Text>
          <Input placeholder="Search profiles" onChangeInput={handleSearch} control={control} name={'search-text'} icon={'search'} />
          <FlatList data={profiles} renderItem={renderProfileItem} keyExtractor={item => item.id} showsVerticalScrollIndicator={true} />
        </View>
        <View style={styles.addProfileButtonWrap}>
          <Button title={'Add new profile'} onPress={onModalOpen} />
        </View>
      </RBSheet>
    );
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={onPressSideMenu} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name={'menu'} size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        {activeProfileNumber && renderTitleNumber()}
      </View>
      <TouchableOpacity onPress={showProfileDropDown} style={styles.profileSwitcher}>
        <Text style={styles.profileSwitcherText} numberOfLines={1}>
          {profileName}
        </Text>
        <Icon name={'chevron-down'} size={18} color={theme.colors.textSecondary} />
      </TouchableOpacity>
      {renderBottomSheet()}
      <CustomModal isVisible={isProfileModalVisible} onBackdropPress={onModalClose} onPressSave={onPressSaveProfileName} isLoading={isLoading} />
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
    },
    headerNumber: {
      ...theme.typography.headline,
      color: theme.colors.textPrimary,
      marginLeft: theme.spacing.md,
    },
    profileSwitcher: {
      flexDirection: 'row',
      alignItems: 'center',
      maxWidth: 140,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.backgroundSecondary,
    },
    profileSwitcherText: {
      ...theme.typography.subhead,
      color: theme.colors.textPrimary,
      marginRight: theme.spacing.xs,
      flexShrink: 1,
    },
    sheetContainer: {
      borderTopRightRadius: theme.radius.xl,
      borderTopLeftRadius: theme.radius.xl,
      backgroundColor: theme.colors.surface,
    },
    sheetTitle: {
      ...theme.typography.title2,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
    },
    profileListContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    addProfileButtonWrap: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },
    profileItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },
    profileItemTextWrap: {
      flex: 1,
    },
    profileItemName: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textPrimary,
    },
    profileItemNumber: {
      ...theme.typography.footnote,
      color: theme.colors.accent,
      marginTop: 2,
    },
    profileItemBadge: {
      minWidth: 22,
      height: 22,
      borderRadius: 11,
      paddingHorizontal: 6,
      backgroundColor: theme.colors.destructive,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileItemBadgeText: {
      ...theme.typography.caption,
      color: '#fff',
    },
  });

export default HomeHeader;
