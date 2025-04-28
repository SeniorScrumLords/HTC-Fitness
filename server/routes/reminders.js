const express = require('express');
const { User, Reminder } = require('../db/index');


const router = express.Router();

// GET: fetch all reminders for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const reminders = await Reminder.find({ user_id: userId }); //make  sure user_id exists in DB
    res.status(200).json(reminders);
  } catch (error) {
    console.error('Failure to find reminders:', error);
    res.status(500).json({ error: 'Error fetching user reminders' });
  }
});




    router.post('/:userId', async (req, res) => {
      const { userId } = req.params;  // Get userId from  params
      const { title, description, date } = req.body; // Destructure data from the request body
    
      try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
          console.log('User not found');
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Create a new reminder
        const newReminder = await Reminder.create({
          title,
          description,
          date,
          user_id: userId, // Set user_id based on the userId 
        });
    
        // Send the response with the newly created reminder
        res.status(201).json({ message: 'Reminder created successfully', newReminder });
      } catch (error) {
        console.error('Error saving reminder:', error);
        res.status(500).json({ message: 'Error saving reminder', error });
      }
    });
  
// UPDATE
router.patch('/:id', async (req, res) => {
  try {
    const updatedReminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.status(200).json(updatedReminder);
  } catch (err) {
    console.error('Failure to update reminder:', err);
    res.status(500).json({ message: 'Error updating reminder', error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deletedReminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!deletedReminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.status(200).json({ message: 'Reminder deleted' });
  } catch (err) {
    console.error('Failure to delete reminder:', err);
    res.status(500).json({ message: 'Error deleting reminder', error: err.message });
  }
});


// patch for completed task 
router.patch('/complete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Find the reminder by ID and update the 'completed' field
    const reminder = await Reminder.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    );
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.status(200).json(reminder);
  } catch (error) {
    console.error('Error marking reminder as complete:', error);
    res.status(500).json({ message: 'Failed to update reminder' });
  }
});
module.exports = router;
