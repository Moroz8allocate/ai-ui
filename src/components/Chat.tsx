import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message } from '../types';

const socket = io('http://localhost:4000');

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 400px;
  margin: 0 auto;
  border: 1px solid #ccc;
`;

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user] = useState<string>(`User ${Math.floor(Math.random() * 100) + 1}`);

  useEffect(() => {
    socket.on('message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = (text: string) => {
    const message: Message = {
      user,
      text,
      timestamp: new Date().toLocaleTimeString(),
    };
    socket.emit('message', message);
  };

  return (
    <ChatContainer>
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} />
    </ChatContainer>
  );
};

export default Chat;
