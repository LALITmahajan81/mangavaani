import React from 'react';
import { StyleSheet, Image } from 'react-native';

const Logo = () => {
    return (
        <Image
            source={require('./assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
        />
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 200,
        height: 200,
    },
});

export default Logo;
