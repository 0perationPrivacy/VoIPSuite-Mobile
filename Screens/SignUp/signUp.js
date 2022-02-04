import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, Image, ImageBackground, Button, Switch, TouchableOpacity } from 'react-native';
import ButtonComponent from '../../Components/Button/Button';
import TextFields from '../../Components/TextBox/TextFields';
import Login from '../Login/Login';

const Signup = () => {
    const ChangeRoute=()=>{
        <Login />
    }
    return (
        <View>
            <View style={{ padding: '10%', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                <View style={{}}>
                    <View style={{ display: 'flex', flexDirection: 'row-reverse', alignContent: 'center', justifyContent: 'space-around' }}>
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>
                            Sign Up
                        </Text>
                    </View>
                    <View>

                        <TextFields style={styles.TextBox} placeholder='Username' />
                    </View>
                    <View>

                        <TextFields placeholder='Password' style={styles.TextBox} />
                    </View>
                    <View>

                        <TextFields placeholder='Confirm Password' style={styles.TextBox} />
                    </View>
                    <ButtonComponent title="Sign Up" />
                    <View style={{ display: 'flex', flexDirection: 'row', marginTop: '7%' }}>
                        {/* <View> */}

                        <Text>
                            Already have an account?
                        </Text>
                        {/* </View>
                    <View> */}

                        <TouchableOpacity onPress={ChangeRoute()}>
                            <Text style={{ color: '#3a76f0' }}> Login </Text>
                        </TouchableOpacity>
                        {/* </View> */}
                        {/* <Icon
                        name='rocket'
                        color='grey'
                        size={20}
                    /> */}
                    </View>


                </View>
            </View>

        </View>

    )
}
const styles = StyleSheet.create({
    TextBox: {
        backgroundColor: '#f6f6f6',
        marginTop: '8%',
        marginBottom: '5%'
    }
});
export default Signup;