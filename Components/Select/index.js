
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './style';
import PropTypes from 'prop-types'

const data = [
    // { label: 'Item 1', value: '1' },
];

const CustomSelect = ({ containerStyle, items = [], onChange = () => { }, ...rest }) => {
    const [value, setValue] = useState(null);

    const __onChange = (item) => {
        const { value } = item;
        setValue(value);

        if (onChange) {
            onChange(value)
        }
    }

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
            containerStyle={styles.itemContainerStyle}
            data={items}
            labelField="label"
            valueField="value"
            value={value}
            onChange={__onChange}
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

