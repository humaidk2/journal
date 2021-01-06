/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useRef } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    Dimensions,
    View,
    Animated,
    Text,
} from 'react-native'

declare const global: { HermesInternal: null | {} }

const Loading = () => {
    const spinValue = useRef(new Animated.Value(0)).current // Initial value for opacity: 0

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            })
        ).start()
    }, [spinValue])
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    })
    return (
        <>
            {/* <StatusBar barStyle="dark-content" /> */}
            <SafeAreaView style={styles.scrollView}>
                <ImageBackground
                    source={require('./Login.jpg')}
                    style={styles.bg}
                >
                    <View style={styles.loaderView}>
                        <Animated.View // Special animatable View
                            style={{
                                ...styles.loader,
                                transform: [{ rotate: spin }], // Bind opacity to animated value
                            }}
                        ></Animated.View>
                        <Text style={styles.loaderText}>Loading...</Text>
                    </View>
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
    loaderView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        height: 100,
        width: 100,
        backgroundColor: 'rgba(235, 200, 200, 1)',
        textAlign: 'center',
    },
    loaderText: {
        fontSize: 30,
        color: 'white',
    },
})

export default Loading
