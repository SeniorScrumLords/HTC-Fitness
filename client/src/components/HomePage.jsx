import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Alert,
  Button,
  Card, 
  CardContent,
  Dialog,
  Stack,
  TextField,
  SnackBar,
  Grid2,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import ExerciseCard from './ExerciseCard.jsx';
import WeightCard from './WeightCard.jsx';
import Goals from './Goals.jsx';


const HomePage = ({ user, exercises, fetchRandomExercises }) => {
  // Preferred Name
  const navigate = useNavigate();
  const [prefName, setPrefName] = useState('');
  const [date, setDate] = useState(dayjs());
  const [dateWeight, setDateWeight] = useState('');
  const [dashboard, setDashboard] = useState([]);
  const [weights, setWeights] = useState({
    allWeights: user.weights || [],
    currentWeight:
      user.weights.length > 0
        ? user.weights[user.weights.length - 1].weight
        : 0,
  });

  // Tool Tip   
  const handleSettings = () => {
    navigate('/settings', { state: { from: 'home' } });
  };
  // Call fetch request on page load
  useEffect(() => {
    getSettings();
    // Weight info for Weight Card
    if (user) {
      // Sort the weights array by date in ascending order
      const sortedWeights = (user.weights || [])
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setWeights({
        // goalWeight: user.goal_weight || 0,
        allWeights: sortedWeights || [],
        currentWeight:
          sortedWeights.length > 0
            ? sortedWeights[sortedWeights.length - 1].weight
            : 0,
      });
    };
  }, [])

  //* GET Settings 
  const getSettings = async () => {
    try {
    const response = await axios.get(`/api/settings/${user._id}`); 
      if (response.data && response.data.length > 0) {
        setPrefName(response.data[0].prefName);
        setDashboard(response.data[0].dashboard);
      } else {
        createDefaultSettings()
      }
    } catch(err) {
      console.log('Failed to find user data', err)
    }
  };


  //* POST create default
  const createDefaultSettings = async () => {
    try {
      const response = await axios.post(`/api/settings/${user._id}`, {
        prefName: user.nameFirst,
        dashboard: ['exerciseSuggestions'],
        user_id: user._id,
      });
      console.log('Default settings created', response.data);
      getSettings();
    } catch (error) {
      console.log('failed on client to crate new user settings', error)
    }
  };

  //* Weight Card Props
  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleAddDateWeight = async (date, weight) => {
    try {
      const newWeight = { weight, date: date.toISOString() };
      // Check if the weight for the specific date already exists
      const weightExists = weights.allWeights.some((entry) => dayjs(entry.date).isSame(date, 'day'));

      // Update weights array based on existence check
      const updatedWeights = weightExists
        ? weights.allWeights.map((entry) => (dayjs(entry.date).isSame(date, 'day')
          ? newWeight
          : entry))
        : [...weights.allWeights, newWeight];

      // Sort the updated weights by date
      const sortedWeights = updatedWeights
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      // Send updated weights to the backend
      await axios.patch(`/api/users/${user._id}/weights`, {
        weights: sortedWeights,
      });

      setWeights((prev) => ({
        ...prev,
        allWeights: updatedWeights,
        currentWeight: updatedWeights[updatedWeights.length - 1].weight,
      }));

      const formattedDate = dayjs(date).format('MMMM D, YYYY');
      setSnackbarMessage(`Added weight: ${weight} lbs. for ${formattedDate}`);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to add weight.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  //add exercise to user routine
  const handleAddToRoutine = async (exercise) => {
    console.log(user._id);
    console.log(exercise);
    try {
      await axios.post(`/api/routines/${user._id}`, {
        exercise: exercise.name,
        muscle: exercise.muscle,
        sets: 3,
        reps: 10,
        weight: 50, // default values; user can change later
      });

      alert(`${exercise.name} added to routine!`);
    } catch (error) {
      console.error('Error adding exercise:', error);
      alert('Failed to add exercise.');
    }
  }


  return (
    <div>
      {/* Settings Icon */}
      <Grid2
          item
          container
          xs={6}
          direction="column"
          sx={{ alignItems: 'flex-end' }}
      >
        <Grid2 item>
          <Tooltip title="Dashboard Settings" placement="right-start" >
            <IconButton onClick={handleSettings}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Grid2>
      </Grid2>
      {/* Welcome Text */}
      <Typography variant="h4" gutterBottom align="center" marginTop="2rem">
      {`Welcome, ${prefName}, to the Hyperbolic Time Chamber`}
      </Typography>
     {/* Dashboard Elements */}
    <Grid2 aria-label="dashboard">
      {/*Conditional rendering */}
        {dashboard.includes('exerciseSuggestions') && (
          <Box display="flex" justifyContent="center" gap={2} margin="20px 0">
          <Button
            variant='contained'
            color='primary'
            onClick={() => fetchRandomExercises()}
            sx={{ display: 'block' }}
          >
            Get Some Exercises
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={() => fetchRandomExercises('/api/exercises/biceps')}
            sx={{ display: 'block' }}
          >
            Get Some Biceps Exercises
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={() => fetchRandomExercises('/api/exercises/quads')}
            sx={{ display: 'block' }}
          >
            Get Some Quads Exercises
          </Button>
        </Box>)}
        {exercises.length > 0 ? (
            <Grid2 container spacing={2} justifyContent="center" alignItems="stretch">
              {exercises.map((exercise, index) => (
                <Grid2 xs={12} sm={6} md={4} key={index}>
                  <ExerciseCard exercise={ exercise } user={ user } onAddToRoutine={handleAddToRoutine}/>
                </Grid2>
              ))}
            </Grid2>
        ) : (
          <Typography variant="h6">
          {/* Get Some Exercises! */}
        </Typography>
        )}
    {dashboard.includes('weightCard') && (
          <Grid2 item xs={12} sm={6} md={4}>
            <WeightCard 
              userId={user._id}
              weight={weights.currentWeight}
              showInput={false}
              title="Current Weight"
              isCurrentWeightCard={true}
              onAddDateWeight={handleAddDateWeight}
               />
            <Box
              open={openSnackbar}
              autoHideDuration={5000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Box onClose={handleSnackbarClose} severity={snackbarSeverity}>
                {snackbarMessage}
              </Box>
            </Box>
          </Grid2>
        )}
    </Grid2>
    </div>
  );
};

export default HomePage;
