import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../constants/Theme';

interface InputMessageProps {
    onSend: (text: string) => void;
}

const EMOJI_CATEGORIES: { label: string; icon: string; emojis: string[] }[] = [
    {
        label: 'Smileys', icon: '😊',
        emojis: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '🥰', '😘', '😗', '😙', '😚', '🙂', '🤔', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝'],
    },
    {
        label: 'Gestos', icon: '👋',
        emojis: ['👋', '🤚', '✋', '🖖', '👌', '🤌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🙏'],
    },
    {
        label: 'Corações', icon: '❤️',
        emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️'],
    },
    {
        label: 'Animais', icon: '🐶',
        emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺'],
    },
    {
        label: 'Comidas', icon: '🍕',
        emojis: ['🍎', '🍊', '🍋', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🌽', '🌶️', '🍕', '🍔', '🍟', '🌭', '🥪', '🌮', '🌯', '🍿', '🧀', '🍩', '🍪', '🎂', '🍰'],
    },
    {
        label: 'Objetos', icon: '📱',
        emojis: ['📱', '💻', '🖥️', '⌨️', '🖨️', '🖱️', '🖲️', '💾', '💿', '📷', '📸', '📹', '🎥', '📞', '☎️', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⌚', '🔋', '🔌', '💡', '🔦', '🕯️', '🗑️'],
    },
];

const ATTACHMENT_OPTIONS = [
    { icon: '📷', label: 'Imagem' },
    { icon: '🎬', label: 'Vídeo' },
    { icon: '📄', label: 'Documento' },
    { icon: '📍', label: 'Localização' },
];

export default function InputMessage({ onSend }: InputMessageProps) {
    const [text, setText] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const [showAttach, setShowAttach] = useState(false);
    const [emojiCategory, setEmojiCategory] = useState(0);

    const handleSend = () => {
        if (text.trim()) {
            onSend(text.trim());
            setText('');
            setShowEmoji(false);
        }
    };

    const handleEmoji = (emoji: string) => {
        setText(prev => prev + emoji);
    };

    const handleAttachment = (label: string) => {
        setShowAttach(false);
        Alert.alert('Anexo', `Funcionalidade "${label}" em breve!`);
    };

    const hasText = text.trim().length > 0;

    return (
        <View>
            {/* Emoji Picker */}
            {showEmoji && (
                <View style={styles.emojiPicker}>
                    {/* Category tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiCategories}>
                        {EMOJI_CATEGORIES.map((cat, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.catTab, emojiCategory === i && styles.catTabActive]}
                                onPress={() => setEmojiCategory(i)}
                            >
                                <Text style={styles.catIcon}>{cat.icon}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    {/* Emoji grid */}
                    <ScrollView style={styles.emojiGrid} showsVerticalScrollIndicator={false}>
                        <View style={styles.emojiRow}>
                            {EMOJI_CATEGORIES[emojiCategory].emojis.map((emoji, i) => (
                                <TouchableOpacity key={i} style={styles.emojiBtn} onPress={() => handleEmoji(emoji)}>
                                    <Text style={styles.emoji}>{emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            )}

            {/* Attachment dropdown */}
            {showAttach && (
                <View style={styles.attachDropdown}>
                    {ATTACHMENT_OPTIONS.map((opt, i) => (
                        <TouchableOpacity key={i} style={styles.attachOption} onPress={() => handleAttachment(opt.label)}>
                            <Text style={styles.attachIcon}>{opt.icon}</Text>
                            <Text style={styles.attachLabel}>{opt.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Input Row */}
            <View style={styles.container}>
                {/* Emoji toggle */}
                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => { setShowEmoji(prev => !prev); setShowAttach(false); }}
                >
                    <Ionicons name={showEmoji ? "keypad-outline" : "happy-outline"} size={26} color={Theme.colors.placeholder} />
                </TouchableOpacity>

                {/* Attachment */}
                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => { setShowAttach(prev => !prev); setShowEmoji(false); }}
                >
                    <Ionicons name="attach-outline" size={26} color={Theme.colors.placeholder} />
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Digite uma mensagem..."
                    placeholderTextColor={Theme.colors.placeholder}
                    multiline
                    onSubmitEditing={Platform.OS === 'web' ? handleSend : undefined}
                />

                {/* Mic / Send button */}
                <TouchableOpacity
                    style={[styles.sendButton, hasText && styles.sendButtonActive]}
                    onPress={hasText ? handleSend : () => Alert.alert('Áudio', 'Gravação de áudio em breve!')}
                >
                    <Ionicons name={hasText ? "send" : "mic-outline"} size={22} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 8,
        backgroundColor: Theme.colors.card,
        borderTopWidth: 1,
        borderTopColor: Theme.colors.border,
        gap: 6,
    },
    input: {
        flex: 1,
        backgroundColor: Theme.colors.inputBackground,
        color: Theme.colors.text,
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 100,
        fontSize: 15,
    },
    iconBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    iconBtnText: {
        fontSize: 22,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Theme.colors.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonActive: {
        backgroundColor: Theme.colors.primary,
    },
    sendIcon: {
        fontSize: 20,
        color: '#fff',
    },
    // Emoji picker
    emojiPicker: {
        backgroundColor: Theme.colors.card,
        borderTopWidth: 1,
        borderTopColor: Theme.colors.border,
        height: 240,
    },
    emojiCategories: {
        maxHeight: 48,
        paddingHorizontal: 8,
    },
    catTab: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
    },
    catTabActive: {
        backgroundColor: Theme.colors.inputBackground,
    },
    catIcon: {
        fontSize: 20,
    },
    emojiGrid: {
        flex: 1,
        paddingHorizontal: 8,
    },
    emojiRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    emojiBtn: {
        width: '12.5%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 24,
    },
    // Attachment
    attachDropdown: {
        flexDirection: 'row',
        backgroundColor: Theme.colors.card,
        borderTopWidth: 1,
        borderTopColor: Theme.colors.border,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 16,
    },
    attachOption: {
        alignItems: 'center',
        gap: 6,
    },
    attachIcon: {
        fontSize: 28,
        width: 52,
        height: 52,
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: Theme.colors.inputBackground,
        borderRadius: 26,
        lineHeight: 52,
    },
    attachLabel: {
        color: Theme.colors.text,
        fontSize: 12,
        textAlign: 'center',
    },
});
