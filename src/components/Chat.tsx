import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message } from '../types';
import CleverlyResponseWindow from './CleverlyResponseWindow';

const ChatWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const ChatSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  background-color: #f5f7fa;
  border-right: 1px solid #ccc;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
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
  const [pdfResult, setPdfResult] = useState<any>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/ws/chat');
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        const cleverlyMessage = {
          user: 'Cleverly',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prevMessages) => [...prevMessages, cleverlyMessage]);
        onCleverlyResponse(data.text);
      } else if (data.type === 'pdfResult') {
        setPdfResult(data.pdfResult);
      }
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const arrayBuffer = reader.result as ArrayBuffer;
          ws.current?.send(JSON.stringify({ type: 'file', file: Array.from(new Uint8Array(arrayBuffer)) }));
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <ChatWrapper>
      <ChatSection>
        <ChatHeader>
          <AvatarCircle>
            <AvatarIcon src="/path/to/your/icon.png" alt="Cleverly Icon" />
          </AvatarCircle>
        </ChatHeader>
        <MessageList messages={messages} />
        <MessageInput onSend={sendMessage} onFileUpload={handleFileUpload} />
      </ChatSection>
      <ChatSection>
        {pdfResult && <CleverlyResponseWindow response={pdfResult} />}
      </ChatSection>
    </ChatWrapper>
  );
};

export default Chat;
