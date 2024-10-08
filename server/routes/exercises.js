const express = require('express');
const axios = require('axios');

const router = express.Router();

const API_URL = 'https://api.api-ninjas.com/v1/exercises';

// Route to fetch exercises
router.get('/', async (req, res) => {
  try {
    // Fetch data from API Ninjas
    const response = await axios.get(API_URL, {
      headers: {
        'X-Api-Key': `${process.env.API_KEY}`,
      },
    });

    const exercises = response.data;

    res.status(200).send(exercises);
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).send('Error fetching data from API.');
  }
});

// Route to fetch bicep exercises
router.get('/biceps', async (req, res) => {
  try {
    // Fetch data from API Ninjas
    const response = await axios.get(`${API_URL}?muscle=biceps`, {
      headers: {
        'X-Api-Key': `${process.env.API_KEY}`,
      },
    });

    const exercises = response.data;

    res.status(200).send(exercises);
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).send('Error fetching data from API.');
  }
});

// Route to fetch quads exercises
router.get('/quads', async (req, res) => {
  try {
    // Fetch data from API Ninjas
    const response = await axios.get(`${API_URL}?muscle=quadriceps`, {
      headers: {
        'X-Api-Key': `${process.env.API_KEY}`,
      },
    });

    const exercises = response.data;

    res.status(200).send(exercises);
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).send('Error fetching data from API.');
  }
});

module.exports = router;
