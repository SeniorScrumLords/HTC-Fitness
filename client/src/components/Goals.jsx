/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Grid2,
  Snackbar,
} from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios'; 
import Chart from './Chart.jsx';
import WeightCard from './WeightCard.jsx';

const Goals = ({ user }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  // State to toggle input visibility
  const [showInputs, setShowInputs] = useState({
    goal: false,
    current: false,
  });
  // State to store user-input weights
  const [weights, setWeights] = useState({
    goalWeight: user.goal_weight || 0,
    allWeights: user.weights || [],
    currentWeight:
      user.weights.length > 0
        ? user.weights[user.weights.length - 1].weight
        : 0,
  });

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (user) {
      // Sort the weights array by date in ascending order
      const sortedWeights = (user.weights || [])
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setWeights({
        goalWeight: user.goal_weight || 0,
        allWeights: sortedWeights || [],
        currentWeight:
          sortedWeights.length > 0
            ? sortedWeights[sortedWeights.length - 1].weight
            : 0,
      });
    }
  }, [user]);

  const handleButtonClick = (type) => {
    setShowInputs((prev) => ({ ...prev, [type]: true }));
  };

  const handleCancel = (type) => {
    setShowInputs((prev) => ({
      ...prev,
      [type === 'goalWeight' ? 'goal' : 'current']: false,
    }));
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

  const updateGoalWeight = async (newGoalWeight) => {
    try {
      await axios.patch(`/api/users/${user._id}`, {
        goal_weight: newGoalWeight,
      });

      setWeights((prev) => ({ ...prev, goalWeight: newGoalWeight }));
      setSnackbarMessage('Adjusted goal weight.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to update goal weight.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <div>
      <Grid2
        container
        spacing={2}
        sx={{ mt: 3, justifyContent: 'center', alignItems: 'center' }}
      >
        {/* Goal Weight Card */}
        <WeightCard
          userId={user._id}
          title='Goal Weight'
          weight={weights.goalWeight}
          showInput={showInputs.goal}
          onButtonClick={() => handleButtonClick('goal')}
          onCancel={() => handleCancel('goalWeight')}
          inputLabel='Goal Weight'
          onGoalWeightUpdate={updateGoalWeight}
        />
        {/* Current Weight Card */}
        <WeightCard
          userId={user._id}
          title='Current Weight'
          weight={weights.currentWeight}
          showInput={showInputs.current}
          onButtonClick={() => handleButtonClick('current')}
          onCancel={() => handleCancel('currentWeight')}
          inputLabel='Current Weight'
          isCurrentWeightCard
          onAddDateWeight={handleAddDateWeight}
        />
      </Grid2>
      <Chart weights={weights.allWeights} goalWeight={weights.goalWeight} />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Goals;
