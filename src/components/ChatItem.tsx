import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Theme from '../constants/Theme';
import Avatar from './Avatar';

type ConversationType = 'private' | 'group' | 'channel';

interface ChatItemProps {
    name: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    avatarUrl?: string;
    isMe?: boolean;
    isPinned?: boolean;
    isMuted?: boolean;
    isOnline?: boolean;
    type?: ConversationType;
    memberCount?: number;
    onPress: () => void;
    onLongPress?: () => void;
}

function smartTimestamp(time: string): string {
    // In a real app, this would use date-fns or similar
    // For now, just return the time as-is
    return time;
}

export default function ChatItem({
    name,
    lastMessage,
    time,
    unreadCount = 0,
    avatarUrl,
    isMe = false,
    isPinned = false,
    isMuted = false,
    isOnline,
    type = 'private',
    memberCount,
    onPress,
    onLongPress,
}: ChatItemProps) {

    const typeLabel = type === 'group'
        ? `👥 ${memberCount ?? ''} membros`
        : type === 'channel'
            ? `📢 ${memberCount ?? ''} inscritos`
            : null;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} onLongPress={onLongPress}>
            <Avatar name={name} imageUrl={avatarUrl} size={52} isOnline={type === 'private' ? isOnline : undefined} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.nameRow}>
                        {isPinned && <Text style={styles.pinIcon}>📌</Text>}
                        <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    </View>
                    <Text style={[styles.time, unreadCount > 0 && !isMuted && styles.timeUnread]}>
                        {smartTimestamp(time)}
                    </Text>
                </View>

                {typeLabel && (
                    <Text style={styles.typeLabel}>{typeLabel}</Text>
                )}

                <View style={styles.footer}>
                    <Text
                        style={[styles.lastMessage, unreadCount > 0 && !isMuted && styles.lastMessageUnread]}
                        numberOfLines={1}
                    >
                        {isMe ? <Text style={styles.youPrefix}>Você: </Text> : null}{lastMessage}
                    </Text>

                    <View style={styles.badgeRow}>
                        {isMuted && <Text style={styles.muteIcon}>🔇</Text>}
                        {unreadCount > 0 && (
                            <View style={[styles.badge, isMuted && styles.badgeMuted]}>
                                <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
        alignItems: 'center',
    },
    content: {
        flex: 1,
        marginLeft: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
        gap: 4,
    },
    pinIcon: {
        fontSize: 12,
    },
    name: {
        color: Theme.colors.text,
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    },
    time: {
        color: Theme.colors.placeholder,
        fontSize: 12,
    },
    timeUnread: {
        color: Theme.colors.primary,
        fontWeight: '600',
    },
    typeLabel: {
        color: Theme.colors.placeholder,
        fontSize: 11,
        marginBottom: 2,
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
    lastMessageUnread: {
        color: Theme.colors.text,
        fontWeight: '500',
    },
    youPrefix: {
        color: Theme.colors.primary,
        fontWeight: '600',
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    muteIcon: {
        fontSize: 12,
        opacity: 0.6,
    },
    badge: {
        backgroundColor: Theme.colors.primary,
        borderRadius: 12,
        paddingHorizontal: 7,
        paddingVertical: 2,
        minWidth: 22,
        alignItems: 'center',
    },
    badgeMuted: {
        backgroundColor: Theme.colors.placeholder,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
});
