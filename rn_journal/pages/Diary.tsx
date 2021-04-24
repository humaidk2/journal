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
import Loading from './Loading'

const Diary = ({ navigation, refreshToken, logout }: any) => {
    const [entries, setEntries] = useState({
        entries: [],
        isLoading: true,
    })
    useEffect(() => {
        // load access token from  /refresh
        // if it fails call logout
        // if it succeeds get access token
        // load user data from /entry
        // get key from keystore
        // decrypt and display all routes
        ;(async () => {
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
            const entriesString = await fetch(`${Config.DIARY_API}/entry`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    authorization: 'BEARER ' + accessToken.token,
                },
            })
            if (entriesString.status !== 200) logout()
            const entries = await entriesString.json()
            const entryKey = await KeyStoreModule.getKey(
                'entryKey',
                'journalPassword'
            )
            let arr: any = []
            for (let i = 0; i < entries.length; i++) {
                //decrypt
                const currEntry = await KeyStoreModule.decrypt(
                    entries[i].data,
                    entryKey,
                    entries[i].salt
                )
                // store in arr
                arr.push({ data: currEntry })
                arr[i].Id = entries[i].Id
                arr[i].createdAt = entries[i].createdAt
            }
            await setEntries({ entries: arr, isLoading: false })
        })()
    }, [])
    const getKey = async () => {
        console.log('getting key...')
        const entryKey = await KeyStoreModule.getKey(
            'entryKey',
            'journalPassword'
        )
        console.log(entryKey)
    }
    const logoutRequest = async () => {
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
        const accessToken = await accessJson.json()
        const logoutRes = await fetch(`${Config.AUTH_API}/user/logout`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: accessToken.token,
            }),
        })
        logout()
    }
    const addEntry = () => {
        navigation.navigate('EntryForm')
    }
    return (
        <>
            {/* <StatusBar barStyle="dark-content" /> */}
            {entries.isLoading ? (
                <Loading />
            ) : (
                <SafeAreaView style={styles.scrollView}>
                    <ImageBackground
                        source={require('./Login.jpg')}
                        style={styles.bg}
                    >
                        <View>
                            <FlatList
                                data={entries.entries}
                                renderItem={renderItem}
                                keyExtractor={(entry: any) => entry.Id}
                            />
                            <Button onPress={addEntry} title="Add new Entry" />
                            <Button onPress={logoutRequest} title="Logout" />
                        </View>
                        {/* <Button onPress={logoutRequest} title="logout" /> */}
                    </ImageBackground>
                </SafeAreaView>
            )}
        </>
    )
}
const renderItem = (data: any) => {
    return <Text style={styles.whiteText}>{data.item.data}</Text>
}
const d = Dimensions.get('window')
const styles = StyleSheet.create({
    whiteText: {
        color: 'white',
        fontSize: 30,
    },
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

export default Diary
