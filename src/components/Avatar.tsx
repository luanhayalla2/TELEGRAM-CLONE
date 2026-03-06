import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Theme from '../constants/Theme';

interface AvatarProps {
    imageUrl?: string;
    name: string;
    size?: number;
}

export default function Avatar({ imageUrl, name, size = 50 }: AvatarProps) {
    const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={[styles.image, { borderRadius: size / 2 }]} />
            ) : (
                <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{getInitials(name)}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    initials: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});
