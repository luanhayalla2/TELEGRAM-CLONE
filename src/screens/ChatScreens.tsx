import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Animated,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import Avatar from '../components/Avatar';
import ChatItem from '../components/ChatItem';
import CreateCommunityModal from '../components/CreateCommunityModal';
import CreateContactModal from '../components/CreateContactModal';
import InputMessage from '../components/InputMessage';
import MessageBubble from '../components/MessageBubble';
import Theme from '../constants/Theme';

type ConversationType = 'private' | 'group' | 'channel';
type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

interface Message {
    id: string;
    text: string;
    isMe: boolean;
    time: string;
    status: MessageStatus;
}

interface Contact {
    id: string;
    name: string;
    username?: string;
    phone?: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    isOnline?: boolean;
    type: ConversationType;
    memberCount?: number;
    isPinned?: boolean;
    isMuted?: boolean;
    isMe?: boolean;
}

const SAMPLE_CONTACTS: Contact[] = [
    {
        id: 'c1', name: 'Alice Silva', username: '@alicesilva', phone: '+55 11 99999-1111',
        lastMessage: 'Tudo ótimo! E com você?', time: '10:32', unreadCount: 0,
        isOnline: true, type: 'private', isPinned: true, isMe: false,
    },
    {
        id: 'c2', name: 'Dev Team Base', username: '@devteambase', phone: '',
        lastMessage: 'Reunião às 14h, pessoal.', time: '09:15', unreadCount: 3,
        type: 'group', memberCount: 24, isMe: false,
    },
    {
        id: 'c3', name: 'NEXORA News', username: '@nexoranews', phone: '',
        lastMessage: 'Atualização v2.0 disponível!', time: 'Seg', unreadCount: 12,
        type: 'channel', memberCount: 1840, isMe: false,
    },
    {
        id: 'c4', name: 'Bruno Costa', username: '@brunocosta', phone: '+55 21 99888-2222',
        lastMessage: 'Você: Até amanhã então!', time: 'Seg', unreadCount: 0,
        isOnline: false, type: 'private', isMe: true,
    },
    {
        id: 'c5', name: 'Carla Mendes', username: '@carlamendes', phone: '+55 31 99777-3333',
        lastMessage: 'Oi! Me chama pra conversar 😊', time: 'Dom', unreadCount: 2,
        isOnline: true, type: 'private', isMuted: true, isMe: false,
    },
    {
        id: 'c6', name: 'TechTalks Brasil', username: '@techtalks', phone: '',
        lastMessage: 'React Native vs Flutter: qual usar?', time: '28/02', unreadCount: 0,
        type: 'channel', memberCount: 5200, isMe: false,
    },
];

const SAMPLE_MESSAGES: Record<string, Message[]> = {
    c1: [
        { id: 'm1', text: 'Oi Alice! Como você está?', isMe: true, time: '10:30', status: 'read' },
        { id: 'm2', text: 'Tudo ótimo! E com você? 😊', isMe: false, time: '10:31', status: 'read' },
        { id: 'm3', text: 'Muito bem! Vamos tomar um café hoje?', isMe: true, time: '10:32', status: 'read' },
    ],
    c2: [
        { id: 'm1', text: 'Pessoal, reunião hoje às 14h!', isMe: false, time: '09:00', status: 'read' },
        { id: 'm2', text: 'Ok! Estarei lá ✅', isMe: true, time: '09:10', status: 'delivered' },
        { id: 'm3', text: 'Reunião às 14h, pessoal.', isMe: false, time: '09:15', status: 'delivered' },
    ],
    default: [
        { id: 'm1', text: 'Início da conversa.', isMe: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'read' },
    ],
};

function smartTimestamp(raw: string): string {
    return raw; // Already formatted in sample data
}

// ─── Chat Options Menu ───────────────────────────────────────────────────────

interface ChatOptionsMenuProps {
    visible: boolean;
    onClose: () => void;
    isPinned: boolean;
    isMuted: boolean;
    onProfile: () => void;
    onSearch: () => void;
    onTogglePin: () => void;
    onToggleMute: () => void;
    onClear: () => void;
    onBlock: () => void;
}

function ChatOptionsMenu({
    visible, onClose, isPinned, isMuted,
    onProfile, onSearch, onTogglePin, onToggleMute, onClear, onBlock,
}: ChatOptionsMenuProps) {
    const options = [
        { icon: 'person-outline', label: 'Ver perfil', action: onProfile },
        { icon: 'search-outline', label: 'Buscar na conversa', action: onSearch },
        { icon: 'pin-outline', label: isPinned ? 'Desafixar conversa' : 'Fixar conversa', action: onTogglePin },
        { icon: isMuted ? 'notifications-outline' : 'notifications-off-outline', label: isMuted ? 'Ativar notificações' : 'Silenciar', action: onToggleMute },
        { icon: 'trash-outline', label: 'Limpar conversa', action: onClear, danger: true },
        { icon: 'ban-outline', label: 'Bloquear contato', action: onBlock, danger: true },
    ];

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={menuStyles.overlay} onPress={onClose}>
                <View style={menuStyles.menu}>
                    {options.map((opt, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[menuStyles.option, i < options.length - 1 && menuStyles.optionBorder]}
                            onPress={() => { opt.action(); onClose(); }}
                        >
                            <Ionicons name={opt.icon as any} size={20} color={opt.danger ? Theme.colors.error : Theme.colors.text} />
                            <Text style={[menuStyles.optionLabel, (opt as any).danger && menuStyles.optionDanger]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Pressable>
        </Modal>
    );
}

const menuStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 54,
        paddingRight: 12,
    },
    menu: {
        backgroundColor: Theme.colors.card,
        borderRadius: 14,
        minWidth: 220,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
        overflow: 'hidden',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 18,
        gap: 12,
    },
    optionBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    optionIcon: { fontSize: 18 },
    optionLabel: { color: Theme.colors.text, fontSize: 15 },
    optionDanger: { color: Theme.colors.error },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function ChatScreens() {
    const navigation = useNavigation<any>();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const [contacts, setContacts] = useState<Contact[]>(SAMPLE_CONTACTS);
    const [activeChat, setActiveChat] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isCreateContactModalVisible, setIsCreateContactModalVisible] = useState(false);
    const [isCreateCommunityModalVisible, setIsCreateCommunityModalVisible] = useState(false);

    const handleNavigation = (screen: string) => {
        // Since ChatScreens is already inside the TabNavigator, 
        // we can navigate directly to other tabs by name.
        navigation.navigate(screen as any);
    };

    const listRef = useRef<FlatList>(null);

    // ── Filtering & Sorting ──────────────────────────────────────────────────
    const filteredContacts = contacts
        .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return 0;
        });

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleSelectChat = (item: Contact) => {
        setActiveChat(item);
        setMessages(SAMPLE_MESSAGES[item.id] ?? SAMPLE_MESSAGES.default);
        // Mark as read
        setContacts(prev => prev.map(c => c.id === item.id ? { ...c, unreadCount: 0 } : c));
    };

    const handleSend = (text: string) => {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMsg: Message = { id: Date.now().toString(), text, isMe: true, time: now, status: 'sending' };
        setMessages(prev => [...prev, newMsg]);

        // Simulate status progression
        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'sent' } : m));
        }, 600);
        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m));
        }, 1200);
        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m));
            // Update last message in list
            if (activeChat) {
                setContacts(prev => prev.map(c =>
                    c.id === activeChat.id ? { ...c, lastMessage: text, time: now, isMe: true } : c
                ));
            }
        }, 2500);

        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const handleTogglePin = () => {
        if (!activeChat) return;
        setContacts(prev => prev.map(c =>
            c.id === activeChat.id ? { ...c, isPinned: !c.isPinned } : c
        ));
        setActiveChat(prev => prev ? { ...prev, isPinned: !prev.isPinned } : prev);
    };

    const handleToggleMute = () => {
        if (!activeChat) return;
        setContacts(prev => prev.map(c =>
            c.id === activeChat.id ? { ...c, isMuted: !c.isMuted } : c
        ));
        setActiveChat(prev => prev ? { ...prev, isMuted: !prev.isMuted } : prev);
    };

    const handleClearChat = () => {
        Alert.alert('Limpar conversa', 'Tem certeza? Isso removerá todas as mensagens.', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Limpar', style: 'destructive', onPress: () => setMessages([]) },
        ]);
        setShowOptions(false);
    };

    const handleBlock = () => {
        Alert.alert('Bloquear contato', `Bloquear ${activeChat?.name}?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Bloquear', style: 'destructive', onPress: () => {
                    if (activeChat) {
                        setContacts(prev => prev.filter(c => c.id !== activeChat.id));
                        setActiveChat(null);
                    }
                }
            },
        ]);
        setShowOptions(false);
    };

    const handleVoiceCall = () => {
        if (activeChat?.phone) {
            Alert.alert('Chamada', `Iniciando chamada de voz para ${activeChat.name}...`);
        } else {
            Alert.alert('Chamada de voz', 'Funcionalidade disponível em breve!');
        }
    };

    const handleVideoCall = () => {
        Alert.alert('Vídeo Chamada', `Iniciando vídeo chamada com ${activeChat?.name}...`);
    };

    const handleCreateCommunity = (name: string, description: string, color: string, isPrivate: boolean) => {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newComm: Contact = {
            id: Date.now().toString(), name, username: '', phone: '',
            lastMessage: description || 'Comunidade criada.', time: now, unreadCount: 0, 
            type: 'group', isPinned: false, isMuted: isPrivate
        };
        setContacts(prev => [newComm, ...prev]);
        Alert.alert('Sucesso', `Comunidade "${name}" criada com sucesso!`);
    };

    const handleCreateContact = (name: string, phone: string) => {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newContact: Contact = {
            id: Date.now().toString(), name,
            username: phone.startsWith('@') ? phone : '',
            phone: !phone.startsWith('@') ? phone : '',
            lastMessage: 'Novo contato adicionado.', time: now, unreadCount: 0, type: 'private', isOnline: false,
        };
        setContacts(prev => [newContact, ...prev]);
    };

    // ── Status text ──────────────────────────────────────────────────────────
    const getStatusText = (chat: Contact) => {
        if (chat.type === 'group') return `${chat.memberCount ?? 0} membros`;
        if (chat.type === 'channel') return `${chat.memberCount ?? 0} inscritos`;
        if (chat.isOnline) return 'online';
        return 'visto recentemente';
    };

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <View style={[styles.container, isMobile && styles.containerMobile]}>

            {/* ─── Sidebar / Chat List ─── */}
            {(!isMobile || !activeChat) && (
                <View style={[styles.sidePanel, isMobile && styles.sidePanelMobile]}>

                    {/* Header */}
                    {isSearching ? (
                <View style={styles.chatHeader}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => setIsSearching(false)}>
                            <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Pesquisar conversas..."
                            placeholderTextColor={Theme.colors.placeholder}
                            autoFocus
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={24} color={Theme.colors.text} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ) : (
                <View style={styles.chatHeader}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => handleNavigation('Profile')}>
                            <Avatar name="Você" size={40} isOnline={true} />
                        </TouchableOpacity>
                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.headerTitle}>NEXORA</Text>
                            <Text style={styles.headerSubtitle}>Conectado</Text>
                        </View>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.headerBtn} onPress={() => setIsSearching(true)}>
                            <Ionicons name="search-outline" size={24} color={Theme.colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerBtn} onPress={() => setIsCreateContactModalVisible(true)}>
                            <Ionicons name="person-add-outline" size={24} color={Theme.colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerBtn}>
                            <Ionicons name="ellipsis-vertical" size={24} color={Theme.colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

                    {/* Search bar */}
                    {showSearch && (
                        <View style={styles.searchBar}>
                            <Text style={styles.searchIcon}>🔍</Text>
                            <TextInput
                                style={styles.searchInput}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Pesquisar conversas..."
                                placeholderTextColor={Theme.colors.placeholder}
                                autoFocus
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Text style={styles.searchClear}>✕</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* Sidebar Navigation Buttons */}
                    <View style={styles.sideNav}>
                        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('Status')}>
                            <View style={[styles.navIconContainer, { backgroundColor: '#3B82F620' }]}>
                                <Ionicons name="radio-outline" size={22} color="#3B82F6" />
                            </View>
                            <Text style={styles.navLabel}>Status</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('Communities')}>
                            <View style={[styles.navIconContainer, { backgroundColor: '#8B5CF620' }]}>
                                <Ionicons name="people" size={22} color="#8B5CF6" />
                            </View>
                            <Text style={styles.navLabel}>Comunidades</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('Calls')}>
                            <View style={[styles.navIconContainer, { backgroundColor: '#10B98120' }]}>
                                <Ionicons name="call-outline" size={22} color="#10B981" />
                            </View>
                            <Text style={styles.navLabel}>Ligações</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Quick actions */}
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={styles.quickBtn} onPress={() => setIsCreateContactModalVisible(true)}>
                            <Ionicons name="person-add" size={16} color={Theme.colors.primary} />
                            <Text style={styles.quickBtnLabel}>Novo Contato</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickBtn} onPress={() => setIsCreateCommunityModalVisible(true)}>
                            <Ionicons name="people" size={16} color={Theme.colors.primary} />
                            <Text style={styles.quickBtnLabel}>Nova Comunidade</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Conversation list */}
                    <FlatList
                        data={filteredContacts}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptySearch}>
                                <Ionicons name="search-outline" size={48} color={Theme.colors.placeholder} style={{ opacity: 0.3, marginBottom: 12 }} />
                                <Text style={styles.emptySearchText}>Nenhum resultado para "{searchQuery}"</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <ChatItem
                                name={item.name}
                                lastMessage={item.lastMessage}
                                time={smartTimestamp(item.time)}
                                unreadCount={item.unreadCount}
                                isMe={item.isMe}
                                isPinned={item.isPinned}
                                isMuted={item.isMuted}
                                isOnline={item.isOnline}
                                type={item.type}
                                memberCount={item.memberCount}
                                onPress={() => handleSelectChat(item)}
                                onLongPress={() => {
                                    Alert.alert(item.name, 'Opções', [
                                        { text: item.isPinned ? 'Desafixar' : 'Fixar', onPress: () => setContacts(prev => prev.map(c => c.id === item.id ? { ...c, isPinned: !c.isPinned } : c)) },
                                        { text: item.isMuted ? 'Ativar som' : 'Silenciar', onPress: () => setContacts(prev => prev.map(c => c.id === item.id ? { ...c, isMuted: !c.isMuted } : c)) },
                                        { text: 'Cancelar', style: 'cancel' },
                                    ]);
                                }}
                            />
                        )}
                    />
                </View>
            )}

            {/* ─── Chat Area ─── */}
            {(!isMobile || activeChat) && (
                <KeyboardAvoidingView
                    style={styles.chatArea}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <View style={styles.chatHeader}>
                                {isMobile && (
                                    <TouchableOpacity onPress={() => setActiveChat(null)} style={styles.backBtn}>
                                        <Text style={styles.backBtnText}>←</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={styles.chatHeaderInfo}
                                    onPress={() => handleNavigation('Profile')}
                                    activeOpacity={0.7}
                                >
                                    <Avatar name={activeChat.name} size={40} isOnline={activeChat.type === 'private' ? activeChat.isOnline : undefined} />
                                    <View style={styles.chatHeaderText}>
                                        <Text style={styles.chatHeaderName}>{activeChat.name}</Text>
                                        <Text style={[styles.chatHeaderStatus, activeChat.isOnline && styles.chatHeaderOnline]}>
                                            {getStatusText(activeChat)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.chatHeaderActions}>
                                    <TouchableOpacity style={styles.headerBtn} onPress={handleVoiceCall}>
                                        <Text style={styles.headerBtnText}>📞</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.headerBtn} onPress={handleVideoCall}>
                                        <Text style={styles.headerBtnText}>🎥</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.headerBtn} onPress={() => setShowOptions(true)}>
                                        <Text style={styles.headerBtnText}>⋮</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Messages */}
                            <FlatList
                                ref={listRef}
                                data={messages}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <MessageBubble
                                        message={item.text}
                                        isMe={item.isMe}
                                        time={item.time}
                                        status={item.status}
                                    />
                                )}
                                contentContainerStyle={styles.messageList}
                                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
                            />

                            <InputMessage onSend={handleSend} />
                        </>
                    ) : (
                        <View style={styles.emptyChat}>
                            <Text style={styles.emptyChatIcon}>💬</Text>
                            <Text style={styles.emptyChatTitle}>Bem-vindo ao NEXORA</Text>
                            <Text style={styles.emptyChatSub}>Selecione uma conversa para começar</Text>
                        </View>
                    )}
                </KeyboardAvoidingView>
            )}

            {/* ─── Modals ─── */}
            <CreateCommunityModal
                visible={isCreateModalVisible}
                onClose={() => setIsCreateModalVisible(false)}
                onCreate={handleCreateCommunity}
            />
            <CreateContactModal
                visible={isCreateContactModalVisible}
                onClose={() => setIsCreateContactModalVisible(false)}
                onCreate={handleCreateContact}
            />
            <ChatOptionsMenu
                visible={showOptions}
                onClose={() => setShowOptions(false)}
                isPinned={activeChat?.isPinned ?? false}
                isMuted={activeChat?.isMuted ?? false}
                onProfile={() => navigation.navigate('Profile', { user: activeChat })}
                onSearch={() => Alert.alert('Busca', 'Busca na conversa em breve!')}
                onTogglePin={handleTogglePin}
                onToggleMute={handleToggleMute}
                onClear={handleClearChat}
                onBlock={handleBlock}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Theme.colors.background,
    },
    containerMobile: {
        flexDirection: 'column',
    },

    // ── Sidebar ──
    sidePanel: {
        width: 340,
        backgroundColor: Theme.colors.card,
        borderRightWidth: 1,
        borderRightColor: Theme.colors.border,
    },
    sidePanelMobile: {
        width: '100%',
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: Theme.colors.card,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
        gap: 8,
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        color: Theme.colors.text,
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    headerSubtitle: {
        color: Theme.colors.primary,
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    backBtnText: {
        color: Theme.colors.primary,
        fontSize: 22,
        fontWeight: 'bold',
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    listTitle: {
        color: Theme.colors.primary,
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: 3,
    },
    listHeaderActions: {
        flexDirection: 'row',
        gap: 4,
    },
    headerBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBtnText: {
        fontSize: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
        marginVertical: 8,
        backgroundColor: Theme.colors.inputBackground,
        borderRadius: 20,
        paddingHorizontal: 12,
        gap: 8,
    },
    searchIcon: { fontSize: 16 },
    searchInput: {
        flex: 1,
        color: Theme.colors.text,
        fontSize: 14,
        paddingVertical: 10,
    },
    searchClear: {
        color: Theme.colors.placeholder,
        fontSize: 14,
        paddingHorizontal: 4,
    },
    sideNav: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 12,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    navIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navIcon: {
        fontSize: 20,
    },
    navLabel: {
        color: Theme.colors.text,
        fontSize: 11,
        fontWeight: '600',
    },
    quickActions: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    quickBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: Theme.colors.inputBackground,
    },
    quickBtnIcon: { fontSize: 16 },
    quickBtnLabel: {
        color: Theme.colors.text,
        fontSize: 13,
        fontWeight: '500',
    },
    emptySearch: {
        padding: 32,
        alignItems: 'center',
    },
    emptySearchText: {
        color: Theme.colors.placeholder,
        fontSize: 14,
    },

    // ── Chat Area ──
    chatArea: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    // Style cleanup: removed duplicated chatHeader and backBtn
    chatHeaderInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    chatHeaderText: {
        flex: 1,
    },
    chatHeaderName: {
        color: Theme.colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    chatHeaderStatus: {
        color: Theme.colors.placeholder,
        fontSize: 12,
        marginTop: 1,
    },
    chatHeaderOnline: {
        color: '#22C55E',
    },
    chatHeaderActions: {
        flexDirection: 'row',
        gap: 2,
    },
    messageList: {
        paddingVertical: 12,
        paddingBottom: 4,
    },

    // ── Empty State ──
    emptyChat: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyChatIcon: {
        fontSize: 64,
        marginBottom: 16,
        opacity: 0.4,
    },
    emptyChatTitle: {
        color: Theme.colors.text,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptyChatSub: {
        color: Theme.colors.placeholder,
        fontSize: 15,
        textAlign: 'center',
    },
});
