import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Window = styled.div`
  width: 100%;
  min-width: 300px;
  padding: 20px;
  background-color: #f5f7fa;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  height: 95.4vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
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
  background-color: #fff;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  flex: 1;
  overflow-y: auto;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  position: absolute;
  bottom: 40px;
  left: 92.5%;
  transform: translateX(-50%);

  &:hover {
    background-color: #0056b3;
  }
`;

const SectionWrapper = styled.div`
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f1f1f1;
  padding: 10px;
  cursor: pointer;
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const SectionContent = styled.div<{ isOpen: boolean }>`
  padding: 10px;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  position: relative;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  background-color: #fff;
  width: 96%;
`;

const Value = styled.input<{ loading: boolean }>`
  border: none;
  flex: 1;
  background-color: ${(props) => (props.loading ? '#e9ecef' : '#fff')};
  pointer-events: ${(props) => (props.loading ? 'none' : 'auto')};
  padding-right: 30px;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #ccc;
  padding-left: 10px;

  &:hover {
    color: #000;
  }
`;

const ArrowIcon = styled.span`
  font-size: 20px;
`;

interface CleverlyResponseWindowProps {
  response: any;
}

const CleverlyResponseWindow: React.FC<CleverlyResponseWindowProps> = ({ response }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    admin: '',
    customer: '',
    contactUser: '',
    source: '',
    property: '',
    sublocation: '',
    access: '',
    assetCategory: '',
  });
  const [sections, setSections] = useState({
    adminUser: true,
    customer: true,
    location: true,
  });

  useEffect(() => {
    if (response) {
      setLoading(false);
      setData(response.pdfResult);
    }
  }, [response]);

  const handleToggleSection = (section: keyof typeof sections) => {
    setSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  const getDisplayValue = (value: any) => (value ? value : 'Select');

  const renderSection = (
    title: string,
    sectionKey: keyof typeof sections,
    fields: { label: string, value: any }[]
  ) => (
    <SectionWrapper key={sectionKey}>
      <SectionHeader onClick={() => handleToggleSection(sectionKey)}>
        <SectionTitle>{title}</SectionTitle>
        <ArrowIcon>{sections[sectionKey] ? '▲' : '▼'}</ArrowIcon>
      </SectionHeader>
      <SectionContent isOpen={sections[sectionKey]}>
        {fields.map((field, index) => (
          <FieldGroup key={index}>
            <Label>{field.label}</Label>
            <InputWrapper>
              <Value
                value={getDisplayValue(data[field.value])}
                loading={loading}
                readOnly={!loading}
                onChange={(e) => setData({ ...data, [field.value]: e.target.value })}
              />
              <ClearButton onClick={() => setData({ ...data, [field.value]: '' })}>×</ClearButton>
            </InputWrapper>
          </FieldGroup>
        ))}
      </SectionContent>
    </SectionWrapper>
  );

  const handleClose = () => {
    console.log('Close window');
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
      <ResponseContent>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '48%' }}>
            {renderSection('Admin User', 'adminUser', [
              { label: 'Assigned to', value: 'admin' },
            ])}
            {renderSection('Customer', 'customer', [
              { label: 'Customer', value: 'customer' },
              { label: 'Contact User', value: 'contactUser' },
              { label: 'Source', value: 'source' },
            ])}
          </div>
          <div style={{ width: '48%' }}>
            {renderSection('Location', 'location', [
              { label: 'Property', value: 'property' },
              { label: 'Sublocation', value: 'sublocation' },
              { label: 'Access information', value: 'access' },
              { label: 'Asset Category', value: 'assetCategory' },
            ])}
          </div>
        </div>
      </ResponseContent>
      <SubmitButton>Submit</SubmitButton>
    </Window>
  );
};

export default CleverlyResponseWindow;
