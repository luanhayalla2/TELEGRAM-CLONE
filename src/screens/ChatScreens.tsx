import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import ChatItem from '../components/ChatItem';
import CreateCommunityModal from '../components/CreateCommunityModal';
import CreateContactModal from '../components/CreateContactModal';
import InputMessage from '../components/InputMessage';
import MessageBubble from '../components/MessageBubble';
import Theme from '../constants/Theme';

export default function ChatScreens() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [messages, setMessages] = useState([
    { id: '1', text: 'Oi! Como você está?', isMe: false, time: '10:30' },
    { id: '2', text: 'Tudo ótimo! E com você?', isMe: true, time: '10:32' },
  ]);

  const [contacts, setContacts] = useState([
    { id: 'c1', name: 'Alice Silva', username: '@alicesilva', phone: '+55 11 99999-9999', lastMessage: 'Tudo ótimo! E com você?', time: '10:32', unreadCount: 0 },
    { id: 'c2', name: 'Dev Team Base', username: '@devteambase', phone: '', lastMessage: 'Reunião às 14h, pessoal.', time: '09:15', unreadCount: 3 },
  ]);

  const [activeChat, setActiveChat] = useState<any>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isCreateContactModalVisible, setIsCreateContactModalVisible] = useState(false);

  const handleCreateCommunity = (name: string, description: string) => {
    const newCommunity = {
      id: Date.now().toString(),
      name: name,
      username: '',
      phone: '',
      lastMessage: description || 'Comunidade criada.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: 0,
    };
    setContacts([newCommunity, ...contacts]);
  };

  const handleCreateContact = (name: string, phone: string) => {
    const newContact = {
      id: Date.now().toString(),
      name: name,
      username: phone.startsWith('@') ? phone : '',
      phone: !phone.startsWith('@') ? phone : '',
      lastMessage: phone ? `Contato adicionado: ${phone}` : 'Novo contato adicionado.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: 0,
    };
    setContacts([newContact, ...contacts]);
  };

  const handleSelectChat = (item: any) => {
    setActiveChat(item);
    // Simula carregar mensagens daquele usuário
    setMessages([
      { id: Date.now().toString(), text: `Início da conversa com ${item.name}`, isMe: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
  };

  const handleSend = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      isMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>

      {/* Contatos (Chat List) */}
      {(!isMobile || !activeChat) && (
        <View style={[styles.chatListPreview, isMobile && styles.chatListMobile]}>

          {/* Meu Perfil (Configurações) */}
          <TouchableOpacity
            style={styles.createCommunityButton}
            onPress={() => navigation.navigate('Profile', { user: { id: 'me', name: 'Meu Perfil', username: '@eu' } })}
          >
            <View style={styles.createCommunityIcon}>
              <Text style={styles.createCommunityIconText}>⚙️</Text>
            </View>
            <View style={styles.createCommunityTextContainer}>
              <Text style={styles.createCommunityTitle}>Configurações</Text>
              <Text style={styles.createCommunitySubtitle}>Acesse seu Perfil</Text>
            </View>
          </TouchableOpacity>

          {/* Botão Crie Comunidades */}
          <TouchableOpacity
            style={styles.createCommunityButton}
            onPress={() => setIsCreateModalVisible(true)}
          >
            <View style={styles.createCommunityIcon}>
              <Text style={styles.createCommunityIconText}>👥</Text>
            </View>
            <View style={styles.createCommunityTextContainer}>
              <Text style={styles.createCommunityTitle}>Crie comunidades</Text>
              <Text style={styles.createCommunitySubtitle}>Conecte pessoas e grupos.</Text>
            </View>
          </TouchableOpacity>

          {/* Botão Novo Contato */}
          <TouchableOpacity
            style={styles.createCommunityButton}
            onPress={() => setIsCreateContactModalVisible(true)}
          >
            <View style={styles.createCommunityIcon}>
              <Text style={styles.createCommunityIconText}>👤</Text>
            </View>
            <View style={styles.createCommunityTextContainer}>
              <Text style={styles.createCommunityTitle}>Novo Contato</Text>
              <Text style={styles.createCommunitySubtitle}>Adicione amigos para conversar.</Text>
            </View>
          </TouchableOpacity>

          {/* Lista de Contatos Dinâmica */}
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ChatItem
                name={item.name}
                lastMessage={item.lastMessage}
                time={item.time}
                unreadCount={item.unreadCount}
                onPress={() => handleSelectChat(item)}
              />
            )}
          />
        </View>
      )}

      {/* Conversas (Chat Area) */}
      {(!isMobile || activeChat) && (
        <KeyboardAvoidingView
          style={styles.chatArea}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {activeChat ? (
            <>
              {/* Header do Chat Ativo */}
              <TouchableOpacity
                style={styles.activeChatHeader}
                onPress={() => navigation.navigate('Profile', { user: activeChat })}
              >
                {isMobile && (
                  <TouchableOpacity onPress={() => setActiveChat(null)} style={styles.backButton}>
                    <Text style={styles.backButtonText}>⬅</Text>
                  </TouchableOpacity>
                )}
                <View style={styles.activeChatAvatar}>
                  {/* Fallback inicial for header */}
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{activeChat.name.charAt(0)}</Text>
                </View>
                <Text style={styles.activeChatName}>{activeChat.name}</Text>
              </TouchableOpacity>

              <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <MessageBubble message={item.text} isMe={item.isMe} time={item.time} />
                )}
                contentContainerStyle={styles.messageList}
              />
              <InputMessage onSend={handleSend} />
            </>
          ) : (
            <View style={styles.emptyChatContainer}>
              <Text style={styles.emptyChatIcon}>💬</Text>
              <Text style={styles.emptyChatText}>Selecione um chat para começar a conversar</Text>
            </View>
          )}
        </KeyboardAvoidingView>
      )}

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Theme.colors.background,
  },
  chatArea: {
    flex: 2,
  },
  chatListPreview: {
    flex: 1,
    maxWidth: 400,
    minWidth: 250,
    backgroundColor: Theme.colors.card,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  containerMobile: {
    flexDirection: 'column',
  },
  chatListMobile: {
    maxWidth: '100%',
    minWidth: '100%',
    flex: undefined,
    height: 300,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  messageList: {
    paddingVertical: 16,
  },
  createCommunityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  createCommunityIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(47, 107, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createCommunityIconText: {
    fontSize: 24,
  },
  createCommunityTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  createCommunityTitle: {
    color: Theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  createCommunitySubtitle: {
    color: Theme.colors.placeholder,
    fontSize: 13,
  },
  activeChatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: Theme.colors.card,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  backButtonText: {
    color: Theme.colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  activeChatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeChatName: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyChatIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyChatText: {
    color: Theme.colors.placeholder,
    fontSize: 16,
    textAlign: 'center',
  },
});
