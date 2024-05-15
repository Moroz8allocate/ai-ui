import React, { useState, useEffect } from 'react';
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
  padding-bottom: 80px; /* Додаємо нижній відступ */
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

  useEffect(() => {
    const initialMessages = [
      {
        user: 'Cleverly',
        text: 'Great! Drop a document with the work order information in it or paste the text into the window below, and I will get started!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        user: 'Cleverly',
        text: 'Thank you. I am extracting the text from your document and will then try to create the work order.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        user: 'Cleverly',
        text: 'Please see the work order created on the right. In order to generate the work order, you must press submit. However, please check this information and ensure you are happy with all the relevant information.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(initialMessages);
  }, []);

  const sendMessage = (text: string) => {
    const message: Message = {
      user,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prevMessages) => [...prevMessages, message]);

    // Simulate Cleverly response
    setTimeout(() => {
      const cleverlyMessage = {
        user: 'Cleverly',
        text: `Cleverly's response to "${text}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prevMessages) => [...prevMessages, cleverlyMessage]);
      onCleverlyResponse(`Detailed Cleverly response for: ${text}`);
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const message: Message = {
        user,
        text: `Uploaded file: ${file.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prevMessages) => [...prevMessages, message]);

      // Simulate Cleverly response to file upload
      setTimeout(() => {
        const cleverlyMessage = {
          user: 'Cleverly',
          text: `Cleverly processed the file: ${file.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prevMessages) => [...prevMessages, cleverlyMessage]);
        onCleverlyResponse(`Detailed Cleverly response for the file: ${file.name}`);
      }, 1000);
    }
  };

  return (
    <ChatWrapper>
      <ChatHeader>
        <AvatarCircle>
          <AvatarIcon src="/path/to/your/icon.png" alt="Cleverly Icon" />
        </AvatarCircle>
      </ChatHeader>
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} onFileUpload={handleFileUpload} />
    </ChatWrapper>
  );
};

export default Chat;
