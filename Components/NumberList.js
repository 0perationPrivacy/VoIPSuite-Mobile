import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { Divider } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import Metrics from '../helpers/Metrics';
import styles from '../style';
import { Input } from '../components';
import { useForm } from 'react-hook-form'

const NumberList = ({
  onPressBack = () => { },
  onSubmit = () => { },
  data = [],
}) => {
  const [__value, setValue] = useState(null);
  const [numbers, setNumbers] = useState(data);
  const [searchText, setSearchText] = useState('');

  const { control, handleSubmit } = useForm();

  const onPressSelectNumber = value => {
    if (value == __value) {
      value = null;
    }

    setValue(value);
  };

  const onPressSelect = () => {
    onSubmit(__value);
  };

  const handleSearch = (name, text) => {
    setSearchText(text);

    // If the search text is empty, display all items
    if (text === '') {
      setNumbers(data);
    } else {
      // Filter the data based on the search text
      const filteredData = data.filter(
        (item) =>
          item.label.toLowerCase().includes(text.toLowerCase()));

      setNumbers(filteredData);
    }
  };

  const renderHeader = () => {
    return (
      <View style={[innerStyle.contentSpacing, innerStyle.headerContainer]}>
        <TouchableOpacity onPress={onPressBack}>
          <Feather
            name={'arrow-left'}
            size={24}
            style={styles.defaultIconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressSelect}>
          <Text style={innerStyle.selectText}>Select</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMainContent = () => {
    return (
      <View style={innerStyle.mainContentContainer}>
        <Input
          placeholder="Search..."
          onChangeInput={handleSearch}
          control={control}
          name={'search-text'}
          customStyle={{marginBottom : '10%'}}
        // customStyle={globalStyle.authInputContainer}
        // customIconWrap={globalStyle.authInputIconContainer}
        />
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={numbers}
          renderItem={renderItem}
          keyExtractor={item => item.label}></FlatList>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    let isLast = index === data.length - 1;

    const { label, value } = item;

    return (
      <View style={innerStyle.listItemContainer}>
        <TouchableOpacity
          onPress={() => onPressSelectNumber(value)}
          style={[innerStyle.contentSpacing, innerStyle.listItemView]}>
          <Text style={styles.defaultTextColor}>{label}</Text>
          {__value == value && (
            <Feather name={'check'} size={18} color={'#198754'} />
          )}
        </TouchableOpacity>
        {!isLast && renderDivider()}
      </View>
    );
  };

  const renderDivider = () => {
    return <Divider style={innerStyle.dividerContainer} width={1} />;
  };

  return (
    <View style={innerStyle.container}>
      {renderHeader()}
      {renderMainContent()}
    </View>
  );
};

const innerStyle = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.baseMargin,
    paddingVertical: Metrics.smallMargin,
  },
  contentSpacing: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerContainer: {},
  headerRightContainer: {},
  headerRightIcons: {
    marginHorizontal: Metrics.ratio(5),
  },
  mainContentContainer: {
    justifyContent: 'center',
    marginTop: Metrics.doubleBaseMargin,
  },
  dividerContainer: {
    // marginVertical: Metrics.baseMargin
  },
  selectText: {
    fontFamily: Metrics.fontMedium,
    color: '#0d6efd',
    fontSize: 16,
  },
  listItemContainer: {
    marginBottom: Metrics.smallMargin,
  },
  listItemView: {
    paddingBottom: Metrics.baseMargin,
    alignItems: 'center',
  },
});

export default NumberList;
