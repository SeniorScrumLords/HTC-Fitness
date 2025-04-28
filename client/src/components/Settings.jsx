import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import { styled, useTheme } from '@mui/material/styles';

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&: hover fieldset': {
      borderColor: 'white',
    },
    '& input': {
      color: 'white',
    },
  },
});


const Settings = ({ user }) => {
  
  // Preferred Name
  const [textFieldId, setTextFieldId] = useState('outlined-read-only-input');
  const [readOnly, setReadOnly] = useState(true);
  const [buttonText, setButtonText] = useState('Edit Name');
  const [editing, setEditing] = useState(false)
  const [prefName, setPrefName] = useState('');
  const userName = prefName || user.nameFirst;
  const [open, setOpen] = useState(false) // name reset dialog

  // Dashboard Settings
  const [dashboard, setDashboard] = useState([]);
  // Dashboard Preferences
  const [selectedBoxes, setSelectedBoxes] = useState({
    // default check values
    exerciseSuggestions: true, 
    weightCard: false,
  })


  //* GET Settings on mount 
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`/api/settings/${user._id}`);
        //* preferred name box *//
        setPrefName(response.data[0].prefName || '');
        //* dashboard checks *//
        const dashboardSettings = response.data[0].dashboard;
        setDashboard(dashboardSettings);
        setSelectedBoxes({
          exerciseSuggestions: dashboardSettings.includes('exerciseSuggestions'),
          weightCard: dashboardSettings.includes('weightCard'),
        });
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, [user._id]);

  
  //* Event Handlers *//
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedBoxes((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
    patchData(name, checked);
  };

  // Name Change Handlers
  const handleEdit = () => {
    if(editing) {
      changeName();
    } else {
      // Disable text file id, set readOnly,  and button name to enter
      setReadOnly(false)
      setTextFieldId('outlined-disabled');
      setButtonText('Save');
      setEditing(true);
    }
  };
  
  const handleInputChange = (e) => {
    setPrefName(e.target.value);
  }

  const openDialog = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false);
  }
  
  //* PATCH request to server for client's preferences
  const patchData = async (setting, isChecked) => {
    try {
      if (isChecked) {
        dashboard.push(setting)
      } else {
        const index = dashboard.indexOf(setting);
        dashboard.splice(index, 1);
      }
      const response = await axios.patch(`/api/settings/${user._id}`, {dashboard: dashboard});
      console.log('updated user settings', response.data)
    } catch(error) {
      console.error('Dashboard preference update failed', error)
    }
  };

  //* Patch for Name
  const changeName = async() => {
    try {
      const response = await axios.patch(`/api/settings/${user._id}`, { prefName: prefName });
      console.log('Name change successful:', response.data);
      setEditing(false);
      setButtonText('Edit Name');
      setReadOnly(true);
    } catch(error) {
      console.error('Failed to change name from client side', error)
    }
  };

const navigate = useNavigate()

const handleCancel = () => {
  handleClose();
}

const resetPref = async () => {
  handleClose();
  try {
    const response = await axios.delete(`/api/settings/${user._id}`);
    console.log('preferences reset');
    navigate('/', { state: {from: 'settings'}});
  } catch (error) {
    console.error('Failed to reset preferences from client side', error);
  }
}



  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">
        Settings
      </Typography>
      <Divider />
       <Box sx={{ mb: 2 }}>
        <Typography variant="h6">
          Dashboard Settings
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <TextField
              id={textFieldId}
              label="Preferred Name"
              value={prefName}
              onChange={handleInputChange}
              slotProps={{
                input: {
                  readOnly: readOnly,
                },
              }}
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Button
              variant="contained"
              onClick={handleEdit}
              color="white"
              sx={{ ml: 1, height: '40px', backgroundColor: '#0D1C61' }}
              >
                {buttonText}
            </Button>
            
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedBoxes.exerciseSuggestions}
                onChange={handleCheckboxChange}
                name="exerciseSuggestions"
              />
            }
            label="Exercise Suggestions"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedBoxes.weightCard}
                onChange={handleCheckboxChange}
                name="weightCard"
              />
            }
            label="Weight"
          />
      </Box>
      <Divider/>
      <Box>
        <Chip label="Reset Preferences" onClick={openDialog}/>
        <Dialog onClose={handleClose} open={open}> 
          <DialogTitle>Reset Preferences</DialogTitle>
            <Typography>This will reset your preferences to Default</Typography>
            <ButtonGroup variant="contained">
              <Button color="red" onClick={resetPref}>Yes, reset</Button>
              <Button color="Blue" onClick={handleClose}>Cancel</Button>
            </ButtonGroup>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Settings;