import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import Wrapper from '../../components/Wrapper';
import {Header, Select, Button} from '../../components';
import Feather from 'react-native-vector-icons/Feather';
import {useForm} from 'react-hook-form';
import {getColorByTheme} from '../../helpers/utils';
import {useDispatch, useSelector} from 'react-redux';
import {callActions} from '../../redux/actions';
// import {RTCView} from 'react-native-webrtc';

const data = [
  {value: 1},
  {value: 2},
  {value: 3},
  {value: 4},
  {value: 5},
  {value: 6},
  {value: 7},
  {value: 8},
  {value: 9},
  {value: '*'},
  {value: 0},
  {value: '#'},
];

const DialPad = () => {
  const [stream, setStream] = useState(null);
  const start = async () => {
    // if (!stream) {
    //     let s;
    //     try {
    //         s = await mediaDevices.getUserMedia({ audio: true, video: false });
    //         setStream(s);
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }
  };
  const stop = () => {
    if (stream) {
      stream.release();
      setStream(null);
    }
  };

  ///
  const [number, setNumber] = useState('0');
  const {control} = useForm();

  const onPressDialNumber = num => {
    let __number = number;
    if (__number.length <= 12) {
      const numbersAsString = `${__number}${num}`;
      setNumber(numbersAsString);
    }
  };

  const onPressCleanNumber = () => {
    let __number = number;
    if (__number.length > 1) {
      __number = __number.slice(0, -1);
      setNumber(__number);
    }
  };

  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.call.isLoading);
  const token = useSelector(state => state.call.token);
  const profile = useSelector(state => state.profile.profileName);

  const getProviderToken = () => {
    const {id} = profile;
    if (id) {
      dispatch(callActions.getProviderTokenAction({setting_id: id}));
    }
  };

  useEffect(() => {
    // getProviderToken();
  }, [profile]);

  const renderHeader = () => {
    return <Header isTitle={false} />;
  };

  const renderSelectField = () => {
    return (
      <Select
        placeholder="Select Contact"
        containerStyle={styles.selectContainer}
      />
    );
  };

  const renderDialInput = () => {
    return (
      <TextInput
        value={number}
        name="lastName"
        control={control}
        style={styles.inputContainer}
        textAlign="center"
        editable={false}
        keyboardType={'numeric'}
      />
    );
  };

  const renderNumberItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressDialNumber(item.value)}
        key={index}
        style={styles.numberListWrap}>
        <Text style={styles.numberListText}>{item.value}</Text>
      </TouchableOpacity>
    );
  };

  const renderCallIcon = () => {
    return (
      <TouchableOpacity
        style={[styles.numberListWrap, styles.dialPadActionPhoneWrap]}>
        <Feather name="phone" size={24} color="#fff"></Feather>
      </TouchableOpacity>
    );
  };

  const renderCleanIcon = () => {
    return (
      <TouchableOpacity
        style={[styles.numberListWrap, styles.dialPadActionCleanWrap]}
        onPress={onPressCleanNumber}>
        <Feather name="x" size={24} color="#fff"></Feather>
      </TouchableOpacity>
    );
  };

  return (
    <Wrapper header={renderHeader()}>
      {/* {renderSelectField()}
            {renderDialInput()}
            <View style={styles.numberListContainer}>
                <FlatList
                    data={data}
                    renderItem={renderNumberItem}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    scrollEnabled={false}
                />
            </View>
            <View style={styles.dialPadActionContainer}>
                {renderCallIcon()}
                {renderCleanIcon()}
            </View> */}
      {/* {stream && <RTCView streamURL={stream.toURL()} style={styles.stream} />} */}
      <View style={styles.footer}>
        <Button title="Start" onPress={start} />
        <Button title="Stop" onPress={stop} />
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  selectContainer: {
    marginVertical: 0,
  },
  inputContainer: {
    marginVertical: 15,
    borderWidth: 0,
    fontSize: 30,
    marginTop: 20,
    color: getColorByTheme('#000', '#fff'),
  },
  numberListContainer: {
    alignItems: 'center',
    // borderWidth: 1,
    marginTop: 20,
  },
  numberListWrap: {
    borderRadius: 60,
    width: 60,
    height: 60,
    borderColor: '#ececec',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  numberListText: {
    fontSize: 24,
    color: getColorByTheme('#000', '#fff'),
  },
  dialPadActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  dialPadActionPhoneWrap: {
    backgroundColor: 'green',
  },
  dialPadActionCleanWrap: {
    backgroundColor: 'red',
  },
});

export default DialPad;
