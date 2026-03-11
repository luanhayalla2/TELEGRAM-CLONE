import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const AVATAR_COLORS = [
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
    '#6366F1', // indigo
];

function getColorForName(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

interface AvatarProps {
    imageUrl?: string;
    name: string;
    size?: number;
    isOnline?: boolean;
}

export default function Avatar({ imageUrl, name, size = 50, isOnline }: AvatarProps) {
    const bgColor = getColorForName(name);
    const fontSize = size * 0.38;

    return (
        <View style={{ width: size, height: size }}>
            <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }]}>
                {imageUrl ? (
                    <Image 
                        source={{ uri: imageUrl }} 
                        style={[styles.image, { borderRadius: size / 2 }]} 
                        resizeMode="cover"
                    />
                ) : (
                    <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
                )}
            </View>
            {isOnline !== undefined && (
                <View style={[
                    styles.onlineDot,
                    {
                        width: size * 0.28,
                        height: size * 0.28,
                        borderRadius: size * 0.14,
                        bottom: 0,
                        right: 0,
                        backgroundColor: isOnline ? '#22C55E' : '#6B7280',
                    }
                ]} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
        letterSpacing: 0.5,
    },
    onlineDot: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: '#1E293B',
    },
});
