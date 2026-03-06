import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Theme from '../constants/Theme';

interface InputMessageProps {
    onSend: (text: string) => void;
}

export default function InputMessage({ onSend }: InputMessageProps) {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (text.trim()) {
            onSend(text.trim());
            setText('');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Digite uma mensagem..."
                placeholderTextColor={Theme.colors.placeholder}
                multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <View style={styles.sendIconWrapper} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: Theme.colors.card,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    input: {
        flex: 1,
        backgroundColor: Theme.colors.inputBackground,
        color: Theme.colors.text,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 100,
    },
    sendButton: {
        marginLeft: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendIconWrapper: {
        width: 20,
        height: 20,
        backgroundColor: '#fff',
        transform: [{ rotate: '45deg' }],
        borderRadius: 4,
    }
});
