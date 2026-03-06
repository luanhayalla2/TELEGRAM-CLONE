import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Theme from '../constants/Theme';

interface MessageBubbleProps {
    message: string;
    isMe: boolean;
    time: string;
}

export default function MessageBubble({ message, isMe, time }: MessageBubbleProps) {
    return (
        <View style={[styles.container, isMe ? styles.meContainer : styles.otherContainer]}>
            <View style={[styles.bubble, isMe ? styles.meBubble : styles.otherBubble]}>
                <Text style={styles.messageText}>{message}</Text>
                <Text style={[styles.timeText, isMe ? styles.meTime : styles.otherTime]}>{time}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
        paddingHorizontal: 16,
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
        maxWidth: '80%',
        minWidth: 80,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 20,
        borderRadius: 20,
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
        color: Theme.colors.text,
        fontSize: 16,
        lineHeight: 22,
    },
    timeText: {
        fontSize: 11,
        position: 'absolute',
        bottom: 4,
        right: 12,
    },
    meTime: {
        color: 'rgba(255,255,255,0.7)',
    },
    otherTime: {
        color: Theme.colors.placeholder,
    },
});
