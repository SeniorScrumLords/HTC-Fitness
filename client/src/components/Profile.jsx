import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Box,
  Button,
  Typography,
  Paper
} from '@mui/material';

const Profile = ({ user, tipsEnabled, setTipsEnabled }) => {
  console.log(user);

  const [gender, setGender] = useState('');
  const [intensity, setIntensity] = useState(3);

  useEffect(() => {
    if (user?._id) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    try {
      const response = await axios.get(`/api/tips/${user._id}`);
      if (response.data) {
        setGender(response.data.gender || 'male');
        setIntensity(response.data.intensity || 1);
        setTipsEnabled(response.data.tipsEnabled !== false);
      }
    } catch (err) {
      console.error('Failed to fetch user data', err);
    }
  };

  const handleGenderChange = async event => {
    const newGender = event.target.value;
    setGender(newGender);

    try {
      await axios.patch(`/api/tips/${user._id}`, { gender: newGender });
    } catch (error) {
      console.error('Error updating gender:', error);
    }
  };

  const handleIntensityChange = async event => {
    const newIntensity = event.target.value;
    setIntensity(newIntensity);

    try {
      await axios.patch(`/api/tips/${user._id}`, { intensity: newIntensity });
    } catch (error) {
      console.error('Error updating intensity:', error);
    }
  };

  const resetTips = async () => {
    const confirmReset = window.confirm("Are you sure you want to reset your workout tips?");
    if (!confirmReset) return;

    try {
      console.log("Resetting tips for userId:", user._id);
      await createDefaultTips();
      setTipsEnabled(true);
    } catch (error) {
      console.error("Error resetting tips:", error);
    }
  };

  const createDefaultTips = async () => {
    try {
      console.log("Creating default tips for user:", user._id);
      const defaultTips = {
        userId: user._id,
        gender: "male",
        intensity: 1,
        tipsEnabled: true,
      };

      await axios.post(`/api/tips`, defaultTips);
    } catch (error) {
      console.error("Failed to create default tips:", error);
    }
  };

  return (
    <Paper sx={{ padding: 3, maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
      <Typography variant='h5'>User Profile</Typography>

      <FormControl sx={{ m: 2, minWidth: 150 }}>
        <InputLabel id='gender-label'>Gender</InputLabel>
        <Select
          labelId='gender-label'
          id='gender-select'
          value={gender}
          label='Gender'
          onChange={handleGenderChange}
        >
          <MenuItem value={'male'}>Male</MenuItem>
          <MenuItem value={'female'}>Female</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ m: 2, minWidth: 150 }}>
        <InputLabel id='intensity-label'>Intensity</InputLabel>
        <Select
          labelId='intensity-label'
          id='intensity-select'
          value={intensity}
          label='Intensity'
          onChange={handleIntensityChange}
        >
          {[1, 2, 3, 4, 5, 6, 7].map(level => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Reset Tips Button in Profile */}
      <Box mt={2}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={resetTips}
        >
          Reset Tips
        </Button>
      </Box>
    </Paper>
  );
};

export default Profile;