import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Routines = ({ userId }) => {
  const [routineData, setRoutineData] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user's saved routines
  const fetchSavedExercises = async () => {
    try {
      const response = await axios.get(`/api/routines/${userId}`);
      setRoutineData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching routines:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedExercises();
    //re runs when routines changes
  }, [routineData]);

   // function to add an exercise to the routine
  //  const handleAddToRoutine = async (exercise) => {
  //   console.log(userId)
  //   try {
  //     const response = await axios.post(`/api/routines/${userId._id}`, {
  //       userId,
  //       exercise: exercise.name,
  //       muscle: exercise.muscle,
  //       sets: 3,
  //       reps: 10,
  //       weight: 50, // Default values
  //     });

      // update routine list with new exercise
      // setRoutineData((prevData) => [...prevData, response.data]);

  //     // alert(`Exercise added to routine! ${ userId }`);
  //   } catch (error) {
  //     console.error('Error adding exercise:', error);
  //     alert('Failed to add exercise.');
  //   }
  // };

  // Handle input changes
  const handleChange = (field, value) => {
    setSelectedRoutine((prev) => ({ ...prev, [field]: value }));
  };

  // Handle update request
  const handleSubmit = async () => {
    try {
      await axios.patch(`/api/routines/${selectedRoutine._id}`, selectedRoutine);
      alert('Routine updated successfully!');
      setSelectedRoutine(null); // Hide form after update
      fetchSavedExercises();
    } catch (error) {
      console.error('Error updating routine:', error);
      alert('Failed to update routine.');
    }
  };

  // Handle delete request
  const handleDeleteRoutine = async (routineId) => {
    try {
      await axios.delete(`/api/routines/${routineId}`);
      alert('Routine deleted successfully!');
      fetchSavedExercises();
    } catch (error) {
      console.error('Error deleting routine:', error);
      alert('Failed to delete routine.');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        My Workout Routine
      </Typography>

      {/* Section: List All Saved Routines */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h5" align="center" color="primary">
          My Saved Routines
        </Typography>
        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 3 }} />
        ) : (
          <List>
            {routineData.map((routine) => (
              <ListItem key={routine._id} divider>
                <ListItemText
                  primary={`${routine.exercise} - ${routine.muscle}`}
                  secondary={`Sets: ${routine.sets}, Reps: ${routine.reps}, Weight: ${routine.weight} lbs`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" color="primary" onClick={() => setSelectedRoutine(routine)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" color="error" onClick={() => handleDeleteRoutine(routine._id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Section: Routine Edit Form (Shown Only When Editing) */}
      {selectedRoutine && (
        <Card sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
          <CardContent>
            <Typography variant="h5">{selectedRoutine.exercise}</Typography>
            <Typography variant="body2" color="textSecondary">
              Muscle Group: {selectedRoutine.muscle}
            </Typography>
            <TextField
              type="number"
              label="Sets"
              value={selectedRoutine.sets || ''}
              onChange={(e) => handleChange('sets', e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              type="number"
              label="Reps"
              value={selectedRoutine.reps || ''}
              onChange={(e) => handleChange('reps', e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              type="number"
              label="Weight (lbs)"
              value={selectedRoutine.weight || ''}
              onChange={(e) => handleChange('weight', e.target.value)}
              fullWidth
              margin="normal"
            />
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setSelectedRoutine(null)}>
              Cancel
            </Button>
          </CardActions>
        </Card>
      )}
    </Box>
  );
};

export default Routines;

// import React, { useState, useEffect } from 'react';
// import {
//   Button,
//   Card,
//   CardActions,
//   CardContent,
//   Grid,
//   TextField,
//   Typography,
//   IconButton,
//   CircularProgress,
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import axios from 'axios';

// const Routines = ({ userId }) => {
//   // state variables to store routine data, total weight lifted and loading status
//   const [routineData, setRoutineData] = useState([]);
//   const [totalWeightLifted, setTotalWeightLifted] = useState([]);
//   const [loading, setLoading] = useState(true);

//   //fetch saved exercises from the backend
//   const fetchSavedExercises = async () => {
//     try {
//       const response = await axios.get(`/api/routines/${userId}`);
//       setRoutineData(response.data);
//       calculateTotalWeight(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching exercises:', error);
//       setLoading(false);
//     }
//   };

//   // useEffect hook to fetch exercises when userId changes
//   useEffect(() => {
//     fetchSavedExercises();
//   }, [userId]);

//   // calculate the total weight lifted across all routines
//   const calculateTotalWeight = (routines) => {
//     const total = routines.reduce((acc, exercise) => acc + (exercise.weight * exercise.reps * exercise.sets), 0);
//     setTotalWeightLifted(total);
//   };

//   // Handle input changes for exercises (sets, reps, weight)
//   const handleChange = (index, field, value) => {
//     const updatedData = [...routineData];
//     updatedData[index][field] = value;
//     setRoutineData(updatedData);
//   };

//   // handle saving updated routine data to the backend
//   const handleSubmit = async () => {
//     try {
//       await Promise.all(
//         routineData.map((exercise) =>
//           axios.patch(`/api/routines/${exercise._id}`, {
//             sets: exercise.sets,
//             reps: exercise.reps,
//             weight: exercise.weight,
//           })
//         )
//       );
//       alert('Routine updated successfully!');
//       fetchSavedExercises();
//     } catch (error) {
//       console.error('Error updating routine:', error);
//       alert('Failed to update routine.');
//     }
//   };

//   // handle deleting an exercise from a routine
//   const handleDeleteExercise = async (exerciseId) => {
//     try {
//       await axios.delete(`/api/routines/${exerciseId}`);
//       alert('Exercise deleted successfully!');
//       fetchSavedExercises();
//     } catch (error) {
//       console.error('Error deleting exercise:', error);
//       alert('Failed to delete exercise.');
//     }
//   };

//   return (
//     <div>
//       {/* Page title & total weight lifted summary */}
//       <Typography variant="h4" gutterBottom align="center">
//         My Workout Routine
//       </Typography>
//       <Typography variant="h6" align="center" color="primary">
//         Total Weight Lifted: {totalWeightLifted} lbs
//       </Typography>
      
//       {/* Show loading indicator while fetching data */}
//       {loading ? (
//         <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 3 }} />
//       ) : (
//         <Grid container spacing={2} justifyContent="center">
//           {routineData.map((exercise, index) => (
//             <Grid item xs={12} sm={6} md={4} key={exercise._id}>
//               <Card sx={{ height: '100%' }}>
//                 <CardContent>
//                   <Typography variant="h5">{exercise.exercise}</Typography>
//                   <Typography variant="body2" color="textSecondary">
//                     {`Muscle: ${exercise.muscle.charAt(0).toUpperCase() + exercise.muscle.slice(1)}`}
//                   </Typography>
                  
//                   {/* Input fields for modifying sets, reps, and weight */}
//                   <TextField
//                     type="number"
//                     label="Sets"
//                     value={exercise.sets || ''}
//                     onChange={(e) => handleChange(index, 'sets', e.target.value)}
//                     fullWidth
//                     margin="normal"
//                   />
//                   <TextField
//                     type="number"
//                     label="Reps"
//                     value={exercise.reps || ''}
//                     onChange={(e) => handleChange(index, 'reps', e.target.value)}
//                     fullWidth
//                     margin="normal"
//                   />
//                   <TextField
//                     type="number"
//                     label="Weight (lbs)"
//                     value={exercise.weight || ''}
//                     onChange={(e) => handleChange(index, 'weight', e.target.value)}
//                     fullWidth
//                     margin="normal"
//                   />
//                 </CardContent>
                
//                 {/* Delete exercise button */}
//                 <CardActions>
//                   <IconButton
//                     aria-label="delete"
//                     color="error"
//                     onClick={() => handleDeleteExercise(exercise._id)}
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
      
//       {/* Save button for submitting updated routine */}
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleSubmit}
//         sx={{ mt: 3, display: 'block', margin: 'auto' }}
//       >
//         Save Routine
//       </Button>
//     </div>
//   );
// };

// export default Routines;
