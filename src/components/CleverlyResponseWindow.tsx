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

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StarsIcon = styled.img`
  height: 30px;
  margin-right: 5px;
`;

const BulbIcon = styled.img`
  height: 30px;
  margin-right: 10px;
`;

const LogoText = styled.div`
  font-size: 24px;
  font-weight: bold;
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
        <LogoContainer>
          <StarsIcon src="/images/stars.png" alt="Stars Icon" />
          <BulbIcon src="/images/bulb.png" alt="Bulb Icon" />
          <LogoText>Cleverly</LogoText>
        </LogoContainer>
        <CloseButton onClick={handleClose}>✖</CloseButton>
      </Header>
      <ResponseContent>{response}</ResponseContent>
      <SubmitButton>Submit</SubmitButton>
    </Window>
  );
};

export default CleverlyResponseWindow;
