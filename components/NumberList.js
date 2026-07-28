import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, FlatList} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {Input} from '../components';
import {useForm} from 'react-hook-form';
import {useTheme} from '../theme';

const NumberList = ({onPressBack = () => {}, onSubmit = () => {}, data = []}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [__value, setValue] = useState(null);
  const [numbers, setNumbers] = useState(data);
  const [searchText, setSearchText] = useState('');

  const {control} = useForm();

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

    if (text === '') {
      setNumbers(data);
    } else {
      const filteredData = data.filter(item => item.label.toLowerCase().includes(text.toLowerCase()));

      setNumbers(filteredData);
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={onPressBack} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Feather name={'arrow-left'} size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressSelect}>
          <Text style={styles.selectText}>Select</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMainContent = () => {
    return (
      <View style={styles.mainContent}>
        <Input placeholder="Search..." onChangeInput={handleSearch} control={control} name={'search-text'} icon={'search'} />
        <FlatList contentContainerStyle={{flexGrow: 1}} data={numbers} renderItem={renderItem} keyExtractor={item => item.label} />
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    const {label, value} = item;

    return (
      <TouchableOpacity onPress={() => onPressSelectNumber(value)} style={styles.listItem}>
        <Text style={styles.listItemText}>{label}</Text>
        {__value == value && <Feather name={'check'} size={18} color={theme.colors.accent} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderMainContent()}
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    mainContent: {
      justifyContent: 'center',
      marginTop: theme.spacing.xl,
      flex: 1,
    },
    selectText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.accent,
    },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },
    listItemText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },
  });

export default NumberList;
