import React from 'react';
import { Grid2, Typography } from '@mui/material';
import ExerciseCard from './ExerciseCard.jsx';

const HomePage = ({ user, exercises }) => {
  const userName = user ? user.nameFirst : '';
  const userId = user._id;
  
  return (
    <div>
      <Typography variant="h4" gutterBottom align="center">
      {`Welcome, ${userName}, to the Hyperbolic Time Chamber`}
      </Typography>
      {exercises.length > 0 ? (
          <Grid2 container spacing={2} alignItems="stretch" paddingLeft="6rem">
            {exercises.map((exercise, index) => (
              <Grid2 xs={12} sm={6} md={4} key={index}>
                <ExerciseCard exercise={ exercise } userId={ userId }/>
              </Grid2>
            ))}
          </Grid2>
      ) : (
        <Typography variant="body1">
        No exercises found.
      </Typography>
      )}
    </div>
  );
};

export default HomePage;
