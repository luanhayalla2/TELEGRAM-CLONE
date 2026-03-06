import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Theme from '../constants/Theme';
import Avatar from './Avatar';

interface ChatItemProps {
    name: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    avatarUrl?: string;
    onPress: () => void;
}

export default function ChatItem({
    name,
    lastMessage,
    time,
    unreadCount = 0,
    avatarUrl,
    onPress,
}: ChatItemProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Avatar name={name} imageUrl={avatarUrl} size={50} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    <Text style={styles.time}>{time}</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.lastMessage} numberOfLines={1}>{lastMessage}</Text>
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    name: {
        color: Theme.colors.text,
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    time: {
        color: Theme.colors.placeholder,
        fontSize: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessage: {
        color: Theme.colors.placeholder,
        fontSize: 14,
        flex: 1,
        marginRight: 8,
    },
    badge: {
        backgroundColor: Theme.colors.primary,
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: 24,
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
