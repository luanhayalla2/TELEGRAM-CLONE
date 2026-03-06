import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Theme from '../constants/Theme';
import { register } from '../services/authService';

export default function RegisterScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const translateError = (error: any) => {
        const code = error.code;
        switch (code) {
            case 'auth/email-already-in-use':
                return 'Este e-mail já está em uso.';
            case 'auth/invalid-email':
                return 'E-mail inválido.';
            case 'auth/operation-not-allowed':
                return 'O login com E-mail e Senha não está habilitado no Console do Firebase.';
            case 'auth/weak-password':
                return 'A senha é muito fraca.';
            default:
                return error.message || 'Ocorreu um erro inesperado.';
        }
    };

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        try {
            setError('');
            const user = await register(email, password);
            console.log('Usuário registrado:', user);
            router.replace('/login');
        } catch (err: any) {
            setError(translateError(err));
            console.error('Erro no registro:', err);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Theme.colors.background, '#161B3D']}
                style={styles.background}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.innerContainer}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>NEXORA</Text>
                            <Text style={styles.title}>Criar sua Conta</Text>
                        </View>

                        {error ? <Text style={styles.error}>{error}</Text> : null}

                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="E-mail"
                                placeholderTextColor={Theme.colors.placeholder}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Senha"
                                placeholderTextColor={Theme.colors.placeholder}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirmar Senha"
                                placeholderTextColor={Theme.colors.placeholder}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>

                        <Pressable style={styles.button} onPress={handleRegister}>
                            <LinearGradient
                                colors={Theme.gradients.button}
                                style={styles.gradientButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.buttonText}>Registrar</Text>
                            </LinearGradient>
                        </Pressable>

                        <Link href="/login" asChild>
                            <Pressable style={StyleSheet.flatten(styles.linkButton)}>
                                <Text style={styles.linkText}>Já tem uma conta? <Text style={styles.linkTextBold}>Entre</Text></Text>
                            </Pressable>
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    innerContainer: {
        alignItems: 'center',
        padding: 30,
        maxWidth: 450,
        alignSelf: 'center',
        width: '100%',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoText: {
        fontSize: 32,
        fontWeight: '900',
        color: Theme.colors.primary,
        letterSpacing: 2,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Theme.colors.text,
    },
    error: {
        color: Theme.colors.error,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '600',
    },
    inputGroup: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: Theme.colors.inputBackground,
        color: Theme.colors.text,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    button: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            web: { boxShadow: `0px 4px 15px rgba(122, 60, 255, 0.4)` },
            default: {
                shadowColor: Theme.colors.accent,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 5,
            }
        })
    },
    gradientButton: {
        padding: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Theme.colors.text,
        fontWeight: '800',
        fontSize: 18,
        letterSpacing: 1,
    },
    linkButton: {
        marginTop: 30,
    },
    linkText: {
        color: Theme.colors.placeholder,
        fontSize: 15,
    },
    linkTextBold: {
        color: Theme.colors.secondary,
        fontWeight: 'bold',
    },
});
