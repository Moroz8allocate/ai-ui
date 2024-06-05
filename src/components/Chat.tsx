import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message } from '../types';

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  background-color: #f5f7fa;
  border-right: 1px solid #ccc;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding-bottom: 80px;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const AvatarCircle = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #4a5c82;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #d0d7e9;
  margin-right: 10px;
`;

const AvatarIcon = styled.img`
  width: 40px;
  height: 40px;
`;

interface ChatProps {
  onCleverlyResponse: (response: string) => void;
}

const Chat: React.FC<ChatProps> = ({ onCleverlyResponse }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user] = useState<string>('User');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initial message from AI
    const initialMessage = {
      user: 'Cleverly',
      text: 'Great! Drop a document with the work order information in it or paste the text into the window below, and I will get started.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initialMessage]);

    ws.current = new WebSocket('ws://localhost:8000/ws/chat');
    ws.current.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === 'message') {
        const cleverlyMessage = {
          user: 'Cleverly',
          text: response.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prevMessages) => [...prevMessages, cleverlyMessage]);
      }
      onCleverlyResponse(event.data);
    };
    return () => {
      ws.current?.close();
    };
  }, [onCleverlyResponse]);

  const sendMessage = (text: string) => {
    const message: Message = {
      user,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prevMessages) => [...prevMessages, message]);
    ws.current?.send(JSON.stringify({ type: 'message', text }));
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const arrayBuffer = reader.result as ArrayBuffer;
        ws.current?.send(arrayBuffer);

        const fileMessage: Message = {
          user,
          text: `File_pdf ${file.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prevMessages) => [...prevMessages, fileMessage]);

        const thankYouMessage: Message = {
          user: 'Cleverly',
          text: 'Thank you.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prevMessages) => [...prevMessages, thankYouMessage]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <ChatWrapper>
      <ChatHeader>
        <AvatarCircle>
          <AvatarIcon src="/images/bulb.png" alt="Cleverly Icon" />
        </AvatarCircle>
      </ChatHeader>
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} onFileUpload={handleFileUpload} />
    </ChatWrapper>
  );
};

export default Chat;
