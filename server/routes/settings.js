const express = require('express');
const router = express.Router();

const { User, Settings } = require('../db/index');
// GET the user's dashboard settings
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const settings = await Settings.find({ user_id: userId });
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching user dashboard preferences:', error);
    res.status(500).json('Error fetching user dashboard preferences');
  }
});

router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const settings = req.body;
  try {
    const newUserSettings = await Settings.create(settings);
    
    console.log('New user settings saved:', newUserSettings);  //
    res.json({ message: 'new user saved', newUserSettings });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'error saving user', error });
  }
});

router.patch('/:userId', async (req, res) => {
  const {userId} = req.params;
  
  try {
    const setting = await Settings.findOneAndUpdate({user_id: userId}, req.body, { new: true });

    if (!setting) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Settings updated at server')
    res.json({message: 'settings updated', setting});
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error updating settings', error });
  }
});

router.delete('/:userId', async (req, res) => {
  const {userId} = req.params; 
  
  try {
    const settings = await Settings.deleteOne({user_id: userId});
    console.log('reset server success');
    res.json({message: 'user settings reset at server'})

  } catch (error) {
    console.error('reset server', error);
    res.status(500).json({ message: 'Server could not process reset request', error });
  }
});
module.exports = router;