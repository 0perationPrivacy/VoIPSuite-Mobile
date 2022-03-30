import React, {  } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Header } from '../../components';
import Icon from 'react-native-vector-icons/Feather'
import Metrics from '../../helpers/Metrics';
import Wrapper from '../../components/Wrapper';

const Accounts = (props) => {

  const renderHeader = () => {
    return <Header title={'Account Settings'} />
  }

  return (
    <Wrapper header={renderHeader()}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.itemContainer}>
          <Icon name="user" color="#fff" size={18} />
          <Text style={styles.itemText}>Change Username</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}>
          <Icon name="key" color="#fff" size={18} />
          <Text style={styles.itemText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}>
          <Icon name="trash" color="#fff" size={18} />
          <Text style={styles.itemText}>Delete Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}>
          <Icon name="info" color="#fff" size={18} />
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
    color: '#fff',
    marginLeft: Metrics.ratio(5),
    fontSize: 18
  }
});

export default Accounts;