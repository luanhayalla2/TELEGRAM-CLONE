import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MessageBubleProps {
    message: string;
    isUser: boolean;
}

export default function MessageBuble({ message, isUser }: MessageBubleProps) {
    return (
        <View
            style={[
                styles.bubble,
                isUser ? styles.ownBubble : styles.otherBubble
            ]}>
            <Text style={styles.messageText}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    bubble: {
        padding: 12,
        borderRadius: 18,
        marginVertical: 4,
        maxWidth: '80%',
    },
    messageText: {
        color: '#fff',
        fontSize: 16,
    },
    ownBubble: {
        backgroundColor: '#007AFF',
        alignSelf: 'flex-end',
    },
    otherBubble: {
        backgroundColor: '#E5E5EA',
        alignSelf: 'flex-start',
    },
});



