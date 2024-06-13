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
    contactUser: z.string().nullable(),
    source: z.string().nullable(),
    property: z.string().nullable(),
    sublocation: z.string().nullable(),
    access: z.string().nullable(),
    assetCategory: z.string().nullable(),
    assets: z.string().nullable(),
    jobDescription: z.string().nullable(),
    workDescription: z.string().nullable(),
    priority: z.string().nullable(),
    estimatedDuration: z.string().nullable(),
    unit: z.string().nullable(),
    reference: z.string().nullable(),
    costCategory: z.string().nullable(),
    service: z.string().nullable(),
    pricing: z.string().nullable(),
    threshold: z.string().nullable(),
    customerAmount: z.string().nullable(),
    labour: z.string().nullable(),
    materials: z.string().nullable(),
    timeSpan: z.string().nullable(),
    timing: z.string().nullable()
  });

  const fieldNamesMap: { [key in keyof z.infer<typeof responseSchema>]: string } = {
    admin: 'Assigned to',
    customer: 'Customer',
    contactUser: 'Contact User',
    source: 'Source',
    property: 'Property',
    sublocation: 'Sublocation',
    access: 'Access',
    assetCategory: 'Asset Category',
    assets: 'Assets',
    jobDescription: 'Shor job Description',
    workDescription: 'Work Description',
    priority: 'Priority',
    estimatedDuration: 'Estimated Duration',
    unit: 'Unit',
    reference: 'Reference',
    costCategory: 'Cost Category',
    service: 'Service',
    pricing: 'Pricing',
    threshold: 'Threshold',
    customerAmount: 'Customer Amount',
    labour: 'Labour',
    materials: 'Materials',
    timeSpan: 'Time Span',
    timing: 'Timing'
  };

  type ResponseData = z.infer<typeof responseSchema>;
  type ResponseKeys = keyof ResponseData;

  const ChatContainer: React.FC = () => {
    const [cleverlyResponse, setCleverlyResponse] = useState<any>(null);
    const [serverMessages, setServerMessages] = useState<string[]>([]);

    const handleCleverlyResponse = useCallback((response: string) => {
      const parsedResponse = JSON.parse(response);
      setCleverlyResponse(parsedResponse);

      const parsedData = responseSchema.safeParse(parsedResponse.pdfResult || parsedResponse);

      if (!parsedData.success) {
        console.error('Invalid response data');
        return;
      }

      const missingFields = Object.keys(parsedData.data).filter((key) => {
        const typedKey = key as ResponseKeys;
        return !parsedData.data[typedKey];
      });

      const firstMessage = 'Please see the work order created on the right. To generate the work order, you must press submit. However, please check this information and ensure you are happy with all the relevant information.';
      let secondMessage = '';

      if (missingFields.length > 0) {
        const missingFieldNames = missingFields.map(field => fieldNamesMap[field as ResponseKeys]).join('\n- ');
        secondMessage = `Some fields have missing information, please check the work order on the right and fill accordingly:\n- ${missingFieldNames}`;
      }

      setServerMessages([firstMessage, secondMessage]);
    }, []);

    return (
      <Container>
        <Chat onCleverlyResponse={handleCleverlyResponse} serverMessages={serverMessages} />
        <CleverlyResponseWindow response={cleverlyResponse} />
      </Container>
    );
  };

  export default ChatContainer;
