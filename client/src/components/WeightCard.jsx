import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  Grid2,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';

const WeightCard = ({
  userId,
  title,
  weight,
  showInput,
  onButtonClick,
  onCancel,
  inputLabel,
  isCurrentWeightCard,
  onAddDateWeight,
  onGoalWeightUpdate,
}) => {
  const [date, setDate] = useState(dayjs());
  const [dateWeight, setDateWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [openDateDialog, setOpenDateDialog] = useState(false);

  const handleDateSubmit = async () => {
    if (date && dateWeight) {
      try {
        await axios.patch(`/api/users/${userId}/weights`, {
          weights: [{ weight: dateWeight, date: date.toISOString() }],
        });
        onAddDateWeight(date, dateWeight);
        setOpenDateDialog(false);
        setDate(dayjs());
        setDateWeight('');
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    }
  };

  const handleGoalSubmit = async () => {
    if (goalWeight) {
      try {
        await axios.patch(`/api/users/${userId}`, {
          goal_weight: goalWeight,
        });
        if (onGoalWeightUpdate) {
          onGoalWeightUpdate(goalWeight); // Notify parent component
        }
        setGoalWeight('');
        onCancel();
      } catch (error) {
        throw new Error(error);
      }
    }
  };

  const handleResetGoalWeight = async () => {
    try {
      await axios.delete(`/api/users/${userId}/goal-weight`);
      if (onGoalWeightUpdate) {
        onGoalWeightUpdate(0);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <Grid2 xs={12} md={6}>
      <Card
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <CardContent>
          <Typography variant='h4'>{title}</Typography>
          <Typography variant='subtitle1'>
            {weight ? `${weight} lbs.` : `No ${title} set.`}
          </Typography>
        </CardContent>
        <CardContent>
          {isCurrentWeightCard ? (
            <>
              <Button
                variant='contained'
                onClick={() => setOpenDateDialog(true)}
              >
                Add Weight
              </Button>
              <Dialog
                open={openDateDialog}
                onClose={() => setOpenDateDialog(false)}
              >
                <Stack spacing={2} sx={{ p: 3 }}>
                  <DatePicker
                    label='Select Date'
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                  />
                  <TextField
                    type='number'
                    label='Weight'
                    value={dateWeight}
                    onChange={(e) => setDateWeight(e.target.value)}
                    fullWidth
                  />
                  <Stack direction='row' spacing={1}>
                    <Button variant='contained' onClick={handleDateSubmit}>
                      Submit
                    </Button>
                    <Button variant='outlined' onClick={() => setOpenDateDialog(false)}>
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              </Dialog>
            </>
          ) : (
            <>
              {!showInput ? (
                <Stack direction='row' spacing={1}>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={onButtonClick}
                  >
                    Set Goal Weight
                  </Button>
                  <Button
                    variant='outlined'
                    color='error'
                    onClick={handleResetGoalWeight}
                  >
                    Reset Goal Weight
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <TextField
                    type='number'
                    label={inputLabel}
                    variant='outlined'
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    sx={{ mb: 2, mr: 1 }}
                    fullWidth
                  />
                  <Stack direction='row' spacing={1}>
                    <Button variant='contained' color='primary' onClick={handleGoalSubmit}>
                      Add Weight
                    </Button>
                    <Button variant='outlined' color='error' onClick={onCancel}>
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Grid2>
  );
};
export default WeightCard;
