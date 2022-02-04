import React from 'react';
import { Text, View, Button, TouchableOpacity } from 'react-native';

const ButtonComponent = (props) => {
    return (
        <Button title={props.title} color="#3a76f0" >
        
        </Button>
        // <TouchableOpacity style={{backgroundColor:'#3a76f0' , height:'25%' , width:'100%'}}>
        //     <Text style={{textAlign:'center' , justifyContent:'center' , alignContent:'center' , alignSelf:'center' , alignItems:'center' }}>
        //     {props.title}
        //     </Text>
        // </TouchableOpacity>

    )
}
export default ButtonComponent;