import React from 'react';
import styled from 'styled-components';

const Window = styled.div`
  width: 50%;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;

const HeaderTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const ResponseContent = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
`;

const SubmitButton = styled.button`
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

interface CleverlyResponseWindowProps {
  response: string;
}

const CleverlyResponseWindow: React.FC<CleverlyResponseWindowProps> = ({ response }) => {
  const handleClose = () => {
    // Implement close functionality
  };

  return (
    <Window>
      <Header>
        <HeaderTitle>Cleverly</HeaderTitle>
        <CloseButton onClick={handleClose}>✖</CloseButton>
      </Header>
      <ResponseContent>{response}</ResponseContent>
      <SubmitButton>Submit</SubmitButton>
    </Window>
  );
};

export default CleverlyResponseWindow;
