import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';
import Theme from '../constants/Theme';

interface CallRecord {
    id: string;
    userName: string;
    type: 'incoming' | 'outgoing' | 'missed';
    media: 'voice' | 'video';
    time: string;
    duration?: string;
}

const SAMPLE_CALLS: CallRecord[] = [
    { id: 'ca1', userName: 'Alice Silva', type: 'incoming', media: 'voice', time: '10:30', duration: '5:24' },
    { id: 'ca2', userName: 'Bruno Costa', type: 'missed', media: 'video', time: '09:12' },
    { id: 'ca3', userName: 'Carla Mendes', type: 'outgoing', media: 'voice', time: 'Segunda', duration: '12:05' },
    { id: 'ca4', userName: 'Alice Silva', type: 'outgoing', media: 'video', time: 'Segunda', duration: '2:40' },
    { id: 'ca5', userName: 'Bruno Costa', type: 'missed', media: 'voice', time: 'Domingo' },
];

export default function CallsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'missed'>('all');

    const filteredCalls = SAMPLE_CALLS
        .filter(c => c.userName.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(c => filter === 'all' || c.type === 'missed');

    const renderCallItem = ({ item }: { item: CallRecord }) => {
        const isMissed = item.type === 'missed';
        
        return (
            <TouchableOpacity style={styles.callItem}>
                <Avatar name={item.userName} size={50} />
                <View style={styles.callInfo}>
                    <Text style={[styles.userName, isMissed && styles.missedName]}>
                        {item.userName}
                    </Text>
                    <View style={styles.callDetails}>
                        <Ionicons 
                            name={item.type === 'incoming' ? 'call-outline' : item.type === 'outgoing' ? 'arrow-up-outline' : 'close-circle-outline'} 
                            size={12} 
                            color={isMissed ? Theme.colors.error : Theme.colors.placeholder} 
                        />
                        <Text style={styles.callDetailText}>
                            {item.time} {item.duration && ` • ${item.duration}`}
                        </Text>
                    </View>
                </View>
                <View style={styles.callActions}>
                    <TouchableOpacity 
                        style={styles.actionBtn} 
                        onPress={() => Alert.alert('Chamada', `Ligando para ${item.userName}...`)}
                    >
                        <Ionicons name="call" size={20} color={Theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.actionBtn} 
                        onPress={() => Alert.alert('Vídeo', `Iniciando vídeo com ${item.userName}...`)}
                    >
                        <Ionicons name="videocam" size={20} color={Theme.colors.primary} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Search Header */}
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={16} color={Theme.colors.placeholder} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar histórico..."
                        placeholderTextColor={Theme.colors.placeholder}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, filter === 'all' && styles.activeTab]}
                    onPress={() => setFilter('all')}
                >
                    <Text style={[styles.tabText, filter === 'all' && styles.activeTabText]}>Todas</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, filter === 'missed' && styles.activeTab]}
                    onPress={() => setFilter('missed')}
                >
                    <Text style={[styles.tabText, filter === 'missed' && styles.activeTabText]}>Perdidas</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredCalls}
                keyExtractor={item => item.id}
                renderItem={renderCallItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="call-outline" size={64} color={Theme.colors.placeholder} style={{ opacity: 0.3 }} />
                        <Text style={styles.emptyText}>Nenhuma ligação encontrada</Text>
                    </View>
                }
            />

            <TouchableOpacity style={styles.fab}>
                <Ionicons name="add" size={24} color="#fff" />
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
    searchIcon: {
        fontSize: 16,
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
        paddingVertical: 8,
    },
    callItem: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    callInfo: {
        flex: 1,
        marginLeft: 16,
    },
    userName: {
        color: Theme.colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    missedName: {
        color: Theme.colors.error,
    },
    callDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 6,
    },
    callTypeIcon: {
        fontSize: 12,
    },
    callDetailText: {
        color: Theme.colors.placeholder,
        fontSize: 14,
    },
    callActions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 20,
        color: Theme.colors.primary,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyText: {
        color: Theme.colors.placeholder,
        fontSize: 16,
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
            web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.25)' },
            default: {
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            }
        }),
    },
    fabIcon: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
