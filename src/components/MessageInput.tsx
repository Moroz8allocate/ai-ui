import React, { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FileUploadIcon = styled.label`
  font-size: 24px;
  color: #6c757d;
  margin-right: 10px;
  cursor: pointer;
`;

const FileUploadInput = styled.input`
  display: none;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: none;
  outline: none;
`;

const SendButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface MessageInputProps {
  onSend: (message: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, onFileUpload }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() !== '') {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <InputContainer>
      <FileUploadIcon htmlFor="file-upload">📎</FileUploadIcon>
      <FileUploadInput id="file-upload" type="file" onChange={onFileUpload} />
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message Dux ..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
      />
      <SendButton onClick={handleSend}>➤</SendButton>
    </InputContainer>
  );
};

export default MessageInput;
