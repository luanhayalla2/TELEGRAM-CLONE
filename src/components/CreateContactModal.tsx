import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Theme from '../constants/Theme';

interface CreateContactModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (name: string, phone: string) => void;
}

export default function CreateContactModal({ visible, onClose, onCreate }: CreateContactModalProps) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleCreate = () => {
        onCreate(name, phone);
        onClose();
        setName('');
        setPhone('');
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Novo Contato</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Ex: João Silva"
                            placeholderTextColor={Theme.colors.placeholder}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Telefone / Usuário</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Ex: @joaosilva ou (11) 99999-9999"
                            placeholderTextColor={Theme.colors.placeholder}
                        />
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
                            <Text style={styles.createText}>Adicionar</Text>
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
