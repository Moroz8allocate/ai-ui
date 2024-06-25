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
  MenuItem,
  Select,
  InputLabel,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './styles.css';

const Window = styled.div`
  width: 100%;
  min-width: 300px;
  padding: 10px;
  background-color: #f5f7fa; // This is the original background color
  background-color: #FFFFFF; // Updated background color to a light gray
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

const AutocompleteWithDropdownIcon = styled(Autocomplete)`
  .MuiAutocomplete-endAdornment {
    display: none;
  }
`;

const CustomTextField = styled(TextField)`
  .MuiInputBase-root {
    position: relative;
    .MuiSvgIcon-root {
      position: absolute;
      right: 7px;
      pointer-events: none; /* Ensure the icon is not interactive */
    }
  }
`;

interface JobHistory {
  title: string;
  service: string;
  date: string;
}

interface CleverlyResponseWindowProps {
  response: any;
  parsedResponseDb: any;
  isBlocked: boolean
}

const validSources = ["Call", "Email", "Portal", "Other"];
const validUnits = ["Hours", "Minutes", "Days"];
const validTimeSpans = ["Today", "This week", "This month", "Next three months"];

const CleverlyResponseWindow: React.FC<CleverlyResponseWindowProps> = ({ response, parsedResponseDb, isBlocked }) => {
  console.log("🚀 ~CleverlyResponseWindow  parsedResponseDb:", parsedResponseDb)
  const [data, setData] = useState<any>({
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

  const [options, setOptions] = useState<any>({
    admin: ['Admin 1', 'Admin 2', 'Admin 3'],
    customer: ['Customer 1', 'Customer 2', 'Customer 3'],
    contactUser: ['Contact User 1', 'Contact User 2', 'Contact User 3'],
    property: ['Property 1', 'Property 2', 'Property 3'],
    sublocation: ['Sublocation 1', 'Sublocation 2', 'Sublocation 3'],
    assetCategory: ['Asset Category 1', 'Asset Category 2', 'Asset Category 3'],
    jobDescription: ['Job Description 1', 'Job Description 2', 'Job Description 3'],
    service: ['Service 1', 'Service 2', 'Service 3'],
    costCategory: ['Cost Category 1', 'Cost Category 2', 'Cost Category 3']
  });



  useEffect(() => {
    if (parsedResponseDb) {
      setOptions({
        admin: parsedResponseDb?.admin,
        customer: parsedResponseDb?.customer,
        contactUser: parsedResponseDb?.contactUser,
        property: parsedResponseDb?.property,
        sublocation: parsedResponseDb?.sublocation,
        assetCategory: parsedResponseDb?.assetCategory,
        jobDescription: parsedResponseDb?.jobDescription,
        service: parsedResponseDb?.service,
        costCategory: parsedResponseDb?.costCategory
      })
    }
  }, [parsedResponseDb]);

  useEffect(() => {
    if (response) {
      const filteredResponse = Object.entries(response.pdfResult || response).reduce((acc, [key, value]) => {
        if (!Array.isArray(value) || value.length <= 1) {
          (acc as any)[key] = value;
        }
        return acc;
      }, {});

      setData((prevData: any) => ({
        ...prevData,
        ...filteredResponse,
      }));
    }
  }, [response]);

  const handleChange = (field: any, value: any) => {
    setData((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: any) => {
    setData((prevData: any) => ({
      ...prevData,
      [field]: !prevData[field],
    }));
  };

  const handleClose = () => {
    console.log('Close window');
  };

  const renderAutocompleteField = (label: string, field: string, options: string[]) => (
    <FormControl fullWidth margin="dense" variant="outlined" style={{ position: 'relative' }}>
      <AutocompleteWithDropdownIcon
        freeSolo
        options={options}
        value={data[field]}
        onChange={(e, newValue) => handleChange(field, newValue)}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            label={label}
            onChange={(e) => handleChange(field, e.target.value)}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  <ArrowDropDownIcon />
                </>
              ),
            }}
          />
        )}
      />
    </FormControl>
  );

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
      <FormRow className={isBlocked ? 'blocked' : ''}>
        <FormColumn>
          <FormSection>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Admin User</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderAutocompleteField('Assigned to', 'admin', options.admin)}
              </AccordionDetails>
            </Accordion>
          </FormSection>
          <FormSection>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Customer</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderAutocompleteField('Customer', 'customer', options.customer)}
                {renderAutocompleteField('Contact User', 'contactUser', options.contactUser)}
                <FormControl fullWidth margin="dense" variant="outlined">
                  <InputLabel>Source</InputLabel>
                  <Select
                    value={data.source}
                    onChange={(e) => handleChange('source', e.target.value as string)}
                    label="Source"
                  >
                    {validSources.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
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
                {renderAutocompleteField('Short job description', 'jobDescription', options.jobDescription)}
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
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={data.unit}
                    onChange={(e) => handleChange('unit', e.target.value)}
                    label="Unit"
                  >
                    {validUnits.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
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
                {renderAutocompleteField('Cost category', 'costCategory', options.costCategory)}
                {renderAutocompleteField('Service', 'service', options.service)}
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
                  <InputLabel>Select Time span</InputLabel>
                  <Select
                    value={data.timeSpan}
                    onChange={(e) => handleChange('timeSpan', e.target.value)}
                    label="Select Time span"
                  >
                    {validTimeSpans.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
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
                {renderAutocompleteField('Property', 'property', options.property)}
                {renderAutocompleteField('Sublocation', 'sublocation', options.sublocation)}
                <FormControl fullWidth margin="dense" variant="outlined">
                  <TextField
                    label="Access information"
                    value={data.access}
                    onChange={(e) => handleChange('access', e.target.value)}
                    multiline
                    variant="outlined"
                  />
                </FormControl>
                {renderAutocompleteField('Asset Category', 'assetCategory', options.assetCategory)}
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
