import React from 'react';
import styled from 'styled-components';
import { Message } from '../types';

const List = styled.ul`
  flex: 1;
  padding: 10px;
  overflow-y: scroll;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
`;

const MessageItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #ddd;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #007bff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-right: 10px;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MessageContent = styled.div`
  flex: 1;
`;

const MessageHeader = styled.div`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
`;

const Timestamp = styled.div`
  font-size: 10px;
  color: gray;
  position: absolute;
  bottom: 5px;
  right: 10px;
`;

const FileIcon = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #007bff;
  margin-right: 10px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
`;

interface MessageListProps {
  messages: Message[];
  onButtonClick: (option: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onButtonClick }) => {
  const getAvatar = (user: string) => {
    if (user === 'Cleverly') {
      return <AvatarImg src="/images/blub-in-chat.png" alt="Cleverly Avatar" />;
    }
    return <span>IM</span>;
  };

  const renderMessageContent = (message: Message) => {
    if (message.text.includes('Did you mean')) {
      const options = message.text.split('\n- ').slice(1).map(option => option.trim());
      return (
        <div>
          {message.text.split('Did you mean')[0]} Did you mean:
          {options.map(option => (
            <Button key={option} onClick={() => onButtonClick(option)}>
              {option}
            </Button>
          ))}
        </div>
      );
    } else if (message.text.startsWith('File_pdf')) {
      return <FileIcon>📄 {message.text.replace('File_pdf ', '')}</FileIcon>;
    } else {
      return message.text;
    }
  };

  return (
    <List>
      {messages.map((message, index) => (
        <MessageItem key={index}>
          <Avatar>{getAvatar(message.user)}</Avatar>
          <MessageContent>
            <MessageHeader>{message.user}</MessageHeader>
            <div>{renderMessageContent(message)}</div>
            <Timestamp>{message.timestamp}</Timestamp>
          </MessageContent>
        </MessageItem>
      ))}
    </List>
  );
};

export default MessageList;
