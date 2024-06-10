import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Window = styled.div`
  width: 100%;
  min-width: 300px;
  padding: 10px;
  background-color: #f5f7fa;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  height: 98vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
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

const FormSection = styled(Paper)`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const FormColumn = styled.div`
  flex: 1;
  margin-right: 10px;
  &:last-child {
    margin-right: 0;
  }
`;

const TimeFieldsWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

interface JobHistory {
  title: string;
  service: string;
  date: string;
}

interface ResponseData {
  admin: string;
  customer: string;
  contactUser: string;
  source: string;
  property: string;
  sublocation: string;
  access: string;
  assetCategory: string;
  jobDescription: string;
  workDescription: string;
  priority: string;
  estimatedDuration: string;
  unit: string;
  reference: string;
  costCategory: string;
  service: string;
  pricing: string;
  timeSpan: string;
  timing: string;
  startTime: string;
  endTime: string;
  allowPremiumRates: boolean;
  compliance: boolean;
  jobHistory: JobHistory[];
}

interface CleverlyResponseWindowProps {
  response: { pdfResult: Partial<ResponseData> } & Partial<ResponseData>;
}

const CleverlyResponseWindow: React.FC<CleverlyResponseWindowProps> = ({ response }) => {
  const [data, setData] = useState<ResponseData>({
    admin: '',
    customer: '',
    contactUser: '',
    source: '',
    property: '',
    sublocation: '',
    access: '',
    assetCategory: '',
    jobDescription: '',
    workDescription: '',
    priority: '',
    estimatedDuration: '',
    unit: '',
    reference: '',
    costCategory: '',
    service: '',
    pricing: '',
    timeSpan: '',
    timing: '',
    startTime: '',
    endTime: '',
    allowPremiumRates: false,
    compliance: false,
    jobHistory: []
  });

  useEffect(() => {
    if (response) {
      setData((prevData: ResponseData) => ({
        ...prevData,
        ...response.pdfResult,
      }));
    }
  }, [response]);

  const handleChange = (field: keyof ResponseData, value: any) => {
    setData((prevData: ResponseData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: keyof ResponseData) => {
    setData((prevData: ResponseData) => ({
      ...prevData,
      [field]: !prevData[field],
    }));
  };

  const handleClose = () => {
    console.log('Close window');
  };

  if (!response) {
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <img src="/images/logo.png" alt="Cleverly Logo" />
        </div>
      </Window>
    );
  }

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
      <FormRow>
        <FormColumn>
          <FormSection>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Admin User</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Assigned to"
                    value={data.admin}
                    onChange={(e) => handleChange('admin', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
              </AccordionDetails>
            </Accordion>
          </FormSection>
          <FormSection>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Customer</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Customer"
                    value={data.customer}
                    onChange={(e) => handleChange('customer', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Contact User"
                    value={data.contactUser}
                    onChange={(e) => handleChange('contactUser', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Source"
                    value={data.source}
                    onChange={(e) => handleChange('source', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
              </AccordionDetails>
            </Accordion>
          </FormSection>
          <FormSection>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Description</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Short job description"
                    value={data.jobDescription}
                    onChange={(e) => handleChange('jobDescription', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Work Description"
                    value={data.workDescription}
                    onChange={(e) => handleChange('workDescription', e.target.value)}
                    multiline
                    variant="outlined"
                  />
                </FormControl>
                <FormControl component="fieldset" margin="dense">
                  <RadioGroup
                    row
                    value={data.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                  >
                    <FormControlLabel value="P0" control={<Radio />} label="P0" />
                    <FormControlLabel value="P1" control={<Radio />} label="P1" />
                    <FormControlLabel value="P2" control={<Radio />} label="P2" />
                    <FormControlLabel value="P3" control={<Radio />} label="P3" />
                    <FormControlLabel value="P4" control={<Radio />} label="P4" />
                    <FormControlLabel value="P5" control={<Radio />} label="P5" />
                  </RadioGroup>
                </FormControl>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Estimated duration"
                    type="number"
                    value={data.estimatedDuration}
                    onChange={(e) => handleChange('estimatedDuration', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Unit"
                    value={data.unit}
                    onChange={(e) => handleChange('unit', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Customer reference"
                    value={data.reference}
                    onChange={(e) => handleChange('reference', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.compliance}
                      onChange={() => handleCheckboxChange('compliance')}
                    />
                  }
                  label="Compliance"
                />
              </AccordionDetails>
            </Accordion>
          </FormSection>
          <FormSection>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Service</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Cost category"
                    value={data.costCategory}
                    onChange={(e) => handleChange('costCategory', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Service"
                    value={data.service}
                    onChange={(e) => handleChange('service', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
              </AccordionDetails>
            </Accordion>
          </FormSection>
          <FormSection>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Pricing</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl component="fieldset" margin="dense">
                  <RadioGroup
                    row
                    value={data.pricing}
                    onChange={(e) => handleChange('pricing', e.target.value)}
                  >
                    <FormControlLabel value="Time & Materials" control={<Radio />} label="Time & Materials" />
                    <FormControlLabel value="Fixed" control={<Radio />} label="Fixed" />
                  </RadioGroup>
                </FormControl>
              </AccordionDetails>
            </Accordion>
          </FormSection>
          <FormSection>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Timing</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Select Time span"
                    value={data.timeSpan}
                    onChange={(e) => handleChange('timeSpan', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Timing"
                    value={data.timing}
                    onChange={(e) => handleChange('timing', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
                <TimeFieldsWrapper>
                  <FormControl fullWidth margin="dense" variant="outlined">
                    <TextField
                      label="Start time"
                      type="time"
                      value={data.startTime}
                      onChange={(e) => handleChange('startTime', e.target.value)}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </FormControl>
                  <FormControl fullWidth margin="dense" variant="outlined">
                    <TextField
                      label="End time"
                      type="time"
                      value={data.endTime}
                      onChange={(e) => handleChange('endTime', e.target.value)}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </FormControl>
                </TimeFieldsWrapper>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.allowPremiumRates}
                      onChange={() => handleCheckboxChange('allowPremiumRates')}
                    />
                  }
                  label="Allow premium rates to be used"
                />
              </AccordionDetails>
            </Accordion>
          </FormSection>
        </FormColumn>
        <FormColumn>
          <FormSection>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Location</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Property"
                    value={data.property}
                    onChange={(e) => handleChange('property', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Sublocation"
                    value={data.sublocation}
                    onChange={(e) => handleChange('sublocation', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Access information"
                    value={data.access}
                    onChange={(e) => handleChange('access', e.target.value)}
                    multiline
                    variant="outlined"
                  />
                </FormControl>
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Asset Category"
                    value={data.assetCategory}
                    onChange={(e) => handleChange('assetCategory', e.target.value)}
                    variant="outlined"
                  />
                </FormControl>
              </AccordionDetails>
            </Accordion>
          </FormSection>
          <FormSection>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Job History</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Service</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.jobHistory.length > 0 ? (
                        data.jobHistory.map((job: JobHistory, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{job.title}</TableCell>
                            <TableCell>{job.service}</TableCell>
                            <TableCell>{job.date}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No job history available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </FormSection>
        </FormColumn>
      </FormRow>
      <Button variant="contained" color="primary" style={{ alignSelf: 'center', marginTop: '10px' }}>
        Submit
      </Button>
    </Window>
  );
};

export default CleverlyResponseWindow;
