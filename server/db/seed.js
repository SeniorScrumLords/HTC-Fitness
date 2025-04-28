const mongoose = require('mongoose');
const { Exercise, User, Sleep, Tips } = require('./index');

mongoose.connect('mongodb://localhost:27017/HTC-Fitness');

const exercises = [
  {
    name: 'Push Ups',
    type: 'basic',
    muscle: 'forearms',
    equipment: 'none',
    difficulty: 'beginner',
    instructions: 'Place both palms on the ground, straighten back and legs, lower your body with your shoulders and then push up with your arms.',
  },
  {
    name: 'Sprinting',
    type: 'basic',
    muscle: 'legs',
    equipment: 'shoes',
    difficulty: 'beginner',
    instructions: 'Run as fast as you can for 100 yards, rest for 20 seconds, repeat.',
  },
  {
    name: 'Sit ups',
    type: 'basic',
    muscle: 'abdominal',
    equipment: 'none',
    difficulty: 'beginner',
    instructions: 'Sit on the floor and lay back, place the soles of your feet on the ground with your knees bent. Then push your body up without using your arms so that your face becomes even with your knees. Then lay back and repeat.',
  },
];

const users = [
  {
    _id: 'skotbotblipbloop27',
    googleId: 'plo1',
    nameFirst: 'Bob',
    nameLast: 'Ross',
    email: 'bungholio@beavis',
    goal_weight: 69,
    weights: [],
    saved_exercises: [],
  },
  {
    _id: 'skotbotblipbloop28',
    googleId: 'plo2',
    nameFirst: 'aaa',
    nameLast: 'Ross',
    email: 'bungholio@beavis',
    goal_weight: 69,
    weights: [],
    saved_exercises: [],
  },
  {
    _id: 'skotbotblipbloop29',
    googleId: 'plo3',
    nameFirst: 'tut',
    nameLast: 'Ross',
    email: 'bungholio@beavis',
    goal_weight: 69,
    weights: [],
    saved_exercises: [],
  },
]

const sleepRecords = [
  {
    in_progress: true,
    quality: 0,
    goal: 8,
    hours_slept: 0,
    sleep_aid: '',
    disturbances: 0,
    disturbance_notes: '',
    day: new Date(),
    begin_sleep: new Date(),
    stop_sleep: null,
    user_id: 'skotbotblipbloop27',
  },
  {
    in_progress: false,
    quality: 7,
    goal: 6,
    hours_slept: 8,
    sleep_aid: 'rain sounds',
    disturbances: 0,
    disturbance_notes: 'none',
    day: 'Wed Mar 12 2025 12:04:49 GMT-0500 (Central Daylight Time)',
    begin_sleep: new Date(),
    stop_sleep: new Date(),
    user_id: 'skotbotblipbloop28',
  },
  {
    in_progress: true,
    quality: 7,
    goal: 6,
    hours_slept: 8,
    sleep_aid: 'none',
    disturbances: 1,
    disturbance_notes: 'none',
    day: 'Wed Mar 12 2025 12:04:49 GMT-0500 (Central Daylight Time)',
    begin_sleep: new Date(),
    stop_sleep: null,
    user_id: 'skotbotblipbloop29',
  },
];

const workoutTips = [
  {
    gender: 'male',
    intensity: 1,
    tips: [
      'Stretch like Master Roshi before training!',
      'Take a short walk like Goku on Snake Way.',
      'Do 5 jumping jacks – start your training arc!',
      'Hold a basic plank for 15 seconds – power up your core!',
      'Do slow shoulder rolls – keep your Saiyan posture straight.',
      'Breathe deep like Piccolo – meditation is key to power.',
      'Drink a full glass of water – hydration fuels a warrior.'
    ]
  },
  {
    gender: 'female',
    intensity: 1,
    tips: [
      'Stretch like Bulma before heading on an adventure!',
      'Take a 5-minute stroll – Videl always starts light.',
      'Do 5 bodyweight squats – warm up like Caulifla!',
      'Hold a plank for 15 seconds – core activation like Android 18!',
      'Stretch your arms wide – prepare for an energy blast!',
      'Slow deep breathing like Pan – focus and balance.',
      'Drink a full glass of water – hydration fuels a warrior princess!'
    ]
  },
  {
    gender: 'male',
    intensity: 2,
    tips: [
      'Do 10 push-ups – train like Vegeta before battle.',
      'Hold a plank for 20 seconds – warrior core mode!',
      'Jog in place for 30 seconds – simulate running from Frieza!',
      'Do 5 lunges per leg – build your Saiyan stance.',
      'Shadowbox for 1 minute – fight an imaginary enemy like Gohan!',
      'Practice breathing control – energy management is key!',
      'Drink an extra bottle of water – recovery is essential.'
    ]
  },
  {
    gender: 'female',
    intensity: 2,
    tips: [
      'Do 10 sit-ups – strengthen your core like Android 18!',
      'Hold a squat for 20 seconds – Caulifla would be proud!',
      'Walk briskly for 5 minutes – warm up like Videl.',
      'Do slow kicks like Pan – balance and power!',
      'Try a few slow arm circles – Kefla’s energy training.',
      'Shadowbox for 1 minute – dodge like Android 21!',
      'Drink an extra bottle of water – hydration keeps you strong!'
    ]
  },
  {
    gender: 'male',
    intensity: 3,
    tips: [
      'Sprint in place for 30 seconds – dodge like Goku!',
      'Do 20 jumping jacks – warm-up like Trunks!',
      'Try 15 squats – legs of steel like Broly!',
      'Hold a plank for 30 seconds – tighten your warrior core!',
      'Do 10 push-ups – Vegeta expects perfection!',
      'Do 5 burpees – boost your training level!',
      'Drink a protein shake – fuel up for more power!'
    ]
  },
  {
    gender: 'female',
    intensity: 3,
    tips: [
      'Run up and down stairs for 30 seconds – speed like Videl!',
      'Do 20 jumping jacks – feel the Saiyan energy!',
      'Try 15 bodyweight squats – Caulifla’s battle stance!',
      'Hold a 30-second plank – Android 18’s core strength!',
      'Do 10 tricep dips – increase your warrior endurance!',
      'Do 5 burpees – blast through limits like Kefla!',
      'Eat a protein-rich snack – fuel your energy!'
    ]
  },
  {
    gender: 'male',
    intensity: 4,
    tips: [
      'Sprint for 1 minute – dodge attacks like a pro!',
      'Do 30 squats – prepare for battle!',
      'Hold a 40-second plank – warrior endurance!',
      'Perform 15 push-ups – push your limits!',
      'Do 10 burpees – power through the challenge!',
      'Try 10 high knees – boost your speed!',
      'Eat a balanced meal – you need energy to train!'
    ]
  },
  {
    gender: 'female',
    intensity: 4,
    tips: [
      'Run for 1 minute – stamina like Kefla!',
      'Do 30 lunges – prepare for ultimate mobility!',
      'Hold a plank for 40 seconds – core of a champion!',
      'Perform 15 tricep dips – feel the strength!',
      'Do 10 high knees – move like Android 18!',
      'Try 10 burpees – break through your limits!',
      'Eat a nutrient-rich meal – fuel your power!'
    ]
  },
  {
    'gender': 'male',
    'intensity': 5,
    'tips': [
        'Run for 5 minutes – chase after Beerus!',
        'Do 40 push-ups – Vegeta is watching!',
        'Hold a 50-second plank – abs of steel!',
        'Try 20 burpees – push past the pain!',
        'Perform 30 squats – Saiyan legs activated!',
        'Lift weights – reach your Broly form!',
        'Stretch deeply – recovery matters!'
    ]
},
{
    'gender': 'female',
    'intensity': 5,
    'tips': [
        'Run for 5 minutes – chase your limits!',
        'Do 40 push-ups – push through like Caulifla!',
        'Hold a 50-second plank – unbreakable core!',
        'Try 20 burpees – challenge accepted!',
        'Perform 30 lunges – warrior stance!',
        'Lift weights – strength like Android 18!',
        'Stretch deeply – increase flexibility!'
    ]
},
{
    'gender': 'male',
    'intensity': 6,
    'tips': [
        'Sprint for 3 minutes – lightning-fast reflexes!',
        'Do 50 push-ups – Goku’s training starts now!',
        'Hold a 1-minute plank – Saiyan core activated!',
        'Perform 40 squats – legs of a legend!',
        'Jump rope for 2 minutes – build your speed!',
        'Lift heavy weights – become unstoppable!',
        'Meditate for 5 minutes – balance your ki!'
    ]
},
{
    'gender': 'female',
    'intensity': 6,
    'tips': [
        'Sprint for 3 minutes – legendary speed!',
        'Do 50 push-ups – surpass limits like Kefla!',
        'Hold a 1-minute plank – core of steel!',
        'Perform 40 lunges – battle-tested legs!',
        'Jump rope for 2 minutes – enhance stamina!',
        'Lift heavy weights – reach peak form!',
        'Meditate for 5 minutes – control your power!'
    ]
},
{
    'gender': 'male',
    'intensity': 7,
    'tips': [
        'Ultra Instinct unlocked – full-body HIIT!',
        '100 push-ups – true warrior strength!',
        '1-minute plank – Goku’s level core!',
        '50 burpees – extreme endurance!',
        'Sprint for 5 minutes – speed of a god!',
        'Lift your max – Broly-like power!',
        'Recover with meditation – master your ki!'
    ]
},
{
    'gender': 'female',
    'intensity': 7,
    'tips': [
        'Ultra Instinct mode – train like a goddess!',
        '100 push-ups – maximum strength!',
        '1-minute plank – Android 18 core!',
        '50 burpees – battle-proven endurance!',
        'Sprint for 5 minutes – unstoppable speed!',
        'Lift your max – energy like Kefla!',
        'Recover with deep meditation – balance your strength!'
    ]
}
];
Exercise.insertMany(exercises)
  .then(() => {
    console.log('Exercises inserted successfully!');
    // mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error inserting exercises:', err);
    mongoose.connection.close();
  });

Sleep.insertMany(sleepRecords)
  .then(() => {
    console.log('Sleep records inserted successfully!');
    // mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error inserting sleep records:', err);
    mongoose.connection.close();
  });

  Tips.deleteMany({})
  .then(() => {
    console.log('Previous workout tips deleted successfully!');
    return Tips.insertMany(workoutTips);
  })
  .then(() => {
    console.log('Workout tips inserted successfully!');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error seeding workout tips:', err);
    mongoose.connection.close();
  });

// User.insertMany(users)
//   .then(() => {
//     console.log('Users inserted successfully!');
//     // mongoose.connection.close();
//   })
//   .catch((err) => {
//     console.error('Error inserting users:', err);
//     mongoose.connection.close();
//   });
