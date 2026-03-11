import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Switch,
} from 'react-native';
import Theme from '../constants/Theme';

const COLORS = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', 
    '#F59E0B', '#EF4444', '#06B6D4', '#6366F1'
];

interface CreateCommunityModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string, color: string, isPrivate: boolean) => void;
}

export default function CreateCommunityModal({ visible, onClose, onCreate }: CreateCommunityModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [isPrivate, setIsPrivate] = useState(false);

    const handleCreate = () => {
        if (!name.trim()) return;
        onCreate(name, description, selectedColor, isPrivate);
        handleClose();
    };

    const handleClose = () => {
        onClose();
        setName('');
        setDescription('');
        setSelectedColor(COLORS[0]);
        setIsPrivate(false);
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Nova Comunidade</Text>

                    {/* Preview Avatar */}
                    <View style={styles.previewContainer}>
                        <View style={[styles.avatarPreview, { backgroundColor: selectedColor }]}>
                            <Text style={styles.avatarInitial}>{name ? name[0].toUpperCase() : '?'}</Text>
                        </View>
                        <Text style={styles.previewLabel}>Pré-visualização do Ícone</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Nome (até 50 caracteres)</Text>
                            <Text style={styles.charCount}>{name.length}/50</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Ex: Desenvolvedores React"
                            placeholderTextColor={Theme.colors.placeholder}
                            maxLength={50}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Descrição (até 150 caracteres)</Text>
                            <Text style={styles.charCount}>{description.length}/150</Text>
                        </View>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Sobre o que é esta comunidade?"
                            placeholderTextColor={Theme.colors.placeholder}
                            multiline
                            maxLength={150}
                        />
                    </View>

                    {/* Color Selection */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Cor do Ícone</Text>
                        <View style={styles.colorPalette}>
                            {COLORS.map(color => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.selectedColor
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Private Toggle */}
                    <View style={styles.toggleRow}>
                        <View style={styles.toggleText}>
                            <Text style={styles.toggleLabel}>Comunidade Privada</Text>
                            <Text style={styles.toggleSub}>Apenas convidados podem entrar</Text>
                        </View>
                        <Switch
                            value={isPrivate}
                            onValueChange={setIsPrivate}
                            trackColor={{ false: '#767577', true: Theme.colors.primary }}
                        />
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.createButton, !name.trim() && styles.createButtonDisabled]}
                            onPress={handleCreate}
                            disabled={!name.trim()}
                        >
                            <Text style={styles.createText}>Criar Comunidade</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 450,
        backgroundColor: Theme.colors.card,
        borderRadius: 24,
        padding: 24,
        ...Platform.select({
            web: { boxShadow: '0px 10px 20px rgba(0,0,0,0.3)' },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 10,
            }
        }),
    },
    title: {
        color: Theme.colors.text,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    previewContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarPreview: {
        width: 80,
        height: 80,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        ...Platform.select({
            web: { boxShadow: '0px 4px 5px rgba(0,0,0,0.2)' },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 4,
            }
        }),
    },
    avatarInitial: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    previewLabel: {
        color: Theme.colors.placeholder,
        fontSize: 12,
    },
    inputGroup: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        color: Theme.colors.placeholder,
        fontSize: 13,
        fontWeight: 'bold',
    },
    charCount: {
        color: Theme.colors.placeholder,
        fontSize: 11,
    },
    input: {
        backgroundColor: Theme.colors.inputBackground,
        color: Theme.colors.text,
        borderRadius: 14,
        padding: 14,
        fontSize: 16,
    },
    textArea: {
        minHeight: 60,
        textAlignVertical: 'top',
    },
    colorPalette: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 8,
    },
    colorOption: {
        width: 32,
        height: 32,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: '#fff',
        transform: [{ scale: 1.1 }],
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        padding: 12,
        backgroundColor: Theme.colors.inputBackground,
        borderRadius: 14,
    },
    toggleText: {
        flex: 1,
    },
    toggleLabel: {
        color: Theme.colors.text,
        fontSize: 15,
        fontWeight: '600',
    },
    toggleSub: {
        color: Theme.colors.placeholder,
        fontSize: 12,
        marginTop: 2,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelButton: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    cancelText: {
        color: Theme.colors.placeholder,
        fontSize: 16,
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: Theme.colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 14,
    },
    createButtonDisabled: {
        opacity: 0.5,
    },
    createText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
