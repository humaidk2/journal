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
    TextInput,
    NativeModules,
    PermissionsAndroid,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    FlatList,
} from 'react-native'
import Config from 'react-native-config'

const { KeyStoreModule } = NativeModules

const EntryForm = ({ navigation, refreshToken, logout }: any) => {
    const [data, setData] = useState('')
    const saveEntry = async () => {
        const accessJson = await fetch(`${Config.AUTH_API}/user/refresh`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: refreshToken,
            }),
        })
        if (accessJson.status !== 200) logout()
        const accessToken = await accessJson.json()
        const entryKey = await KeyStoreModule.getKey(
            'entryKey',
            'journalPassword'
        )
        const entryIv = await KeyStoreModule.generateIv()
        const message = await KeyStoreModule.encrypt(data, entryKey, entryIv)
        console.log('entryIv = ' + entryIv)
        console.log('message = ' + message)
        const outputJson = await fetch(`${Config.DIARY_API}/entry`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                authorization: 'BEARER ' + accessToken.token,
            },
            body: JSON.stringify({
                data: message,
                salt: entryIv,
            }),
        })
        const output = await outputJson.json()
        console.log(output)
        console.log('post complete ' + outputJson.status)
        await navigation.navigate('Diary')
        //navigate back to the Diary page
    }

    return (
        <>
            <SafeAreaView style={styles.scrollView}>
                <Button onPress={saveEntry} title="SAVE" />
                <TextInput
                    style={styles.input}
                    value={data}
                    onChangeText={(text) => setData(text)}
                />
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
    input: {
        height: 300,
        alignSelf: 'stretch',
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
})

export default EntryForm
