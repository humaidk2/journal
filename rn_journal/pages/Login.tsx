/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Button,
    TextInput,
    NativeModules,
    PermissionsAndroid,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
} from 'react-native'
import Config from 'react-native-config'

declare const global: { HermesInternal: null | {} }

const { KeyStoreModule } = NativeModules

const Login = ({ navigation, signin }: any) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const login = async () => {
        const writeGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'Journal App Permission',
                message:
                    'Journal needs access to your file storage' +
                    'so you can secure your data.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        )
        const readGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                title: 'Journal App Permission',
                message:
                    'Journal needs access to your file storage' +
                    'so you can secure your data.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        )
        // KeyStoreModule.setKey(username, password);
        if (writeGranted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('File write external storage permission denied')
            return
        }
        try {
            const refreshJson = await fetch(`${Config.AUTH_API}/user/login`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    email: 'test@hum.com',
                }),
            })
            const refreshToken: any = await refreshJson.json()
            const accessJson = await fetch(`${Config.AUTH_API}/user/refresh`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: refreshToken.token,
                }),
            })
            const accessToken = await accessJson.json()
            console.log(accessToken)
            const userJson = await fetch(
                `${Config.AUTH_API}/user/accessToken`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: accessToken.token,
                    }),
                }
            )
            let user = await userJson.json()
            console.log(user)
            if (user.decoded.encryptedKey) {
                user = user.decoded
                console.log('we have a key')
                console.log('we just need to generate a key with the password')
                console.log('and decrypt the key')
                const encryptedKey = user.encryptedKey
                const encryptedKeyIv = user.encryptedKeyIv
                const passwordSalt = user.passwordSalt
                console.log('encrypted Key  = ' + encryptedKey)
                console.log('passwordSalt = ' + passwordSalt)
                console.log('encryptedKeyIv = ' + encryptedKeyIv)
                const passwordKey = await KeyStoreModule.generatePasswordKey(
                    password,
                    passwordSalt,
                    10000,
                    32
                )
                console.log('passwordKey = ' + passwordKey)
                const entryKey = await KeyStoreModule.decrypt(
                    encryptedKey,
                    passwordKey,
                    encryptedKeyIv
                )
                await console.log('entry key = ' + entryKey)
                // store encryption key in key store
                await KeyStoreModule.setKey(
                    'entryKey',
                    'journalPassword',
                    entryKey
                )
                // store encryption key in key store
                await KeyStoreModule.setKey(
                    'refreshToken',
                    'journalPassword',
                    refreshToken.token
                )
                // navigate to entries page
                await signin(refreshToken.token)
            } else {
                console.log("we don't have a key")
                console.log('we need to generate an aes key')
                console.log('we need to generate a key with the password')
                console.log('we encrypt the aes key with the password key')
                console.log('we update user info with the updated key')
                const entryKey = await KeyStoreModule.generateKey()
                const passwordSalt = await KeyStoreModule.generateKey()
                const encryptedKeyIv = await KeyStoreModule.generateIv()
                console.log('entry Key  = ' + entryKey)
                console.log('passwordSalt = ' + passwordSalt)
                console.log('encryptedKeyIv = ' + encryptedKeyIv)
                const passwordKey = await KeyStoreModule.generatePasswordKey(
                    password,
                    passwordSalt,
                    10000,
                    32
                )
                console.log('password = ' + password)
                console.log('passwordKey = ' + passwordKey)
                const encryptedKey = await KeyStoreModule.encrypt(
                    entryKey,
                    passwordKey,
                    encryptedKeyIv
                )
                console.log('encryptedKey = ' + encryptedKey)
                // alright we now have a key
                // send encrypted key to the database
                const updateJson = await fetch(
                    `${Config.AUTH_API}/user/update`,
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            token: accessToken.token,
                            encryptedKey: encryptedKey,
                            encryptedKeyIv: encryptedKeyIv,
                            passwordSalt: passwordSalt,
                        }),
                    }
                )
                // store encryption key in key store
                await KeyStoreModule.setKey(
                    'entryKey',
                    'journalPassword',
                    entryKey
                )
                // store encryption key in key store
                await KeyStoreModule.setKey(
                    'refreshToken',
                    'journalPassword',
                    refreshToken.token
                )
                // navigate to entries page
                await signin(refreshToken.token)
            }
        } catch (error) {
            console.log('error')
            console.log(error)
        }
    }
    const signup = async () => {
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
        navigation.navigate('Signup', { name: 'Jane' })
    }
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
                            <Text style={styles.headerText}>JOURNAL</Text>
                        </View>
                        <View style={styles.inputForm}>
                            <Text style={styles.label}>Username:</Text>
                            <TextInput
                                style={styles.input}
                                value={username}
                                onChangeText={(text) => setUsername(text)}
                                defaultValue="you can type in me"
                            />
                        </View>
                        <View style={styles.inputForm}>
                            <Text style={styles.label}>Password:</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                secureTextEntry={true}
                                onChangeText={(text) => setPassword(text)}
                                defaultValue="you can type in me"
                            />
                        </View>
                        <View style={styles.inputForm}>
                            <TouchableOpacity
                                onPress={login}
                                style={styles.btn}
                            >
                                <Text style={styles.btnText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputForm}>
                            <TouchableOpacity
                                onPress={signup}
                                style={styles.btn}
                            >
                                <Text style={styles.btnText}>Sign up</Text>
                            </TouchableOpacity>
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
        resizeMode: 'cover',
        position: 'absolute',
        justifyContent: 'center',
        height: d.height,
        width: d.width,
    },
    scrollView: {
        backgroundColor: 'rgba(240,240,190,0.4)',
        flex: 1,
    },
    header: {
        height: 260,
        alignSelf: 'stretch',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 44,
        color: 'white',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
    },
    inputForm: {
        paddingTop: 5,
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

export default Login
