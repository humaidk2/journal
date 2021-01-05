/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Button,
    TouchableHighlight,
    TouchableOpacity,
    TextInput,
    NativeModules,
    PermissionsAndroid,
    ToastAndroid,
    ImageBackground,
    Dimensions,
} from 'react-native'
import DatePicker from 'react-native-datepicker'
import { useForm } from 'react-hook-form'

declare const global: { HermesInternal: null | {} }

const { KeyStoreModule } = NativeModules

type FormData = {
    firstName: string
    lastName: string
    username: string
    email: string
    password: string
    dob: string
}

const Signup = ({ navigation, route }: any) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dob, setDob] = useState('29/12/2020')
    const [email, setEmail] = useState('')

    const { register, handleSubmit, setValue, errors } = useForm<FormData>()

    useEffect(() => {
        register('firstName', {
            required: { value: true, message: 'firstName is required' },
        })
        register('lastName', {
            required: { value: true, message: 'lastName is required' },
        })
        register('username', {
            required: { value: true, message: 'username is required' },
        })
        register('password', {
            required: { value: true, message: 'password is required' },
        })
        register('dob', {
            required: { value: true, message: 'date of birth is required' },
        })
        register('email', {
            required: { value: true, message: 'email is required' },
            pattern: {
                value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Not a valid email',
            },
        })
    }, [register])
    // useEffect(() => {
    //   setValue('firstName', 'Humaid');
    //   setValue('lastName', 'Khan');
    //   setValue('username', 'hk2');
    //   setValue('password', '123456');
    //   setValue('dob', '30/12/2020');
    //   setValue('email', 'test@humaid.com');
    // }, []);

    const login = async () => {
        // const granted = await PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //   {
        //     title: 'Journal App Permission',
        //     message:
        //       'Journal needs access to your file storage' +
        //       'so you can secure your data.',
        //     buttonNeutral: 'Ask Me Later',
        //     buttonNegative: 'Cancel',
        //     buttonPositive: 'OK',
        //   },
        // );
        // console.log(username);
        // console.log(password);
        // // KeyStoreModule.setKey(username, password);
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //   console.log('You can use the file storage');
        //   KeyStoreModule.setKey('myKey', 'journalPassword', 'humaid');
        // } else {
        //   console.log('File write external storage permission denied');
        // }
        ToastAndroid.show(route.params.name, ToastAndroid.SHORT)
        navigation.navigate('Login', { name: 'Joe' })
    }
    const signup = async (formData: FormData) => {
        console.log(formData)
        try {
            const res = await fetch('http://10.0.1.19:3000/user/signup', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                }),
            })
            const emailToken: any = await res.json()
            console.log(emailToken)
            const data = await fetch(
                `http://10.0.1.19:3000/user/verifyEmail?token=${emailToken.token}`
            )
            const isVerified = await data.json()
            console.log(isVerified)
        } catch (error) {
            console.log('error')
            console.log(error)
        }
    }
    // const granted = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //   {
    //     title: 'Journal Permission',
    //     message:
    //       'Journal needs access to your read files ' +
    //       'so you can use the app safely.',
    //     buttonNeutral: 'Ask Me Later',
    //     buttonNegative: 'Cancel',
    //     buttonPositive: 'OK',
    //   },
    // );
    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //   console.log('You can use the file storage');
    //   const newKey = await KeyStoreModule.getKey('myKey', 'journalPassword');
    //   console.log(newKey);
    //   KeyStoreModule.makeToast(newKey);
    // } else {
    //   console.log('File read external storage permission denied');
    // }
    return (
        <>
            {/* <StatusBar barStyle="dark-content" /> */}
            <SafeAreaView style={styles.scrollView}>
                <ImageBackground
                    source={require('./Login.jpg')}
                    style={styles.bg}
                >
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Signup</Text>
                        </View>
                        <View style={styles.inputForm}>
                            <Text style={styles.label}>Name:</Text>
                            <TextInput
                                style={{
                                    flex: 1,
                                    backgroundColor: 'white',
                                    marginRight: 10,
                                }}
                                onChangeText={(text) =>
                                    setValue('firstName', text)
                                }
                            />
                            <TextInput
                                style={{ flex: 1, backgroundColor: 'white' }}
                                onChangeText={(text) =>
                                    setValue('lastName', text)
                                }
                            />
                        </View>
                        {errors.firstName && (
                            <Text style={styles.errorText}>
                                {errors.firstName.message}
                            </Text>
                        )}
                        {errors.lastName && (
                            <Text style={styles.errorText}>
                                {errors.lastName.message}
                            </Text>
                        )}

                        <View style={styles.inputForm}>
                            <Text style={styles.label}>DOB</Text>
                            <DatePicker
                                date={dob}
                                mode="date"
                                style={styles.input}
                                placeholder="select date"
                                format="DD-MM-YYYY"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0,
                                    },
                                    dateInput: {
                                        marginLeft: 36,
                                    },
                                }}
                                onDateChange={(date) => {
                                    setValue('dob', date)
                                }}
                            />
                        </View>
                        {errors.dob && (
                            <Text style={styles.errorText}>
                                {errors.dob.message}
                            </Text>
                        )}
                        <View style={styles.inputForm}>
                            <Text style={styles.label}>Username:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) =>
                                    setValue('username', text)
                                }
                            />
                        </View>
                        {errors.username && (
                            <Text style={styles.errorText}>
                                {errors.username.message}
                            </Text>
                        )}
                        <View style={styles.inputForm}>
                            <Text style={styles.label}>Email:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => setValue('email', text)}
                            />
                        </View>
                        {errors.email && (
                            <Text style={styles.errorText}>
                                {errors.email.message}
                            </Text>
                        )}
                        <View style={styles.inputForm}>
                            <Text style={styles.label}>Password:</Text>
                            <TextInput
                                secureTextEntry={true}
                                style={styles.input}
                                onChangeText={(text) =>
                                    setValue('password', text)
                                }
                            />
                        </View>
                        {errors.password && (
                            <Text style={styles.errorText}>
                                {errors.password.message}
                            </Text>
                        )}
                        <View style={styles.inputForm}>
                            {/* <Button onPress={signup} style={styles.btn} title="Signup" /> */}
                            <TouchableHighlight
                                onPress={handleSubmit(signup)}
                                style={styles.btn}
                            >
                                <Text style={styles.btnText}>Sign up</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.inputForm}>
                            {/* <Button onPress={login} style={styles.btn} title="Login" /> */}
                            <TouchableHighlight
                                onPress={login}
                                style={styles.btn}
                            >
                                <Text style={styles.btnText}>Login</Text>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                </ImageBackground>
            </SafeAreaView>
        </>
    )
}

const d = Dimensions.get('window')
const styles = StyleSheet.create({
    bg: {
        flex: 1,
        position: 'absolute',
        width: d.width,
        height: d.height,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        height: 150,
        alignSelf: 'stretch',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 30,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        color: 'white',
    },
    inputForm: {
        paddingTop: 10,
        paddingBottom: 5,
        paddingLeft: 30,
        paddingRight: 30,
        height: 70,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        flex: 1,
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    input: {
        flex: 2,
        backgroundColor: 'white',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        height: 20,
    },
    btn: {
        width: 110,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(20, 150, 255, 1)',
        color: 'white',
        borderRadius: 5,
        marginTop: 15,
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
})

export default Signup
