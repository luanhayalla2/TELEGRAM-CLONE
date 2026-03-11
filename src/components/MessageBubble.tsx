import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import Theme from '../constants/Theme';

type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

interface MessageBubbleProps {
    message: string;
    isMe: boolean;
    time: string;
    status?: MessageStatus;
}

function StatusIcon({ status }: { status: MessageStatus }) {
    if (status === 'sending') {
        return <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.65)" />;
    }
    if (status === 'sent') {
        return <Ionicons name="checkmark" size={14} color="rgba(255,255,255,0.65)" />;
    }
    if (status === 'delivered') {
        return <Ionicons name="checkmark-done" size={14} color="rgba(255,255,255,0.65)" />;
    }
    if (status === 'read') {
        return <Ionicons name="checkmark-done" size={14} color="#60A5FA" />;
    }
    return null;
}

export default function MessageBubble({ message, isMe, time, status = 'delivered' }: MessageBubbleProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(isMe ? 20 : -20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: Platform.OS !== 'web',
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                isMe ? styles.meContainer : styles.otherContainer,
                { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }
            ]}
        >
            <View style={[styles.bubble, isMe ? styles.meBubble : styles.otherBubble]}>
                <Text style={[styles.messageText, !isMe && styles.otherMessageText]}>
                    {message}
                </Text>
                <View style={styles.meta}>
                    <Text style={[styles.timeText, isMe ? styles.meTime : styles.otherTime]}>
                        {time}
                    </Text>
                    {isMe && <StatusIcon status={status} />}
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 2,
        paddingHorizontal: 12,
        flexDirection: 'row',
        width: '100%',
    },
    meContainer: {
        justifyContent: 'flex-end',
    },
    otherContainer: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '78%',
        minWidth: 80,
        paddingHorizontal: 14,
        paddingTop: 8,
        paddingBottom: 6,
        borderRadius: 18,
    },
    meBubble: {
        backgroundColor: Theme.colors.primary,
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: Theme.colors.card,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        color: '#FFFFFF',
        fontSize: 15,
        lineHeight: 21,
    },
    otherMessageText: {
        color: Theme.colors.text,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 2,
        gap: 3,
    },
    timeText: {
        fontSize: 11,
    },
    meTime: {
        color: 'rgba(255,255,255,0.65)',
    },
    otherTime: {
        color: Theme.colors.placeholder,
    },
    statusIcon: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.65)',
    },
    statusRead: {
        color: '#60A5FA',
    },
});
