import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FeaturesList from '../components/FeaturesList';
import Theme from '../constants/Theme';

export default function WelcomeScreen() {

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
                            <Image
                                source={require('../../assets/images/logoOfic.png')}
                                style={{ width: 70, height: 70, resizeMode: 'contain' }}
                            />
                        </LinearGradient>
                        <Text style={styles.logoText}>NEXORA</Text>
                        <Text style={styles.subtitle}>Bem-vindo ao futuro do chat</Text>
                    </View>

                    <FeaturesList />

                    <View style={styles.buttonContainer}>
                        <Link href="/login" asChild>
                            <TouchableOpacity style={StyleSheet.flatten([styles.loginButton, shadowStyle])}>
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
                            <TouchableOpacity style={StyleSheet.flatten([styles.registerButton, accentShadowStyle])}>
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
