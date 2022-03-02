
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './style';
import PropTypes from 'prop-types'

const data = [
    { label: 'Item 1', value: '1' },
];

const CustomSelect = ({ containerStyle, ...rest }) => {
    const [value, setValue] = useState(null);

    const renderItem = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
            </View>
        );
    };

    return (
        <Dropdown
            style={[styles.dropdown, containerStyle]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            labelField="label"
            valueField="value"
            value={value}
            onChange={item => {
                setValue(item.value);
            }}
            renderItem={renderItem}
            maxHeight={120}
            {...rest}
        />
    );
};

CustomSelect.defaultProps = {
    containerStyle: PropTypes.object
};

export default CustomSelect;

