import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Chat from './Chat';
import CleverlyResponseWindow from './CleverlyResponseWindow';

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #dce3f3;
  font-family: 'Arial', sans-serif;
`;

const ChatContainer: React.FC = () => {
  const [cleverlyResponse, setCleverlyResponse] = useState<any>(null);

  const handleCleverlyResponse = useCallback((response: string) => {
    const parsedResponse = JSON.parse(response);
    setCleverlyResponse(parsedResponse);
  }, []);

  return (
    <Container>
      <Chat onCleverlyResponse={handleCleverlyResponse} />
      <CleverlyResponseWindow response={cleverlyResponse} />
    </Container>
  );
};

export default ChatContainer;
