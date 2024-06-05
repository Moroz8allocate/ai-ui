import React, { useState } from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
  background-color: #fff;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
  font-size: 24px;
  color: #007bff;
`;

interface MessageInputProps {
  onSend: (message: string) => void;
  onFileUpload: (file: File) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, onFileUpload }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileUpload(event.target.files[0]);
    }
  };

  return (
    <InputWrapper>
      <FileInputLabel htmlFor="file-upload">📎</FileInputLabel>
      <FileInput id="file-upload" type="file" onChange={handleFileChange} />
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Message Dux..."
      />
      <Button onClick={handleSend}>Send</Button>
    </InputWrapper>
  );
};

export default MessageInput;
