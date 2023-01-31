import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Dimensions } from 'react-native';
import globalStyles from '../../style';
import { useForm } from 'react-hook-form'
import { Input } from '../../components';
import Wrapper from '../../components/Wrapper';
import { Button, Header } from '../../components';
import Feather from 'react-native-vector-icons/Feather';
const windowWidth = Dimensions.get('window').width;
import { getColorByTheme, isEmpty } from '../../helpers/utils';
import { useDispatch, useSelector } from 'react-redux'
import { contactActions } from '../../redux/actions';
import { navigateAndReset } from '../../helpers/RootNavigation';
import { useRoute } from '@react-navigation/native';
import Contacts from 'react-native-contacts';
import _ from 'lodash';
import Metrics from '../../helpers/Metrics';

const ContactDetail = () => {
  const [isValidate, setValidate] = useState(false);

  const renderHeader = () => {
    return <Header isTitle={false} headerRight={renderHeaderRight} />
  }

  const renderHeaderRight = () => {
    return (
      <TouchableOpacity style={styles.headerRightContainer}>
        <Feather name="edit" size={24} style={styles.headerRightIcons} />
        <Feather name="trash" size={24} style={styles.headerRightIcons} />
      </TouchableOpacity>
    )
  }

  return (
    <Wrapper header={renderHeader()}>
      <View style={[globalStyles.flexOne, { marginTop: 10 }]}>

      </View>
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
  },
  headerRightIcons: {
    marginHorizontal: Metrics.ratio(5),
    color: getColorByTheme('#000', '#6c757d')
  }
});

export default ContactDetail;