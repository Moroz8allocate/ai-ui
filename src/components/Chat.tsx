import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { PDFDocument, rgb } from 'pdf-lib';
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
  position: relative;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 80%;
  max-width: 400px;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalAvatarCircle = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #4a5c82;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #d0d7e9;
  margin-bottom: 10px;
`;

const ModalAvatarIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const ModalText = styled.p`
  font-size: 16px;
  margin: 10px 0;
`;

const ModalButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

interface ChatProps {
  onCleverlyResponse: (response: string) => void;
  serverMessages: string[];
  onUserResponse: (message: string) => void;
}

const Chat: React.FC<ChatProps> = ({ onCleverlyResponse, serverMessages, onUserResponse }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user] = useState<string>('User');
  const [showModal, setShowModal] = useState<boolean>(true);
  const [allowTyping, setAllowTyping] = useState<boolean>(false);
  const [lastField, setLastField] = useState<string | null>(null);
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
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
    ws.current.onclose = () => {
      console.error("WebSocket connection closed.");
    };
    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    return () => {
      ws.current?.close();
    };
  }, [onCleverlyResponse]);

  useEffect(() => {
    serverMessages.forEach((serverMessage) => {
      if (serverMessage) {
        const message: Message = {
          user: 'Cleverly',
          text: serverMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prevMessages) => [...prevMessages, message]);

        if (serverMessage.includes('I have detected an error in the input')) {
          const field = serverMessage.split('I have detected an error in the input ')[1].split('.')[0];
          const options = serverMessage.split('- ').slice(1).map(option => option.trim());
          setLastField(field);
          setFieldOptions(options);
        }
      }
    });
  }, [serverMessages]);

  const createPdfFromText = async (text: string): Promise<ArrayBuffer> => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { height } = page.getSize();
    const fontSize = 12;
    const lines = text.split('\n');
    let yPosition = height - fontSize;

    for (const line of lines) {
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= fontSize + 5;
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!allowTyping) return;

    const message: Message = {
      user,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prevMessages) => [...prevMessages, message]);

    if (text.startsWith('Please use')) {
      if (fieldOptions.includes(text.split('Please use ')[1].trim())) {
        const thankYouMessage: Message = {
          user: 'Cleverly',
          text: `Thank you! I have updated the ${lastField} field with the one of your choosing.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prevMessages) => [...prevMessages, thankYouMessage]);

        // Update the field in your state or send an update to the server if needed
        // updateField(lastField, text.split('Please use ')[1].trim());
      } else {
        const errorMessage: Message = {
          user: 'Cleverly',
          text: `The option you provided does not match any of the available options for the ${lastField} field.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } else {
      const pdfBytes = await createPdfFromText(text);
      ws.current?.send(pdfBytes);

      const thankYouMessage: Message = {
        user: 'Cleverly',
        text: 'Thank you. I am processing the text from your input and will then try to create the work order.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prevMessages) => [...prevMessages, thankYouMessage]);
    }
  }, [allowTyping, user, lastField, fieldOptions]);

  const handleFileUpload = (file: File) => {
    if (!allowTyping) return;
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
          text: 'Thank you. I am extracting the text from your document and will then try to create the work order.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prevMessages) => [...prevMessages, thankYouMessage]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCreateWorkOrder = () => {
    setAllowTyping(true);
    setShowModal(false);
  };

  return (
    <ChatWrapper>
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalAvatarCircle>
                <ModalAvatarIcon src="/images/bulb.png" alt="Cleverly Icon" />
              </ModalAvatarCircle>
              <ModalText>Hi, I’m Dux - your Cleverly AI Assistant.</ModalText>
              <ModalText>What can I do for you today?</ModalText>
              <ModalText>Choose one of the options below and we will get started!</ModalText>
            </ModalHeader>
            <ModalButton onClick={handleCreateWorkOrder}>Create a work order</ModalButton>
            <ModalButton>Get help with Cleverly</ModalButton>
            <ModalButton>Get a report</ModalButton>
            <ModalButton>Ask Cleverly a question</ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
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