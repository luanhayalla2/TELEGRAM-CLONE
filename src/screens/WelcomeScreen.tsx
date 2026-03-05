import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Theme from '../constants/Theme';

export default function WelcomeScreen() {
    const features = [
        {
            icon: '💬',
            title: 'Mensagens em tempo real',
            description: 'Envio rápido e instantâneo.',
        },
        {
            icon: '👥',
            title: 'Crie comunidades',
            description: 'Conecte pessoas e grupos.',
        },
        {
            icon: '🔐',
            title: 'Chat seguro',
            description: 'Conversas protegidas e privadas.',
        },
        {
            icon: '⚡',
            title: 'Conexão instantânea',
            description: 'Conecte-se com o mundo.',
        },
    ];

    const shadowStyle = Platform.select({
        web: { boxShadow: `0px 4px 10px rgba(47, 107, 255, 0.3)` },
        default: {
            shadowColor: Theme.colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
        },
    });

    const accentShadowStyle = Platform.select({
        web: { boxShadow: `0px 4px 10px rgba(122, 60, 255, 0.3)` },
        default: {
            shadowColor: Theme.colors.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
        },
    });

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Theme.colors.background, '#161B3D']}
                style={styles.background}
            />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.innerContainer}>
                    <View style={styles.logoContainer}>
                        <LinearGradient
                            colors={Theme.gradients.brand}
                            style={styles.logoIcon}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={{ fontSize: 40 }}>🚀</Text>
                        </LinearGradient>
                        <Text style={styles.logoText}>NEXORA</Text>
                        <Text style={styles.subtitle}>Bem-vindo ao futuro do chat</Text>
                    </View>

                    <View style={styles.features}>
                        {features.map((feature, index) => (
                            <View key={index} style={styles.card}>
                                <View style={styles.iconCircle}>
                                    <Text style={styles.icon}>{feature.icon}</Text>
                                </View>
                                <View style={styles.featureTextContainer}>
                                    <Text style={styles.title}>{feature.title}</Text>
                                    <Text style={styles.text}>{feature.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.buttonContainer}>
                        <Link href="/login" asChild>
                            <TouchableOpacity style={[styles.loginButton, shadowStyle]}>
                                <LinearGradient
                                    colors={Theme.gradients.button}
                                    style={styles.gradientButton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.buttonText}>Entrar</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Link>

                        <Link href="/register" asChild>
                            <TouchableOpacity style={[styles.registerButton, accentShadowStyle]}>
                                <Text style={styles.buttonText}>Criar Conta</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
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
        padding: 24,
        minHeight: '100%',
    },
    innerContainer: {
        alignItems: 'center',
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 48,
    },
    logoIcon: {
        width: 100,
        height: 100,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 48,
        fontWeight: '900',
        color: Theme.colors.primary,
        letterSpacing: 8,
    },
    subtitle: {
        fontSize: 18,
        color: Theme.colors.secondary,
        marginTop: 8,
        letterSpacing: 2,
        textAlign: 'center',
        fontWeight: '600',
    },
    features: {
        width: '100%',
        marginBottom: 48,
    },
    card: {
        backgroundColor: Theme.colors.card,
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(47, 107, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        fontSize: 24,
    },
    featureTextContainer: {
        flex: 1,
    },
    title: {
        color: Theme.colors.text,
        fontSize: 17,
        fontWeight: '700',
    },
    text: {
        color: Theme.colors.placeholder,
        fontSize: 14,
        marginTop: 2,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    loginButton: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradientButton: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerButton: {
        backgroundColor: 'transparent',
        paddingVertical: 18,
        width: '100%',
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Theme.colors.accent,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 18,
        letterSpacing: 1,
    },
});
