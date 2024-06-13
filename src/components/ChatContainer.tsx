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
  jobDescription: 'Short job Description',
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
  const [pendingVariants, setPendingVariants] = useState<string[]>([]);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<Partial<ResponseData>>({});

  const handleCleverlyResponse = useCallback((response: string) => {
    const parsedResponse = JSON.parse(response);
    setCleverlyResponse(parsedResponse);

    const parsedResult = responseSchema.safeParse(parsedResponse.pdfResult || parsedResponse);

    if (!parsedResult.success) {
      console.error('Invalid response data');
      return;
    }

    setParsedData(parsedResult.data);

    const missingFields = Object.keys(parsedResult.data).filter((key) => {
      const typedKey = key as ResponseKeys;
      return !parsedResult.data[typedKey];
    });

    const firstMessage = 'Please see the work order created on the right. To generate the work order, you must press submit. However, please check this information and ensure you are happy with all the relevant information.';

    const variantMessages = Object.entries(parsedResult.data).flatMap(([key, value]) => {
      const typedKey = key as ResponseKeys;
      if (Array.isArray(value) && value.length > 1) {
        return `I have detected an error in the input ${fieldNamesMap[typedKey]}. Did you mean\n- ${value.join('\n- ')}`;
      }
      return [];
    });

    let missingFieldsMessage = '';
    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(field => fieldNamesMap[field as ResponseKeys]).join('\n- ');
      missingFieldsMessage = `Some fields have missing information, please check the work order on the right and fill accordingly:\n- ${missingFieldNames}`;
    }

    const initialMessages = [firstMessage];
    if (variantMessages.length > 0) {
      initialMessages.push(variantMessages[0]);  // Display only the first error message initially
    }

    setServerMessages(initialMessages);

    if (variantMessages.length > 1 || missingFieldsMessage) {
      setPendingVariants([...variantMessages.slice(1), missingFieldsMessage].filter(Boolean));
    }

    setCurrentField(
      Object.keys(parsedResult.data).find(
        key => Array.isArray(parsedResult.data[key as ResponseKeys]) && (parsedResult.data[key as ResponseKeys] as string[])?.length > 1
      ) || null
    );
  }, []);

  const handleUserResponse = useCallback((userMessage: string) => {
    if (currentField) {
      const variant = userMessage.replace('Please use ', '').trim();
      const variants = parsedData[currentField as ResponseKeys] as string[];

      if (variants.includes(variant)) {
        const updatedData = {
          ...parsedData,
          [currentField]: variant
        };
        setParsedData(updatedData);
        setCleverlyResponse((prevResponse: any) => ({
          ...prevResponse,
          pdfResult: {
            ...prevResponse.pdfResult,
            [currentField]: variant
          }
        }));
        setServerMessages(prevMessages => [...prevMessages, `Thank you! I have updated the ${fieldNamesMap[currentField as ResponseKeys]} field with the one of your choosing.`]);

        if (pendingVariants.length > 0) {
          const nextVariant = pendingVariants.shift();
          setServerMessages(prevMessages => [...prevMessages, nextVariant || '']);
          setCurrentField(nextVariant ? Object.keys(responseSchema.shape).find(key => pendingVariants.includes(key)) || null : null);
        } else {
          setCurrentField(null);
        }
      } else {
        setServerMessages(prevMessages => [...prevMessages, 'The option you provided does not match any of the available options. Please try again.']);
      }
    }
  }, [currentField, parsedData, pendingVariants]);

  return (
    <Container>
      <Chat onCleverlyResponse={handleCleverlyResponse} serverMessages={serverMessages} onUserResponse={handleUserResponse} />
      <CleverlyResponseWindow response={cleverlyResponse} />
    </Container>
  );
};

export default ChatContainer;
