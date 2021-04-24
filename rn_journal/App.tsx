/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
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
} from 'react-native'

import Signup from './pages/Signup'
import Login from './pages/Login'
import Diary from './pages/Diary'
import EntryForm from './pages/EntryForm'
import Loading from './pages/Loading'
import Config from 'react-native-config'

const { KeyStoreModule } = NativeModules
const Stack = createStackNavigator()
const App = () => {
    const [refresh, setRefresh] = useState({
        token: '',
        isLoading: true,
    })
    useEffect(() => {
        let isMounted = true
        ;(async () => {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            ])
            try {
                const refreshToken = await KeyStoreModule.getKey(
                    'refreshToken',
                    'journalPassword'
                )
                if (refreshToken === '') {
                    if (isMounted) {
                        return {
                            token: '',
                            isLoading: false,
                        }
                    }
                }
                const userJson = await fetch(
                    `${Config.AUTH_API}/refreshToken`,
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            token: refreshToken,
                        }),
                    }
                )
                if (userJson.status !== 200) {
                    return {
                        token: '',
                        isLoading: false,
                    }
                } else {
                    return {
                        token: refreshToken,
                        isLoading: false,
                    }
                }
            } catch (error) {
                // if (isMounted)
                //     setRefresh({
                //         token: '',
                //         isLoading: false,
                //     })
            }
        })().then((data: any) => {
            if (isMounted) setRefresh(data)
            return null
        })
        return () => {
            isMounted = false
        }
    }, [])
    const signin = (token: string) => {
        setRefresh({
            token: token,
            isLoading: false,
        })
    }
    const logout = () => setRefresh({ token: '', isLoading: false })
    return (
        <NavigationContainer>
            {refresh.isLoading ? (
                <Loading />
            ) : refresh.token === '' ? (
                <Stack.Navigator>
                    <Stack.Screen
                        name="Login"
                        options={{ title: 'Login', headerShown: false }}
                    >
                        {(props) => <Login signin={signin} {...props} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name="Signup"
                        component={Signup}
                        options={{ title: 'Signup', headerShown: false }}
                    />
                </Stack.Navigator>
            ) : (
                <Stack.Navigator>
                    <Stack.Screen
                        name="Diary"
                        options={{ title: 'Diary', headerShown: false }}
                    >
                        {(props) => (
                            <Diary
                                refreshToken={refresh.token}
                                logout={logout}
                                {...props}
                            />
                        )}
                    </Stack.Screen>
                    <Stack.Screen
                        name="EntryForm"
                        options={{ title: 'EntryForm', headerShown: false }}
                    >
                        {(props) => (
                            <EntryForm
                                refreshToken={refresh.token}
                                logout={logout}
                                {...props}
                            />
                        )}
                    </Stack.Screen>
                </Stack.Navigator>
            )}
        </NavigationContainer>
    )
}

export default App
