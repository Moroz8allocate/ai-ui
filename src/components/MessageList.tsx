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

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const getAvatar = (user: string) => {
    if (user === 'Cleverly') {
      return <AvatarImg src="/images/bulb.png" alt="Cleverly Avatar" />;
    }
    return <span>IM</span>;
  };

  const a = messages.map((message, index) => (
    <MessageItem key={index}>
      <Avatar>{getAvatar(message.user)}</Avatar>
      <MessageContent>
        <MessageHeader>{message.user}</MessageHeader>
        <div>{message.text}</div>
        <Timestamp>{message.timestamp}</Timestamp>
      </MessageContent>
    </MessageItem>
  ));

  return (
    <List>
      {a}
    </List>
  );
};

export default MessageList;
