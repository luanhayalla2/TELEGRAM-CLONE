import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Theme from '../constants/Theme';
import { login } from '../services/authService';

const LoginScreen = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const translateError = (error: any) => {
        const code = error.code;
        switch (code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                return 'E-mail ou senha incorretos.';
            case 'auth/invalid-email':
                return 'E-mail inválido.';
            case 'auth/user-disabled':
                return 'Este usuário foi desativado.';
            default:
                return error.message || 'Ocorreu um erro ao fazer login.';
        }
    };

    const handleLogin = async () => {
        try {
            setError('');
            await login(email, password);
            router.replace('/Main');
        } catch (err: any) {
            setError(translateError(err));
            console.error('Erro no login:', err);
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
                <View style={styles.innerContainer}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>NEXORA</Text>
                        <Text style={styles.sloganText}>"Connect Beyond"</Text>
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
                    </View>

                    <Pressable style={styles.button} onPress={handleLogin}>
                        <LinearGradient
                            colors={Theme.gradients.button}
                            style={styles.gradientButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.buttonText}>Entrar</Text>
                        </LinearGradient>
                    </Pressable>

                    <Link href="/register" asChild>
                        <Pressable style={StyleSheet.flatten(styles.linkButton)}>
                            <Text style={styles.linkText}>Não tem uma conta? <Text style={styles.linkTextBold}>Registre-se</Text></Text>
                        </Pressable>
                    </Link>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

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
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        maxWidth: 450,
        alignSelf: 'center',
        width: '100%',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    logoText: {
        fontSize: 48,
        fontWeight: '900',
        color: Theme.colors.primary,
        letterSpacing: 4,
    },
    sloganText: {
        fontSize: 16,
        color: Theme.colors.secondary,
        marginTop: 5,
        letterSpacing: 2,
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
            web: { boxShadow: `0px 4px 15px rgba(47, 107, 255, 0.4)` },
            default: {
                shadowColor: Theme.colors.primary,
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

export default LoginScreen;
