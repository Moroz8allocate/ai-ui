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
  admin: z.string().nullable(),
  customer: z.string().nullable(),
  contactUser: z.array(z.string()).nullable(),
  source: z.string().nullable(),
  property: z.array(z.string()).nullable(),
  sublocation: z.string().nullable(),
  access: z.array(z.string()).nullable(),
  assetCategory: z.string().nullable(),
  assets: z.string().nullable(),
  jobDescription: z.string().nullable(),
  workDescription: z.string().nullable(),
  priority: z.string().nullable(),
  estimatedDuration: z.string().nullable(),
  unit: z.string().nullable(),
  reference: z.array(z.string()).nullable(),
  costCategory: z.string().nullable(),
  service: z.string().nullable(),
  pricing: z.string().nullable(),
  threshold: z.string().nullable(),
  customerAmount: z.string().nullable(),
  labour: z.string().nullable(),
  materials: z.string().nullable(),
  timeSpan: z.string().nullable(),
  timing: z.array(z.string()).nullable()
});

export type ResponseData = z.infer<typeof responseSchema>;

const ChatContainer: React.FC = () => {
  const [cleverlyResponse, setCleverlyResponse] = useState<any>(null);
  const [serverMessages, setServerMessages] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<Partial<ResponseData>>({});


  const handleChangeCleverlyResponse = (response: any) => {
    setCleverlyResponse(response)
  }

  const handleCleverlyResponse = useCallback((response: string) => {
    const parsedResponse = JSON.parse(response);
    // setCleverlyResponse(parsedResponse);

    const parsedResult = responseSchema.safeParse(parsedResponse.pdfResult || parsedResponse);

    if (!parsedResult.success) {
      console.error('Invalid response data');
      return;
    }

    setParsedData(parsedResult.data);

    const firstMessage = 'Please see the work order created on the right. To generate the work order, you must press submit. However, please check this information and ensure you are happy with all the relevant information.';
    const initialMessages = [firstMessage];

    const variantMessages = Object.entries(parsedResult.data).flatMap(([key, value]) => {
      const typedKey = key as keyof ResponseData;
      if (Array.isArray(value) && value.length > 1) {
        return `I have detected an error in the input ${typedKey}. Did you mean\n- ${value.join('\n- ')}`;
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