import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Switch,
} from 'react-native';
import Avatar from '../components/Avatar';
import Theme from '../constants/Theme';

type ProfileRouteParams = {
    Profile: {
        user: {
            id: string;
            name: string;
            avatarUrl?: string;
            username?: string;
            phone?: string;
            bio?: string;
            email?: string;
        };
    };
};

export default function ProfileScreen() {
    const route = useRoute<RouteProp<ProfileRouteParams, 'Profile'>>();
    const navigation = useNavigation<any>();
    const { user } = route.params;

    const isMe = user.id === 'me';
    
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || 'Sem biografia definida.');
    const [phone, setPhone] = useState(user.phone || '+55 00 00000-0000');
    
    // Settings toggles
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);

    const handleSave = () => {
        setEditing(false);
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    };

    const handleLogout = () => {
        Alert.alert('Sair', 'Deseja realmente sair da conta?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', style: 'destructive', onPress: () => navigation.replace('Login') }
        ]);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Cover and Avatar Header */}
            <View style={styles.headerContainer}>
                <LinearGradient
                    colors={Theme.gradients.brand}
                    style={styles.cover}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                <View style={styles.avatarWrapper}>
                    <Avatar name={name} imageUrl={user.avatarUrl} size={120} />
                    {isMe && (
                        <TouchableOpacity style={styles.camBtn} onPress={() => Alert.alert('Avatar', 'Trocar foto em breve!')}>
                            <Text style={styles.camIcon}>📷</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Profile Info Section */}
            <View style={styles.profileSection}>
                {editing ? (
                    <View style={styles.editForm}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nome</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Seu nome"
                                placeholderTextColor={Theme.colors.placeholder}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Bio</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                placeholder="Conte um pouco sobre você"
                                placeholderTextColor={Theme.colors.placeholder}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Telefone</Text>
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                placeholder="Seu telefone"
                                placeholderTextColor={Theme.colors.placeholder}
                            />
                        </View>
                        <View style={styles.editActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                <Text style={styles.saveText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.infoCenter}>
                        <Text style={styles.nameText}>{name}</Text>
                        <Text style={styles.usernameText}>@{user.username || user.name.toLowerCase().replace(' ', '')}</Text>
                        <Text style={styles.bioText}>{bio}</Text>
                        
                        {isMe && (
                            <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
                                <Text style={styles.editBtnText}>Editar Perfil</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statVal}>1.2k</Text>
                    <Text style={styles.statLabel}>Mensagens</Text>
                </View>
                <View style={[styles.statItem, styles.statBorder]}>
                    <Text style={styles.statVal}>4h</Text>
                    <Text style={styles.statLabel}>Hoje</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statVal}>12</Text>
                    <Text style={styles.statLabel}>Comunidades</Text>
                </View>
            </View>

            {/* Account Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>CONTA</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📧</Text>
                    <View>
                        <Text style={styles.detailLabel}>E-mail</Text>
                        <Text style={styles.detailVal}>{user.email || 'usuario@nexora.com'}</Text>
                    </View>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📱</Text>
                    <View>
                        <Text style={styles.detailLabel}>Telefone</Text>
                        <Text style={styles.detailVal}>{phone}</Text>
                    </View>
                </View>
            </View>

            {/* Quick Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>CONFIGURAÇÕES RÁPIDAS</Text>
                <View style={styles.settingRow}>
                    <View style={styles.settingLabelGroup}>
                        <Text style={styles.detailIcon}>🌙</Text>
                        <Text style={styles.settingLabel}>Tema Escuro</Text>
                    </View>
                    <Switch
                        value={isDarkMode}
                        onValueChange={setIsDarkMode}
                        trackColor={{ false: '#767577', true: Theme.colors.primary }}
                    />
                </View>
                <View style={styles.settingRow}>
                    <View style={styles.settingLabelGroup}>
                        <Text style={styles.detailIcon}>🔔</Text>
                        <Text style={styles.settingLabel}>Notificações</Text>
                    </View>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: '#767577', true: Theme.colors.primary }}
                    />
                </View>
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Sair da Conta</Text>
            </TouchableOpacity>
            
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    headerContainer: {
        height: 200,
        position: 'relative',
        alignItems: 'center',
    },
    cover: {
        width: '100%',
        height: 140,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    avatarWrapper: {
        position: 'absolute',
        bottom: 0,
        padding: 4,
        backgroundColor: Theme.colors.background,
        borderRadius: 70,
    },
    camBtn: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: Theme.colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Theme.colors.background,
    },
    camIcon: {
        fontSize: 16,
    },
    profileSection: {
        paddingHorizontal: 24,
        marginTop: 16,
    },
    infoCenter: {
        alignItems: 'center',
    },
    nameText: {
        color: Theme.colors.text,
        fontSize: 24,
        fontWeight: 'bold',
    },
    usernameText: {
        color: Theme.colors.secondary,
        fontSize: 16,
        marginTop: 4,
    },
    bioText: {
        color: Theme.colors.placeholder,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 20,
    },
    editBtn: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: Theme.colors.inputBackground,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    editBtnText: {
        color: Theme.colors.primary,
        fontWeight: 'bold',
    },
    // Edit Form
    editForm: {
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        color: Theme.colors.placeholder,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    input: {
        backgroundColor: Theme.colors.inputBackground,
        color: Theme.colors.text,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    editActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    cancelBtn: {
        flex: 1,
        padding: 14,
        alignItems: 'center',
    },
    cancelText: {
        color: Theme.colors.placeholder,
        fontWeight: 'bold',
    },
    saveBtn: {
        flex: 2,
        backgroundColor: Theme.colors.primary,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    // Stats
    statsRow: {
        flexDirection: 'row',
        marginTop: 32,
        marginHorizontal: 24,
        backgroundColor: Theme.colors.card,
        borderRadius: 20,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statBorder: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: 'rgba(255,255,255,0.1)',
        borderRightColor: 'rgba(255,255,255,0.1)',
    },
    statVal: {
        color: Theme.colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    statLabel: {
        color: Theme.colors.placeholder,
        fontSize: 12,
        marginTop: 4,
    },
    // Section
    section: {
        paddingHorizontal: 24,
        marginTop: 32,
    },
    sectionTitle: {
        color: Theme.colors.placeholder,
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    detailIcon: {
        fontSize: 22,
        width: 44,
        height: 44,
        textAlign: 'center',
        lineHeight: 44,
        backgroundColor: Theme.colors.inputBackground,
        borderRadius: 22,
    },
    detailLabel: {
        color: Theme.colors.placeholder,
        fontSize: 12,
    },
    detailVal: {
        color: Theme.colors.text,
        fontSize: 16,
        fontWeight: '500',
    },
    // Setting Row
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    settingLabelGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    settingLabel: {
        color: Theme.colors.text,
        fontSize: 16,
    },
    logoutBtn: {
        marginHorizontal: 24,
        marginTop: 40,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    logoutText: {
        color: Theme.colors.error,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
