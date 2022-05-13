import React, { } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Header } from '../../components';
import Icon from 'react-native-vector-icons/Feather'
import Metrics from '../../helpers/Metrics';
import Wrapper from '../../components/Wrapper';
import { navigate } from '../../helpers/RootNavigation';
import globalStyle from '../../style';
import { getColorByTheme } from '../../helpers/utils';

const Accounts = (props) => {

  const renderHeader = () => {
    return <Header title={'Account Settings'} />
  }

  const onPressChangeUsername = () => {
    navigate('changeusername')
  }

  return (
    <Wrapper header={renderHeader()}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.itemContainer} onPress={onPressChangeUsername}>
          <Icon name="user" style={globalStyle.defaultIconColor} size={18} />
          <Text style={styles.itemText}>Change Username</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}>
          <Icon name="key" style={globalStyle.defaultIconColor} size={18} />
          <Text style={styles.itemText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}>
          <Icon name="trash" style={globalStyle.defaultIconColor} size={18} />
          <Text style={styles.itemText}>Delete Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}>
          <Icon name="info" style={globalStyle.defaultIconColor} size={18} />
          <Text style={styles.itemText}>Fallback Setting</Text>
        </TouchableOpacity>
      </View>
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.buttonPadding
  },
  itemContainer: {
    flexDirection: 'row',
    padding: Metrics.ratio(10),
    borderWidth: 1,
    borderColor: '#ececec',
    alignItems: "center",
    marginBottom: Metrics.ratio(10)
  },
  itemText: {
    color: getColorByTheme('#000', '#fff'),
    marginLeft: Metrics.ratio(5),
    fontSize: 18
  }
});

export default Accounts;