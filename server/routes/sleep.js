/* eslint-disable no-console */
const express = require('express');
const { User, Sleep } = require('../db/index');

const router = express.Router();

// NOTE: the parts that check if the given user id actually exists may possibly be redundant
// (further testing needed if time allows it)

// GET the sleep records of a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // reject request if the given user id is invalid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // get the sleep records associated with the user
    const sleepRecords = await Sleep.find({ user_id: userId });
    
    // send back the user's sleep records
    res.status(200).json({ message: 'Sleep records obtained successfully', data: sleepRecords });
  } catch (error) {
    console.error('Error fetching user sleep records:', error);
    res.status(500).json('Error fetching user sleep records');
  }
});

// POST a new sleep record to the db
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const sleepRecord = req.body;

  try {
    // reject request if the given user id is invalid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // add the user id onto the sleepRecord object before it is used to make a new sleep record
    sleepRecord.user_id = userId;

    // create new sleep record
    const newSleepRecord = await Sleep.create(sleepRecord);

    res.json({ message: 'Sleep record saved successfully', data: newSleepRecord });
  } catch (error) {
    console.error('Error saving sleep record:', error);
    res.status(500).json({ message: 'Error saving sleep record', error });
  }
});

// PATCH (update) a sleep record
router.patch('/:userId/:sleepId', async (req, res) => {
  const { userId, sleepId } = req.params;
  const sleepRecord = req.body;

  try {
    // reject request if the given user id is invalid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // update the correct sleep record
    const oldSleepRecord = await Sleep.findByIdAndUpdate(sleepId, sleepRecord);

    // if the findByIdAndUpdate method failed to find a record to update, send back 404 status and message saying that the sleep record couldn't be found
    if (!oldSleepRecord) {
      return res.status(404).json({ message: 'Sleep record to update not found' })
    }

    res.status(200).json({ message: 'Sleep record updated successfully', data: oldSleepRecord });
  } catch (error) {
    console.error('Error updating sleep record:', error);
    res.status(500).json({ message: 'Error updating sleep record', error });
  }
});

router.delete('/:userId/:sleepId', async (req, res) => {
  const { userId, sleepId } = req.params;

  try {
    // reject request if the given user id is invalid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // delete the correct sleep record
    const deletedSleepRecord = await Sleep.findByIdAndDelete(sleepId);

    // if the findByIdAndDelete method failed to find a record to delete, send back 404 status and message saying that the sleep record couldn't be found
    if (!deletedSleepRecord) {
      return res.status(404).json({ message: 'Sleep record to delete not found' })
    }

    res.status(200).json({ message: 'Sleep record deleted successfully', data: deletedSleepRecord });
  } catch (error) {
    console.error('Error deleting sleep record:', error);
    res.status(500).json({ message: 'Error deleting sleep record', error });
  }
});

module.exports = router;
