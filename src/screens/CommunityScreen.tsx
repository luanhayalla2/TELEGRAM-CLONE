import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';
import Theme from '../constants/Theme';

interface Community {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    lastActivity: string;
    isPrivate: boolean;
    color: string;
    isOwner?: boolean;
}

const SAMPLE_COMMUNITIES: Community[] = [
    { id: 'com1', name: 'Desenvolvedores React', description: 'Grupo para troca de conhecimentos sobre React e React Native.', memberCount: 1250, lastActivity: '2min atrás', isPrivate: false, color: '#3B82F6', isOwner: true },
    { id: 'com2', name: 'UI/UX Designers Brasil', description: 'Comunidade focada em design de interfaces e experiência do usuário.', memberCount: 840, lastActivity: '1h atrás', isPrivate: false, color: '#EC4899' },
    { id: 'com3', name: 'Investimentos & Cripto', description: 'Discussões sobre mercado financeiro e criptoativos.', memberCount: 3200, lastActivity: '10min atrás', isPrivate: true, color: '#F59E0B' },
];

export default function CommunityScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'my' | 'discover'>('my');
    const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

    const handleAction = (type: string, community: Community) => {
        switch (type) {
            case 'invite':
                Alert.alert('Convidar', `Link de convite para "${community.name}" copiado!`);
                break;
            case 'message':
                Alert.alert('Mensagem', `Abrindo chat da comunidade "${community.name}"...`);
                break;
            case 'leave':
                Alert.alert('Sair', `Deseja realmente sair de "${community.name}"?`, [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Sair', style: 'destructive' }
                ]);
                break;
            case 'delete':
                Alert.alert('Excluir', `EXCLUIR a comunidade "${community.name}" permanentemente?`, [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Excluir', style: 'destructive' }
                ]);
                break;
        }
    };

    const filteredCommunities = SAMPLE_COMMUNITIES.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderCommunityItem = ({ item }: { item: Community }) => (
        <TouchableOpacity style={styles.communityCard} onPress={() => setSelectedCommunity(item)}>
            <View style={[styles.communityIcon, { backgroundColor: item.color }]}>
                <Text style={styles.communityInitial}>{item.name[0]}</Text>
                {item.isPrivate && (
                    <View style={styles.lockBadge}>
                        <Ionicons name="lock-closed" size={12} color="#fff" />
                    </View>
                )}
            </View>
            <View style={styles.communityInfo}>
                <View style={styles.communityHeader}>
                    <Text style={styles.communityName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.lastActivity}>{item.lastActivity}</Text>
                </View>
                <Text style={styles.communityDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.communityFooter}>
                    <Text style={styles.memberCount}>
                        <Ionicons name="people" size={14} color={Theme.colors.placeholder} /> {item.memberCount} membros
                    </Text>
                    {activeTab === 'discover' ? (
                        <TouchableOpacity style={styles.joinBtn} onPress={() => Alert.alert('Entrar', `Você solicitou entrar em ${item.name}`)}>
                            <Text style={styles.joinBtnText}>ENTRAR</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.privacyBadge}>
                            {item.isPrivate ? <Text style={styles.privacyText}>Privada</Text> : <Text style={styles.privacyText}>Pública</Text>}
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Search Header */}
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={18} color={Theme.colors.placeholder} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar comunidades..."
                        placeholderTextColor={Theme.colors.placeholder}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'my' && styles.activeTab]}
                    onPress={() => setActiveTab('my')}
                >
                    <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>Minhas</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
                    onPress={() => setActiveTab('discover')}
                >
                    <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>Descobrir</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredCommunities}
                keyExtractor={item => item.id}
                renderItem={renderCommunityItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="business" size={64} color={Theme.colors.placeholder} style={{ opacity: 0.3 }} />
                        <Text style={styles.emptyText}>Nenhuma comunidade encontrada</Text>
                    </View>
                }
            />

            {/* Details Modal */}
            <Modal visible={!!selectedCommunity} transparent animationType="fade">
                {selectedCommunity && (
                    <Pressable 
                        style={styles.modalOverlay} 
                        onPress={() => setSelectedCommunity(null)}
                    >
                        <Pressable 
                            style={styles.detailsCard} 
                            onPress={(e) => e.stopPropagation()}
                        >
                            <View style={[styles.detailsHeader, { backgroundColor: selectedCommunity.color }]}>
                                <Text style={styles.detailsInitial}>{selectedCommunity.name[0]}</Text>
                                {selectedCommunity.isPrivate && (
                                    <View style={styles.detailsLockIcon}>
                                        <Ionicons name="lock-closed" size={20} color="#fff" />
                                    </View>
                                )}
                            </View>
                            
                            <ScrollView contentContainerStyle={styles.detailsBody}>
                                <Text style={styles.detailsName}>{selectedCommunity.name}</Text>
                                <Text style={styles.detailsSub}>{selectedCommunity.memberCount} membros • {selectedCommunity.lastActivity}</Text>
                                <Text style={styles.detailsDesc}>{selectedCommunity.description}</Text>
 
                                <View style={styles.detailsActions}>
                                    <TouchableOpacity 
                                        style={styles.detailActionBtn} 
                                        onPress={() => handleAction('message', selectedCommunity)}
                                    >
                                        <Ionicons name="chatbubble-outline" size={24} color={Theme.colors.primary} />
                                        <Text style={styles.detailActionLabel}>Mensagem</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.detailActionBtn} 
                                        onPress={() => handleAction('invite', selectedCommunity)}
                                    >
                                        <Ionicons name="link-outline" size={24} color={Theme.colors.primary} />
                                        <Text style={styles.detailActionLabel}>Convidar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.detailActionBtn} 
                                        onPress={() => handleAction(selectedCommunity.isOwner ? 'delete' : 'leave', selectedCommunity)}
                                    >
                                        <Ionicons 
                                            name={selectedCommunity.isOwner ? "trash-outline" : "exit-outline"} 
                                            size={24} 
                                            color={Theme.colors.error} 
                                        />
                                        <Text style={[styles.detailActionLabel, { color: Theme.colors.error }]}>
                                            {selectedCommunity.isOwner ? 'Excluir' : 'Sair'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </Pressable>
                    </Pressable>
                )}
            </Modal>
 
            <TouchableOpacity style={styles.fab}>
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.inputBackground,
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    searchInput: {
        flex: 1,
        color: Theme.colors.text,
        paddingVertical: 10,
        marginLeft: 8,
        fontSize: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: Theme.colors.primary,
    },
    tabText: {
        color: Theme.colors.placeholder,
        fontSize: 16,
        fontWeight: '600',
    },
    activeTabText: {
        color: Theme.colors.primary,
    },
    listContent: {
        padding: 16,
    },
    communityCard: {
        flexDirection: 'row',
        backgroundColor: Theme.colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    communityIcon: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    communityInitial: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    lockBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: Theme.colors.card,
        padding: 4,
        borderRadius: 10,
    },
    communityInfo: {
        flex: 1,
        marginLeft: 16,
    },
    communityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    communityName: {
        color: Theme.colors.text,
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    lastActivity: {
        color: Theme.colors.placeholder,
        fontSize: 12,
    },
    communityDesc: {
        color: Theme.colors.placeholder,
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    communityFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    memberCount: {
        color: Theme.colors.placeholder,
        fontSize: 13,
    },
    joinBtn: {
        backgroundColor: Theme.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
    },
    joinBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    privacyBadge: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    privacyText: {
        color: Theme.colors.placeholder,
        fontSize: 11,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    detailsCard: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: Theme.colors.card,
        borderRadius: 30,
        overflow: 'hidden',
    },
    detailsHeader: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    detailsInitial: {
        color: '#fff',
        fontSize: 48,
        fontWeight: 'bold',
    },
    detailsLockIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsBody: {
        padding: 24,
        alignItems: 'center',
    },
    detailsName: {
        color: Theme.colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    detailsSub: {
        color: Theme.colors.placeholder,
        fontSize: 14,
        marginTop: 4,
        marginBottom: 16,
    },
    detailsDesc: {
        color: Theme.colors.text,
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 32,
    },
    detailsActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        paddingTop: 24,
    },
    detailActionBtn: {
        alignItems: 'center',
        gap: 8,
    },
    detailActionLabel: {
        color: Theme.colors.text,
        fontSize: 12,
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        color: Theme.colors.placeholder,
        fontSize: 16,
        marginTop: 16,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            web: { boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)' },
            default: {
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
        }),
    },
});
