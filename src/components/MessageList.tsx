import React from 'react';
import styled from 'styled-components';
import { Message } from '../types';

const List = styled.ul`
  flex: 1;
  padding: 10px;
  overflow-y: scroll;
`;

const MessageItem = styled.li`
  padding: 5px 10px;
  border-bottom: 1px solid #ddd;
  position: relative;
`;

const MessageHeader = styled.div`
  font-weight: bold;
  font-size: 12px;
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
  return (
    <List>
      {messages.map((message, index) => (
        <MessageItem key={index}>
          <MessageHeader>{message.user}</MessageHeader>
          <div>{message.text}</div>
          <Timestamp>{message.timestamp}</Timestamp>
        </MessageItem>
      ))}
    </List>
  );
};

export default MessageList;
