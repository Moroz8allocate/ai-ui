import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Chat from './Chat';
import CleverlyResponseWindow from './CleverlyResponseWindow';
import { z } from 'zod';

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #dce3f3;
  font-family: 'Arial', sans-serif;
`;

const responseSchema = z.object({
  admin: z.union([z.string(), z.array(z.string()), z.null()]),
  customer: z.union([z.string(), z.array(z.string()), z.null()]),
  contactUser: z.union([z.string(), z.array(z.string()), z.null()]),
  source: z.union([z.string(), z.array(z.string()), z.null()]),
  property: z.union([z.string(), z.array(z.string()), z.null()]),
  sublocation: z.union([z.string(), z.array(z.string()), z.null()]),
  access: z.union([z.string(), z.array(z.string()), z.null()]),
  assetCategory: z.union([z.string(), z.array(z.string()), z.null()]),
  assets: z.union([z.string(), z.array(z.string()), z.null()]),
  jobDescription: z.union([z.string(), z.array(z.string()), z.null()]),
  workDescription: z.union([z.string(), z.array(z.string()), z.null()]),
  priority: z.union([z.string(), z.array(z.string()), z.null()]),
  estimatedDuration: z.union([z.string(), z.array(z.string()), z.null()]),
  unit: z.union([z.string(), z.array(z.string()), z.null()]),
  reference: z.union([z.string(), z.array(z.string()), z.null()]),
  costCategory: z.union([z.string(), z.array(z.string()), z.null()]),
  service: z.union([z.string(), z.array(z.string()), z.null()]),
  pricing: z.union([z.string(), z.array(z.string()), z.null()]),
  threshold: z.union([z.string(), z.array(z.string()), z.null()]),
  customerAmount: z.union([z.string(), z.array(z.string()), z.null()]),
  labour: z.union([z.string(), z.array(z.string()), z.null()]),
  materials: z.union([z.string(), z.array(z.string()), z.null()]),
  timeSpan: z.union([z.string(), z.array(z.string()), z.null()]),
  timing: z.union([z.string(), z.array(z.string()), z.null()])
});

// export type ResponseData = z.infer<typeof responseSchema>;

const ChatContainer: React.FC = () => {
  const [cleverlyResponse, setCleverlyResponse] = useState<any>(null);
  const [serverMessages, setServerMessages] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<any>({});


  const handleChangeCleverlyResponse = (response: any) => {
    setCleverlyResponse(response)
  }

  const validSources = ["Call", "Email", "Portal", "Other"];
  const validUnits = ["Hours", "Minutes", "Days"];
  const validTimeSpans = ["Today", "This week", "This month", "Next three months"];
  
  const handleCleverlyResponse = useCallback((response: string) => {
    const parsedResponse = JSON.parse(response);
  
    // Validate specific fields
    const validateField = (field: string, validValues: string[]) => {
      return validValues.includes(parsedResponse[field]) ? parsedResponse[field] : "";
    };
  
    parsedResponse.source = validateField("source", validSources);
    parsedResponse.unit = validateField("unit", validUnits);
    parsedResponse.timeSpan = validateField("timeSpan", validTimeSpans);
  
    const parsedResult = responseSchema.safeParse(parsedResponse.pdfResult || parsedResponse);
  
    if (!parsedResult.success) {
      console.error('Invalid response data');
      return;
    }
  
    setParsedData(parsedResult.data);
    setCleverlyResponse(parsedResult.data);
  
    const firstMessage = 'Please see the work order created on the right. To generate the work order, you must press submit. However, please check this information and ensure you are happy with all the relevant information.';
    const initialMessages = [firstMessage];
  
    const variantMessages = Object.entries(parsedResult.data).flatMap(([key, value]) => {
      if (["source", "unit", "timeSpan"].includes(key)) {
        return [];
      }
  
      if (Array.isArray(value) && value.length > 1) {
        return `I have detected an error in the input ${key}. Did you mean\n- ${value.join('\n- ')}`;
      }
      return [];
    });
  
    setServerMessages(initialMessages.concat(variantMessages.length > 0 ? [variantMessages[0]] : []));
  }, []);
  

  return (
    <Container>
      <Chat onCleverlyResponse={handleCleverlyResponse} serverMessages={serverMessages} parsedData={parsedData} setParsedData={setParsedData} handleChangeCleverlyResponse={handleChangeCleverlyResponse} />
      <CleverlyResponseWindow response={cleverlyResponse} />
    </Container>
  );
};

export default ChatContainer;