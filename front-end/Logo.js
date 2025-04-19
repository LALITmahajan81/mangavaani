import React, { useEffect, useRef } from 'react';
import { StyleSheet, Image, Animated, View } from 'react-native';

const Logo = ({ onComplete }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.delay(500),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onComplete) onComplete();
        });
    }, []);

    return (
        <View style={styles.mainContainer}>
            <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
                <View style={styles.blackBackground} />
                <Image
                    source={require('./assets/images/testlogo.jpg')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    animatedContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blackBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
    },
    logo: {
        width: 200,
        height: 200,
    },
});

export default Logo;
