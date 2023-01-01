import React, { } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import _ from 'lodash'
import Metrics from '../../helpers/Metrics';
import Icon from 'react-native-vector-icons/Feather'

const GalleryItem = ({ item = {}, index, onPressRemove = () => { } }) => {
  return (
    <View>
      <TouchableOpacity style={styles.chatGalleryRemoveIcon} onPress={() => onPressRemove(index)}>
        <Icon name="x" size={15} color="#fff" />
      </TouchableOpacity>
      <Image source={{ uri: item?.media }} style={styles.messageGallery(index)} />
    </View>
  )
}

const numCols = 4;
const spacing = 1.25;

const styles = StyleSheet.create({
  messageGallery: (index = 0) => ({
    width: Metrics.ratio(100),
    height: Metrics.ratio(100),
    marginBottom: spacing,
    marginLeft: index % numCols !== 0 ? spacing : 0
  }),
  chatGalleryRemoveIcon: {
    position: 'absolute',
    zIndex: 999,
    right: Metrics.ratio(-5),
    backgroundColor: 'red',
    borderRadius: Metrics.ratio(20),
    width: Metrics.ratio(20),
    height: Metrics.ratio(20),
    alignItems: 'center',
    justifyContent: 'center',
    top: Metrics.ratio(-5)
  }
});

export default GalleryItem;