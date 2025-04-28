import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Box, TextField } from '@mui/material';


const ReminderCard = ({user}) => {
  // set state to store reminders
  const [reminders, setReminders] = useState([]);
  // edit reminders( keep track of which reminders are being edited)
    const [editRemindersId, setEditRemindersId] = useState(null);
    const [editReminderInfo, setEditReminderInfo] = useState({ title: '', description: '', date: '' });

  // set new reminders
  const [newReminders, setNewReminders] = useState({
    title: '',
    description: '',
    date: '',
  });
  

  
  
  const cancelEdit = () => {
    setEditRemindersId(null);
  };


  //handle input change for the new reminders
  const handleInputChange = (e) =>{
    setNewReminders({
  ...newReminders,
  [e.target.name]: e.target.value
    })
  }

const handleEditChange = (e) =>{
  setEditReminderInfo({...editReminderInfo, [e.target.name]: e.target.value})
}
  // axios get request
  const getReminders = async () => {
    try {
      const response = await axios.get(`/api/reminders/${user._id}`);
      setReminders(response.data);
    } catch (err) {
      console.error('Cannot get all reminders:', err);
      
    }
  };


  // mounts fetched reminders
  useEffect(() => {
    if (user?._id) {
      getReminders(user._id);
    }
  }, [user]);


  // axios Post
  const postReminders = async () => {
    if (!user?._id) {
      console.error('User is not authenticated');
      return;
    }
  
    try {
      const response = await axios.post(`/api/reminders/${user._id}`, {
        title: newReminders.title,
        description: newReminders.description,
        date: newReminders.date,
      });
  

      setReminders((prevReminders) => [...prevReminders, response.data.newReminder]);
      setNewReminders({
        title: '',
        description: '',
        date: '',
      });
    } catch (err) {
      console.error('Cannot create reminder:', err);
    }
  };
  


  // axios request to update
  const updateReminders = async (id) => {
    axios
      .patch(`/api/reminders/${editRemindersId}`, editReminderInfo)
      .then(() => {
        setEditRemindersId(null);
      getReminders(user._id);
      })
      .catch((err) => {
        console.error(err);
      });
  };



  // Function to mark reminder as complete
  const handleComplete = async (id) => {
    try {
      await axios.patch(`/api/reminders/complete/${id}`);
      setReminders(reminders.map(reminder => 
        reminder._id === id ? { ...reminder, completed: true } : reminder
      ));
    } catch (err) {
      console.error('Error marking reminder as complete:', err);
    }
  };


    // Function to handle delete with double-check confirmation
    const handleDelete = (id) => {
      const isConfirmed = window.confirm('Delete this reminder?');
      if (isConfirmed) {
        deleteReminders(id);
      }
    };

  // axios DELETE reminder
  const deleteReminders = (id) => {
    axios
      .delete(`/api/reminders/${id}`)
      .then(() => {
        setReminders(reminders.filter((reminder) => reminder._id !== id)); // Remove deleted reminder from the state
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "stretch", 
      paddingTop: "40px",
      width: "100%",
      maxWidth: "1000px", 
      margin: "0 auto",
      gap: "2%",
    }}
  >
    {/* "My Reminders" Section */}
    <Box sx={{ width: "42%" }}> 
      <Box
        sx={{
          border: "2px solid #1976d2",
          borderRadius: "8px",
          padding: "8px 16px",
          marginBottom: "20px",
          textAlign: "center",
          backgroundColor: "#e3f2fd",
        }}
      >
        <Typography variant="h5" gutterBottom>My Reminders</Typography>
      </Box>

      <Box
        sx={{
          maxHeight: "350px", 
          overflowY: "auto",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "white",
        }}
      >
        {reminders.length === 0 ? (
          <Typography textAlign="center">No reminders to display</Typography>
        ) : (
          reminders.map((reminder) => (
            <Card key={reminder._id} sx={{ marginBottom: 2 }}>
              <CardContent>
                {editRemindersId === reminder._id ? (
                  <Box>
                    <TextField label="Title" name="title" value={editReminderInfo.title} onChange={handleEditChange} fullWidth />
                    <TextField label="Description" name="description" value={editReminderInfo.description} onChange={handleEditChange} fullWidth multiline />
                    <TextField label="Date" name="date" type="datetime-local" defaultValue={editReminderInfo.date} onChange={handleEditChange} fullWidth />
                    <Box mt={2} display="flex" justifyContent="center" gap={2}>
                      <Button onClick={updateReminders} variant="contained">Save</Button>
                      <Button onClick={cancelEdit} variant="outlined" color="error">Cancel</Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6">{reminder.title}</Typography>
                    <Typography variant="body2">{reminder.description}</Typography>
                    <Typography variant="body2">{new Date(reminder.date).toLocaleString()}</Typography>
                    {reminder.completed && <Typography variant="body2" sx={{ color: "#1976d2" }}>This reminder is completed!</Typography>}
                  </Box>
                )}
                <Box mt={2} display="flex" justifyContent="center" gap={2}>
                  {!editRemindersId && (
                    <>
                      <Button variant="contained" color="primary" onClick={() => handleComplete(reminder._id)} sx={{ flex: 1 }}>Complete</Button>
                      <Button variant="outlined" color="error" onClick={() => handleDelete(reminder._id)} sx={{ flex: 1 }}>Delete</Button>
                      <Button variant="outlined" color="primary" onClick={() => { setEditRemindersId(reminder._id); setEditReminderInfo({ ...reminder, date: reminder.date ? new Date(reminder.date).toISOString().slice(0, 16) : "" }); }} sx={{ flex: 1 }}>Edit</Button>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>

    {/* "Create New Reminder" Section */}
    <Box sx={{ width: "42%" }}> 
      <Box
        sx={{
          border: "2px solid #1976d2",
          borderRadius: "8px",
          padding: "8px 16px",
          marginBottom: "20px",
          textAlign: "center",
          backgroundColor: "#e3f2fd",
        }}
      >
        <Typography variant="h5" gutterBottom>Create New Reminder</Typography>
      </Box>

      <Box
  sx={{
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    backgroundColor: "white",
    maxHeight: "350px", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
  }}
>
  <TextField 
    label="Title" 
    variant="outlined" 
    fullWidth 
    value={newReminders.title} 
    onChange={handleInputChange} 
    name="title" 
    required 
    sx={{ mt: 2 }} 
  />
  <TextField 
    label="Description" 
    variant="outlined" 
    fullWidth 
    value={newReminders.description} 
    onChange={handleInputChange} 
    name="description" 
    multiline 
    sx={{ mt: 2 }} 
  />
  <TextField 
    label="Date" 
    variant="outlined" 
    fullWidth 
    value={newReminders.date} 
    onChange={handleInputChange} 
    name="date" 
    type="datetime-local" 
    sx={{ mt: 2 }} 
  />
  <Button 
    variant="contained" 
    color="primary" 
    onClick={postReminders} 
    sx={{ mt: 2, width: "45%" }}
  >
    Create Reminder
  </Button>
</Box>
    </Box>
  </Box>
  
);


  
};

export default ReminderCard;