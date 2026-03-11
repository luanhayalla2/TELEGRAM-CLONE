import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    Platform,
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

const { width, height } = Dimensions.get('window');

interface StatusItem {
    id: string;
    userId: string;
    userName: string;
    text?: string;
    imageUrl?: string;
    caption?: string;
    gradient?: string[];
    time: string;
    isRead: boolean;
    views: number;
}

const GRADIENTS = [
    ['#3B82F6', '#1D4ED8'], // Blue
    ['#8B5CF6', '#6D28D9'], // Purple
    ['#EC4899', '#BE185D'], // Pink
    ['#10B981', '#047857'], // Teal
    ['#F59E0B', '#D97706'], // Orange
    ['#EF4444', '#B91C1C'], // Red
    ['#6366F1', '#4338CA'], // Indigo
    ['#4B5563', '#1F2937'], // Dark
];

const SAMPLE_STATUS: StatusItem[] = [
    { id: 's1', userId: 'u1', userName: 'Alice Silva', text: 'Bom dia! ☀️', gradient: GRADIENTS[0], time: '15min atrás', isRead: false, views: 12 },
    { id: 's2', userId: 'u2', userName: 'Bruno Costa', text: 'Focado no projeto NEXORA! 🚀', gradient: GRADIENTS[1], time: '1h atrás', isRead: false, views: 24 },
    { id: 's3', userId: 'u3', userName: 'Carla Mendes', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', caption: 'Lugar maravilhoso! 😍', time: '3h atrás', isRead: true, views: 45 },
];

export default function StatusScreen() {
    // State for creating status
    const [myStatus, setMyStatus] = useState<StatusItem[]>([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [createMode, setCreateMode] = useState<'text' | 'image'>('text');
    const [statusText, setStatusText] = useState('');
    const [statusCaption, setStatusCaption] = useState('');
    const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // State for viewing status
    const [isViewerVisible, setIsViewerVisible] = useState(false);
    const [activeStatusList, setActiveStatusList] = useState<StatusItem[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    // Progress bar for viewer
    useEffect(() => {
        let interval: any;
        if (isViewerVisible) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        handleNext();
                        return 0;
                    }
                    return prev + 2;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isViewerVisible, activeIndex]);

    const handleNext = () => {
        if (activeIndex < activeStatusList.length - 1) {
            setActiveIndex(v => v + 1);
            setProgress(0);
        } else {
            setIsViewerVisible(false);
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveIndex(v => v - 1);
            setProgress(0);
        } else {
            setIsViewerVisible(false);
        }
    };

    const handleCreateStatus = () => {
        if (createMode === 'text' && !statusText.trim()) return;
        if (createMode === 'image' && !selectedImage) return;

        const newStatus: StatusItem = {
            id: Date.now().toString(),
            userId: 'me',
            userName: 'Você',
            text: createMode === 'text' ? statusText : undefined,
            gradient: createMode === 'text' ? selectedGradient : undefined,
            imageUrl: createMode === 'image' ? selectedImage! : undefined,
            caption: createMode === 'image' ? statusCaption : undefined,
            time: 'Agora',
            isRead: true,
            views: 0
        };

        setMyStatus([newStatus, ...myStatus]);
        setIsCreateModalVisible(false);
        resetCreateState();
    };

    const resetCreateState = () => {
        setStatusText('');
        setStatusCaption('');
        setSelectedImage(null);
        setCreateMode('text');
    };

    const handleDeleteStatus = (id: string) => {
        Alert.alert('Excluir Status', 'Tem certeza que deseja excluir esta atualização?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Excluir', style: 'destructive', onPress: () => setMyStatus(prev => prev.filter(s => s.id !== id)) }
        ]);
    };

    const openViewer = (list: StatusItem[], index: number = 0) => {
        setActiveStatusList(list);
        setActiveIndex(index);
        setIsViewerVisible(true);
    };

    const renderStatusItem = ({ item, list, index }: { item: StatusItem, list: StatusItem[], index: number }) => (
        <TouchableOpacity style={styles.statusItem} onPress={() => openViewer(list, index)}>
            <LinearGradient
                colors={!item.isRead ? (Theme.gradients.brand as any) : (['transparent', 'transparent'] as any)}
                style={styles.unreadRing}
            >
                <View style={styles.avatarInner}>
                    <Avatar name={item.userName} imageUrl={item.imageUrl} size={54} />
                </View>
            </LinearGradient>
            <View style={styles.statusInfo}>
                <Text style={styles.userName}>{item.userName}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Meus Status Header */}
                <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                    <Text style={styles.sectionTitle}>Meu Status</Text>
                </View>

                <TouchableOpacity 
                    style={styles.myStatusItem} 
                    onPress={() => myStatus.length > 0 ? openViewer(myStatus) : setIsCreateModalVisible(true)}
                >
                    <View style={styles.addStatusContainer}>
                        <Avatar name="Você" size={56} />
                        <View style={styles.addIconBadge}>
                            <Ionicons name="add" size={16} color="#fff" />
                        </View>
                    </View>
                    <View style={styles.statusInfo}>
                        <Text style={styles.userName}>Minhas Atualizações</Text>
                        <Text style={styles.timeText}>
                            {myStatus.length > 0 ? `Visualizado por ${myStatus[0].views} pessoas` : 'Toque para adicionar'}
                        </Text>
                    </View>
                </TouchableOpacity>

                {myStatus.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.myStatusList}>
                        {myStatus.map(status => (
                            <View key={status.id} style={styles.statusSmallCard}>
                                <TouchableOpacity onPress={() => openViewer(myStatus, myStatus.indexOf(status))}>
                                    {status.imageUrl ? (
                                        <Image source={{ uri: status.imageUrl }} style={styles.statusPreview} />
                                    ) : (
                                        <LinearGradient 
                                            colors={status.gradient as any} 
                                            style={styles.statusPreview}
                                        >
                                            <Text style={styles.previewText} numberOfLines={3}>{status.text}</Text>
                                        </LinearGradient>
                                    )}
                                </TouchableOpacity>
                                <View style={styles.statusCardFooter}>
                                    <Text style={styles.viewCount}>
                                        <Ionicons name="eye-outline" size={14} color={Theme.colors.placeholder} /> {status.views}
                                    </Text>
                                    <TouchableOpacity onPress={() => handleDeleteStatus(status.id)}>
                                        <Ionicons name="trash-outline" size={14} color={Theme.colors.placeholder} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                )}

                {/* Status Recentes */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Atualizações Recentes</Text>
                </View>

                {SAMPLE_STATUS.filter(s => !s.isRead).map((item, idx, arr) => (
                    <View key={item.id}>
                        {renderStatusItem({ item, list: arr, index: idx })}
                    </View>
                ))}

                {/* Status Visualizados */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Visualizados</Text>
                </View>

                {SAMPLE_STATUS.filter(s => s.isRead).map((item, idx, arr) => (
                    <View key={item.id}>
                        {renderStatusItem({ item, list: arr, index: idx })}
                    </View>
                ))}
            </ScrollView>

            {/* Float Buttons */}
            <View style={styles.fabContainer}>
                <TouchableOpacity 
                    style={[styles.fab, styles.fabText]} 
                    onPress={() => { setCreateMode('text'); setIsCreateModalVisible(true); }}
                >
                    <Ionicons name="pencil" size={24} color={Theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.fab, styles.fabCamera]}
                    onPress={() => { 
                        setSelectedImage('https://images.unsplash.com/photo-1611162617474-5b21e879e113'); 
                        setCreateMode('image'); 
                        setIsCreateModalVisible(true); 
                    }}
                >
                    <Ionicons name="camera" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Create Status Modal */}
            <Modal visible={isCreateModalVisible} animationType="slide" transparent>
                <View style={styles.modalFull}>
                    {createMode === 'text' ? (
                        <LinearGradient colors={selectedGradient as any} style={styles.createContent}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={() => setIsCreateModalVisible(false)}>
                                    <Text style={styles.modalClose}>✕</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleCreateStatus}>
                                    <View style={styles.publishBtn}>
                                        <Text style={styles.publishText}>PUBLICAR</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.statusInput}
                                placeholder="Diga algo..."
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                multiline
                                maxLength={500}
                                value={statusText}
                                onChangeText={setStatusText}
                                autoFocus
                            />

                            <View style={styles.colorPalette}>
                                {GRADIENTS.map((grad, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={[
                                            styles.colorOption,
                                            selectedGradient === grad && styles.selectedColor
                                        ]}
                                        onPress={() => setSelectedGradient(grad)}
                                    >
                                        <LinearGradient colors={grad as any} style={styles.colorInner} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </LinearGradient>
                    ) : (
                        <View style={[styles.createContent, { backgroundColor: '#000' }]}>
                            <Image source={{ uri: selectedImage! }} style={styles.imageFull} />
                            
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={() => setIsCreateModalVisible(false)}>
                                    <Text style={styles.modalClose}>✕</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleCreateStatus}>
                                    <View style={styles.publishBtn}>
                                        <Text style={styles.publishText}>PUBLICAR</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.captionContainer}>
                                <TextInput
                                    style={styles.captionInput}
                                    placeholder="Adicionar legenda..."
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    value={statusCaption}
                                    onChangeText={setStatusCaption}
                                    multiline
                                />
                            </View>
                        </View>
                    )}
                </View>
            </Modal>

            {/* Status Viewer Modal */}
            <Modal visible={isViewerVisible} transparent animationType="fade">
                {activeStatusList[activeIndex] && (
                    <View style={styles.viewerContainer}>
                        {/* Progress Bar Container */}
                        <View style={styles.progressContainer}>
                            {activeStatusList.map((_, i) => (
                                <View key={i} style={styles.progressTrack}>
                                    <View 
                                        style={[
                                            styles.progressFill, 
                                            { width: i < activeIndex ? '100%' : i === activeIndex ? `${progress}%` : '0%' }
                                        ]} 
                                    />
                                </View>
                            ))}
                        </View>

                        {/* Viewer Header */}
                        <View style={styles.viewerHeader}>
                            <View style={styles.viewerUser}>
                                <Avatar name={activeStatusList[activeIndex].userName} size={40} imageUrl={activeStatusList[activeIndex].imageUrl} />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.viewerName}>{activeStatusList[activeIndex].userName}</Text>
                                    <Text style={styles.viewerTime}>{activeStatusList[activeIndex].time}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => setIsViewerVisible(false)}>
                                <Ionicons name="close" size={32} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Content Area */}
                        <View style={styles.viewerContent}>
                            <TouchableOpacity style={styles.navSide} onPress={handlePrev} />
                            
                            <View style={styles.mainDisplay}>
                                {activeStatusList[activeIndex].imageUrl ? (
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Image source={{ uri: activeStatusList[activeIndex].imageUrl }} style={styles.imageFull} resizeMode="contain" />
                                        {activeStatusList[activeIndex].caption && (
                                            <View style={styles.viewCaption}>
                                                <Text style={styles.viewCaptionText}>{activeStatusList[activeIndex].caption}</Text>
                                            </View>
                                        )}
                                    </View>
                                ) : (
                                    <LinearGradient 
                                        colors={activeStatusList[activeIndex].gradient as any} 
                                        style={styles.textFull}
                                    >
                                        <Text style={styles.statusDisplay}>{activeStatusList[activeIndex].text}</Text>
                                    </LinearGradient>
                                )}
                            </View>

                            <TouchableOpacity style={styles.navSide} onPress={handleNext} />
                        </View>
                        
                        {/* Footer / Views */}
                        <View style={styles.viewerFooter}>
                            <Text style={styles.footerViews}>
                                <Ionicons name="eye-outline" size={18} color="rgba(255,255,255,0.8)" /> {activeStatusList[activeIndex].views} visualizações
                            </Text>
                        </View>
                    </View>
                )}
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 8,
    },
    sectionTitle: {
        color: Theme.colors.placeholder,
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    myStatusItem: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    addStatusContainer: {
        position: 'relative',
    },
    addIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Theme.colors.primary,
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: Theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIconText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    statusItem: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    unreadRing: {
        padding: 2.5,
        borderRadius: 31,
    },
    avatarInner: {
        padding: 2,
        backgroundColor: Theme.colors.background,
        borderRadius: 29,
    },
    statusInfo: {
        marginLeft: 16,
        flex: 1,
    },
    userName: {
        color: Theme.colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    timeText: {
        color: Theme.colors.placeholder,
        fontSize: 14,
        marginTop: 2,
    },
    myStatusList: {
        marginBottom: 16,
        paddingLeft: 16,
    },
    statusSmallCard: {
        width: 110,
        marginRight: 12,
        borderRadius: 15,
        backgroundColor: Theme.colors.card,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statusPreview: {
        width: 110,
        height: 160,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewText: {
        color: '#fff',
        fontSize: 11,
        textAlign: 'center',
        fontWeight: '700',
    },
    statusCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
    },
    viewCount: {
        color: Theme.colors.placeholder,
        fontSize: 12,
    },
    deleteIcon: {
        fontSize: 14,
        opacity: 0.6,
    },
    // FAB
    fabContainer: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        gap: 16,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            web: { boxShadow: '0px 4px 4.65px rgba(0,0,0,0.3)' },
            default: {
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
            }
        }),
    },
    fabText: {
        backgroundColor: Theme.colors.card,
        width: 48,
        height: 48,
        borderRadius: 24,
        alignSelf: 'center',
    },
    fabCamera: {
        backgroundColor: Theme.colors.primary,
    },
    fabIcon: { fontSize: 24 },

    // Modal Create
    modalFull: { flex: 1 },
    createContent: { flex: 1, padding: 24, justifyContent: 'center' },
    modalHeader: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        alignItems: 'center',
        zIndex: 10,
    },
    modalClose: { color: '#fff', fontSize: 28 },
    publishBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    publishText: { color: '#fff', fontWeight: 'bold', fontSize: 13, letterSpacing: 1 },
    statusInput: {
        color: '#fff',
        fontSize: 32,
        textAlign: 'center',
        width: '100%',
        fontWeight: '700',
        maxHeight: 400,
    },
    colorPalette: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 14,
        width: '100%',
        alignSelf: 'center',
    },
    colorOption: {
        width: 38,
        height: 38,
        borderRadius: 19,
        padding: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorInner: { flex: 1, borderRadius: 16 },
    selectedColor: { borderColor: '#fff' },
    
    // Image Create
    imageFull: { width: '100%', height: '100%', position: 'absolute' },
    captionContainer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    captionInput: { color: '#fff', fontSize: 16, maxHeight: 100 },

    // Viewer
    viewerContainer: { flex: 1, backgroundColor: '#000' },
    progressContainer: {
        flexDirection: 'row',
        position: 'absolute',
        top: 50,
        width: '100%',
        paddingHorizontal: 10,
        gap: 4,
        zIndex: 20,
    },
    progressTrack: {
        flex: 1,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 1,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
    },
    viewerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 65,
        paddingHorizontal: 20,
        zIndex: 20,
    },
    viewerUser: { flexDirection: 'row', alignItems: 'center' },
    viewerName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    viewerTime: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
    viewerContent: { flex: 1, flexDirection: 'row' },
    navSide: { width: width * 0.25, height: '100%', zIndex: 15 },
    mainDisplay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    textFull: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', padding: 40 },
    statusDisplay: { color: '#fff', fontSize: 32, fontWeight: '700', textAlign: 'center' },
    viewCaption: {
        position: 'absolute',
        bottom: 100,
        width: '100%',
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    viewCaptionText: { color: '#fff', fontSize: 18, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 10 },
    viewerFooter: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    footerViews: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
});
