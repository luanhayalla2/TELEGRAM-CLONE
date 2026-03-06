import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import Theme from '../constants/Theme';

// Define route params matching how we'll pass them in ChatScreens
type ProfileRouteParams = {
    Profile: {
        user: {
            id: string;
            name: string;
            avatarUrl?: string;
            username?: string;
            phone?: string;
        };
    };
};

export default function ProfileScreen() {
    const route = useRoute<RouteProp<ProfileRouteParams, 'Profile'>>();
    const navigation = useNavigation<any>();
    const { user } = route.params;

    const handleStartChat = () => {
        // Navigate back to Chat or open a specific conversation screen
        // For now, going back serves as "starting the chat" in this demo UI
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Avatar name={user.name} imageUrl={user.avatarUrl} size={100} />
                <Text style={styles.name}>{user.name}</Text>
                {user.username && <Text style={styles.infoText}>{user.username}</Text>}
                {user.phone && <Text style={styles.infoText}>{user.phone}</Text>}
                <Text style={styles.status}>Online</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleStartChat}>
                    <LinearGradient
                        colors={Theme.gradients.button}
                        style={styles.gradientButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.actionIcon}>💬</Text>
                        <Text style={styles.actionText}>Enviar Mensagem</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                    <View style={styles.gradientButton}>
                        <Text style={styles.actionIcon}>📞</Text>
                        <Text style={styles.actionTextSecondary}>Ligar</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    name: {
        color: Theme.colors.text,
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 4,
    },
    status: {
        color: Theme.colors.primary,
        fontSize: 14,
        marginTop: 8,
        fontWeight: 'bold',
    },
    infoText: {
        color: Theme.colors.secondary,
        fontSize: 16,
        marginTop: 4,
    },
    actions: {
        gap: 16,
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center',
    },
    actionButton: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Theme.colors.accent,
    },
    actionIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    actionText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    actionTextSecondary: {
        color: Theme.colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
