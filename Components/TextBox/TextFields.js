import React from 'react';
import { SafeAreaView, View, Text, TextInput, Image, ImageBackground, Button } from 'react-native';


const TextFields =(props)=>{
    return(
        <View>
            <TextInput
             style= {props.style }
             onPressIn={props.pressEvent}
             placeholder={props.placeholder}
            />
        </View>
    )
}
export default TextFields;
 