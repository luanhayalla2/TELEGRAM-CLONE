import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Theme from '../constants/Theme';

interface CreateCommunityModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string) => void;
}

export default function CreateCommunityModal({ visible, onClose, onCreate }: CreateCommunityModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = () => {
        onCreate(name, description);
        onClose();
        setName('');
        setDescription('');
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Nova Comunidade</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome da Comunidade</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Ex: Desenvolvedores React"
                            placeholderTextColor={Theme.colors.placeholder}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Descrição</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Sobre o que é esta comunidade?"
                            placeholderTextColor={Theme.colors.placeholder}
                            multiline
                        />
                    </View>

                    <View style={styles.actionSection}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionIcon}>➕</Text>
                            <Text style={styles.actionText}>Adicionar Amigos</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionIcon}>📢</Text>
                            <Text style={styles.actionText}>Adicionar Canais</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.createButton, !name.trim() && styles.createButtonDisabled]}
                            onPress={handleCreate}
                            disabled={!name.trim()}
                        >
                            <Text style={styles.createText}>Criar</Text>
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 450,
        backgroundColor: Theme.colors.card,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        color: Theme.colors.primary,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        color: Theme.colors.secondary,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: Theme.colors.inputBackground,
        color: Theme.colors.text,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    actionSection: {
        marginTop: 8,
        marginBottom: 24,
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.inputBackground,
        padding: 14,
        borderRadius: 12,
    },
    actionIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    actionText: {
        color: Theme.colors.text,
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 10,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    cancelText: {
        color: Theme.colors.placeholder,
        fontSize: 16,
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: Theme.colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
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
