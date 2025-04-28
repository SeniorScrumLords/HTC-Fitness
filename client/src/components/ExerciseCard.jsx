import React, { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import axios from 'axios';

const ExerciseCard = ({ exercise, user, onAddToRoutine }) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);

  const handleInstructionToggle = () => {
    setShowInstructions((prevState) => {
      const newShowInstructions = !prevState;
      if (newShowInstructions) {
        setShowAddButton(true);
      } else {
        setShowAddButton(false);
      }
      return newShowInstructions;
    });
  };

  const formatInstructions = (instructions) => instructions
    .split('. ')
    .map((sentence, index) => (
      <Typography key={index} variant="body1" color="#1976d2" sx={{ mb: 1 }}>
        {sentence}.
      </Typography>
    ));

  return (
    <Card sx={{
      height: '22rem',
      width: '20rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <CardContent sx={{
        overflowY: 'auto',
        flexGrow: 1,
        paddingRight: '1rem',
      }}>
        <Typography variant="h4" component="div">
          {exercise.name}
        </Typography>
        <Typography variant="subtitle1" color="orange">
          Muscle: {
            (exercise.muscle.charAt(0).toUpperCase() + exercise.muscle.slice(1))
              .replace('_', ' ')
          }
        </Typography>
        {!showInstructions && (
          <Typography variant="body2" color="textSecondary">
            Equipment: {exercise.equipment.charAt(0).toUpperCase() + exercise.equipment.slice(1)}
          </Typography>
        )}
        {!showInstructions && (
          <Typography variant="body2" color="textSecondary">
            Difficulty: {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
          </Typography>
        )}
        {showInstructions && (
          <div>
            Instructions: {formatInstructions(exercise.instructions)}
          </div>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleInstructionToggle}>
          {showInstructions ? 'Show Less' : 'Learn More'}
        </Button>
        {showAddButton && (
        //onAddToRoutine is passed from HomePage
//nowcalls correct parent function
<Button onClick={() => onAddToRoutine(exercise)}>Add to Routine</Button>

        )}
      </CardActions>
    </Card>
  );
};

export default ExerciseCard;
