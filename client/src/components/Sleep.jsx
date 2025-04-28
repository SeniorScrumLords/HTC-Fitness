/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Grid2,
  Snackbar,
  Typography,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Chip,
  Box,
  Card,
  Container,
  Slider,
  Button,
  ButtonGroup,
  Stack,
  TextField
} from '@mui/material';
import {
  Stars,
  Circle,
  Delete,
  ChangeCircle,
  PlayArrow,
  Stop,
  CheckCircle,
  CheckCircleOutline
} from '@mui/icons-material';
import dayjs from 'dayjs';
import axios from 'axios';

const Sleep = ({ user }) => {
  // create states for the sleep records table and the main sleep record to be displayed
  const [sleepRecords, setSleepRecords] = useState([]);
  const [sleepRecord, setSleepRecord] = useState({});

  // create a state to use as a flag to know when to prevent useEffect from running getSleepRecords
  // (prevents an infinite loop that is caused when sleepRecords is empty)
  const [stopRecordsRenderLoop, setStopRecordsRenderLoop] = useState(false);

  // create a state that will be the time since the start of the timer on the current sleep record, allowing it to approximately give you the
  // amount of time since the current sleep record started its timer. This state will be updated on startup and every
  // second after that, allowing for real-time time tracking.
  const [masterTimer, setMasterTimer] = useState('0:0:0');

  // create a default sleep record with default values to reference for filling out field values and for axios requests
  const defaultRecord = {
    quality: null,
    goal: 8,
    hours_slept: '00:00:00',
    sleep_aid: 'none',
    disturbances: 0,
    disturbance_notes: 'none',
    begin_sleep: null,
    stop_sleep: null,
  }

  // create a state to keep track of the field values that will be used in PATCH requests
  // insert pre_goal and pre_sleep_aid properties to keep track of field values used in POST requests
  const [fieldValues, setFieldValues] = useState({
    pre_goal: 8,
    pre_sleep_aid: 'none',
    ...defaultRecord
  });

  // run on startup and whenever sleepRecords is changed
  useEffect(() => {
    // if sleepRecords is empty and the stopRecordsRenderLoop state/flag hasn't been tripped yet
    if(sleepRecords.length === 0 && !stopRecordsRenderLoop) {
      // set the stopRecordsRenderLoop state/flag to true;
      setStopRecordsRenderLoop(true);
      // get the user's sleep records if they aren't set in state yet
      getSleepRecords();
    } else if (sleepRecords.length !== 0 && (!sleepRecord._id || !sleepRecords.includes(sleepRecord))) {
      // otherwise if the main sleep record hasn't been set in state yet and if either sleepRecords isn't empty or sleepRecord was deleted,
      // find the first sleep record that is 'in progress' (has null for stop_sleep property) and assign the record to be the value of the state's main sleep record
      let found = false;
      for (let i = 0; i < sleepRecords.length; i++) {
        if (sleepRecords[i].stop_sleep === null) {
          found = true;
          setSleepRecord(sleepRecords[i]);
          break;
        }
      }

      // if an 'in progress' sleep record can't be found, use the most recent record instead
      if (!found) {
        setSleepRecord(sleepRecords[0]);
      }
    }
  }, [sleepRecords]);

  // run on startup and whenever sleepRecord is changed
  useEffect(() => {
    // if sleepRecord has been set to a proper sleep record
    if (sleepRecord._id) {
      // then set the field values in state to represent the current sleep record
      let newFieldValues = {};
      // loop through the field values in state
      for (let key in fieldValues) {
        if (key === 'pre_goal') {
          // set pre_goal to default value
          newFieldValues.pre_goal = 8;
        } else if (key === 'pre_sleep_aid') {
          // set pre_sleep_aid to default value
          newFieldValues.pre_sleep_aid = 'none';
        } else {
          // give newFieldValues the value in sleepRecord associated with the current key
          newFieldValues[key] = sleepRecord[key];
        }
      }
      // replace the current field values in state with newFieldValues
      setFieldValues(newFieldValues);
      // trigger the master timer
      setMasterTimer('starting');
    }
  }, [sleepRecord]);

  // run on startup and whenever masterTimer is changed
  useEffect(() => {
    // if the sleep record is 'in progress'
    if (sleepRecord.begin_sleep && sleepRecord.stop_sleep === null) {
      // if masterTimer is set to 'starting', then instantly set master timer to the time between begin_sleep and now
      if (masterTimer === 'starting') {
        let timeInSeconds = dayjs().diff(sleepRecord.begin_sleep, 's');
        const seconds = timeInSeconds % 60;
        timeInSeconds -= seconds;
        const minutes = Math.floor(timeInSeconds / 60) % 60;
        timeInSeconds -= (minutes * 60);
        const hours = Math.floor((timeInSeconds / 60) / 60);
        setMasterTimer(`${hours}:${minutes}:${seconds}`);
      } else {
        // else, set master timer to the time between begin_sleep and now (in 1-second intervals)
        setTimeout(() => {
          let timeInSeconds = dayjs().diff(sleepRecord.begin_sleep, 's');
          const seconds = timeInSeconds % 60;
          timeInSeconds -= seconds;
          const minutes = Math.floor(timeInSeconds / 60) % 60;
          timeInSeconds -= (minutes * 60);
          const hours = Math.floor((timeInSeconds / 60) / 60);
          setMasterTimer(`${hours}:${minutes}:${seconds}`);
        }, 1000);
      }
    } else if (sleepRecord.stop_sleep) {
      // set the master timer to be the sleep record's total sleep time (between start and end of sleep)
      let timeInSeconds = dayjs(sleepRecord.stop_sleep).diff(sleepRecord.begin_sleep, 's');
      const seconds = timeInSeconds % 60;
      timeInSeconds -= seconds;
      const minutes = Math.floor(timeInSeconds / 60) % 60;
      timeInSeconds -= (minutes * 60);
      const hours = Math.floor((timeInSeconds / 60) / 60);
      setMasterTimer(`${hours}:${minutes}:${seconds}`);
    }
  }, [masterTimer]);

  // GET sleep records
  const getSleepRecords = () => {
    axios.get(`/api/sleep/${user._id}`)
    .then(sleepRecordsObj => {
      console.log('GET');
      console.log(sleepRecordsObj);
      // assign the obtained records to the sleepRecords state
      setSleepRecords(sleepRecordsObj.data.data);
    })
    .catch(err => {
      console.error('Failed to find sleep records', err)
    });
  }

  // POST new (unfinished) sleep record
  const postSleepRecord = () => {
    // create copy of defaultRecord object and name it 'input'
    const input = {...defaultRecord};

    // Replace the goal and sleep_aid properties with values from the 'pre' properties in the input fields
    input.goal = fieldValues.pre_goal;
    input.sleep_aid = fieldValues.pre_sleep_aid;

    // use current date for begin_sleep
    input.begin_sleep = dayjs();

    // use the input object to make a new sleep record
    axios.post(`/api/sleep/${user._id}`, input)
    .then(newSleepRecordObj => {
      console.log('POST');
      console.log(newSleepRecordObj);
      // refresh sleep records in state
      getSleepRecords();
    })
    .catch(err => {
      console.error('Failed to find sleep records', err)
    });
  }

  // PATCH new sleep record
  const patchSleepRecord = (isResultOfStopTimer) => {
    // create an empty object and name it 'input'
    const input = {};

    // if patchSleepRecord was the result of stopping the sleep timer, then patch only the stop_sleep and hours_slept properties
    if (isResultOfStopTimer) {
      // assign current date to input as the value of stop_sleep
      input.stop_sleep = dayjs();
      // assign masterTimer's current value to input.hours_slept
      input.hours_slept = masterTimer;

    } else if (sleepRecord.stop_sleep !== null) {
      // otherwise (if the current sleep record's end time is not null), loop through the field values
      for (let key in fieldValues) {
        // check if the field value is a 'pre' value
        if (key === 'pre_goal' || key === 'pre_sleep_aid') {
          // stop the current loop cycle
          continue;
        }

        if (fieldValues[key] !== sleepRecord[key]) {
          // only insert properties that are actually changing
          input[key] = fieldValues[key];
        }
      }
    } else {
      // stop the function otherwise
      console.error(`you can't modify a record whose timer hasn't ended`);
      return;
    }

    // figure out how close the time slept was to the goal time, and then turn that result into a whole number (out of 7) that is then set to input.quality
    // CURRENTLY USING LOW-ACCURACY BUT EASY-TO-UNDERSTAND LOGIC FOR RATING, MAY REPLACE IF TIME ALLOWS
    let timeSlept = sleepRecord.hours_slept === '00:00:00' ? masterTimer.split(':') : sleepRecord.hours_slept.split(':');
    let score = 7;
    let comparison = Math.abs(sleepRecord.goal - Number(timeSlept[0]));
    input.quality = score - comparison;

    // use the input object to alter the current sleep record
    axios.patch(`/api/sleep/${user._id}/${sleepRecord._id}`, input)
    .then(oldSleepRecordObj => {
      console.log('PATCH');
      console.log(oldSleepRecordObj);
      // refresh sleep records in state
      getSleepRecords();
    })
    .catch(err => {
      console.error('Failed to find sleep records', err)
    });
  }

  // DELETE sleep record
  const deleteSleepRecord = (id) => {
    // delete the sleep record associated with the given input id
    axios.delete(`/api/sleep/${user._id}/${id}`)
    .then(deletedSleepRecordsObj => {
      console.log('DELETE');
      console.log(deletedSleepRecordsObj);
      // refresh sleep records in state
      getSleepRecords();
    })
    .catch(err => {
      console.error('Failed to find sleep records', err)
    });
  }

  // resolve quality rating
  const resolveRating = (quality) => {
    if (quality === null) {
      // return string if no rating
      return 'no rating yet'
    } else {
      // return rating component otherwise
      return (
        <Rating
          name='Sleep Rating'
          value={quality}
          max={7}
          icon={<Stars fontSize='inherit' />}
          emptyIcon={<Circle fontSize='inherit' />}
          readOnly
        />
      )
    }
  }

  // updates the corresponding property in the fieldValues state when an input field is interacted with
  const updateFieldInput = (type, val) => {
    setFieldValues(currentFieldValues => {
      const copy = {...currentFieldValues};
      copy[type] = val;
      return copy;
    })
  }

  return (
    <div>
      <Box sx={{ p: 2 }}>
        <Container maxWidth='lg'>
          <Box sx={{ bgcolor: '#cfe8fc', height: '5vh' }} />
          <Card component={Card} variant='outlined' sx={{ minWidth: 300, maxWidth: 'lg', textAlign: 'center', bgcolor: 'primary' }}>
            {/* Display the "time slept" for the current sleepRecord */}
            <Typography variant='h1' textAlign='center' fontSize={90} color={sleepRecord.stop_sleep ? 'white' : 'gray'}>
              {masterTimer}
            </Typography>
            <Divider />
            <Box component={Paper} variant='outlined'>
              <Typography variant='h3' textAlign='center'>
                Inputs for New Sleep Record
              </Typography>
              <Stack direction='column' spacing={5}>
                <Box display="flex">
                  Goal (Hours):&nbsp;
                  <Typography color='gray'>
                    {fieldValues.pre_goal}&nbsp;
                  </Typography>
                  <Slider valueLabelDisplay="auto" value={fieldValues.pre_goal} step={1} marks min={0} max={24} onChange={e => {updateFieldInput('pre_goal', e.target.value)}} />
                </Box>
                <Box display="flex">
                  Sleep Aid:&nbsp;
                  <Typography color='gray'>
                    {fieldValues.pre_sleep_aid}&nbsp;
                  </Typography>
                  <TextField label="Describe items used to help you sleep" variant="outlined" value={fieldValues.pre_sleep_aid} onChange={e => {updateFieldInput('pre_sleep_aid', e.target.value)}} />
                </Box>
              </Stack>
            </Box>
            <Box component={Paper} variant='outlined' display="flex" justifyContent="center" alignItems="center" fontSize={30} sx={{ minWidth: 300, maxWidth: 'lg' }}>
              <Stack direction='row' spacing={5}>
                <Box display="flex">
                  <PlayArrow fontSize='inherit' />
                  <Chip label='Start Sleep Timer' variant='outlined' onClick={postSleepRecord} />
                </Box>
                <Divider variant='middle' orientation='vertical' flexItem />
                <Box display="flex">
                  <Stop fontSize='inherit' />
                  <Chip label='Stop Sleep Timer' variant='outlined' onClick={() => {patchSleepRecord(true)}} />
                </Box>
              </Stack>
            </Box>
            <Divider />
            <Box component={Paper} variant='outlined'>
              <Typography variant='h3' textAlign='center'>
                Inputs for Selected Sleep Record
              </Typography>
              <Stack direction='column' spacing={5}>
                <Box display="flex">
                  Goal (Hours):&nbsp;
                  <Typography color='gray'>
                    {fieldValues.goal}&nbsp;
                  </Typography>
                  <Slider valueLabelDisplay="auto" value={fieldValues.goal} step={1} marks min={0} max={24} onChange={e => {updateFieldInput('goal', e.target.value)}} />
                </Box>
                <Box display="flex">
                  Time Slept (H:M:S):&nbsp;
                  <Typography color='gray'>
                    {fieldValues.hours_slept}&nbsp;
                  </Typography>
                  <TextField label="Insert time you slept (H:M:S)" variant="outlined" value={fieldValues.hours_slept} onChange={e => {updateFieldInput('hours_slept', e.target.value)}} />
                </Box>
                <Box display="flex">
                  Sleep Aid:&nbsp;
                  <Typography color='gray'>
                    {fieldValues.sleep_aid}&nbsp;
                  </Typography>
                  <TextField label="Describe items used to help you sleep" variant="outlined" value={fieldValues.sleep_aid} onChange={e => {updateFieldInput('sleep_aid', e.target.value)}} />
                </Box>
                <Box display="flex">
                  Disturbance Count:&nbsp;
                  <Typography color='gray'>
                    {fieldValues.disturbances}&nbsp;
                  </Typography>
                  <Slider valueLabelDisplay="auto" value={fieldValues.disturbances} step={1} marks min={0} max={10} onChange={e => {updateFieldInput('disturbances', e.target.value)}} />
                  {/* <TextField label="Insert number of disturbances" variant="outlined" value={fieldValues.disturbances} onChange={e => {updateFieldInput('disturbances', e.target.value)}} /> */}
                </Box>
                <Box display="flex">
                  Time Sleep Began:&nbsp;
                  <Typography color='gray'>
                    {fieldValues.begin_sleep ? dayjs(fieldValues.begin_sleep).format('YYYY-MM-DD hh:mm:ss A') : 'not set'}&nbsp;
                  </Typography>
                  <TextField label="Insert time when sleep began" variant="outlined" value={fieldValues.begin_sleep === null ? 'null' : fieldValues.begin_sleep} onChange={e => {updateFieldInput('begin_sleep', e.target.value)}} />
                </Box>
                <Box display="flex">
                  Time Sleep Ended:&nbsp;
                  <Typography color='gray'>
                    {fieldValues.stop_sleep ? dayjs(fieldValues.stop_sleep).format('YYYY-MM-DD hh:mm:ss A') : 'not set'}&nbsp;
                  </Typography>
                  <TextField label="Insert time when sleep ended" variant="outlined" value={fieldValues.stop_sleep === null ? 'null' : fieldValues.stop_sleep} onChange={e => {updateFieldInput('stop_sleep', e.target.value)}} />
                </Box>
                <Box display="flex">
                  Disturbance Notes:&nbsp;
                  <Typography color='gray'>
                    {fieldValues.disturbance_notes}&nbsp;
                  </Typography>
                  <TextField label="Describe sleep disturbances" variant="outlined" value={fieldValues.disturbance_notes} onChange={e => {updateFieldInput('disturbance_notes', e.target.value)}} />
                </Box>
              </Stack>
            </Box>
            <Box component={Paper} variant='outlined' display="flex" justifyContent="center" alignItems="center" fontSize={30} sx={{ minWidth: 300, maxWidth: 'lg' }}>
              <Stack direction='row' spacing={5}>
                <Box display="flex">
                  <ChangeCircle fontSize='inherit' />
                  <Chip label='Update Current' variant='outlined' onClick={() => {patchSleepRecord(false)}} color={sleepRecord.stop_sleep === null ? 'error' : 'primary'} />
                </Box>
                <Divider variant='middle' orientation='vertical' flexItem />
                <Box display="flex">
                  <Delete fontSize='inherit' />
                  <Chip label='Delete Current' variant='outlined' onClick={() => {deleteSleepRecord(sleepRecord._id)}} />
                </Box>
              </Stack>
            </Box>
          </Card>
        </Container>
      </Box>
      <Divider variant='middle' />
      <Box sx={{ p: 2 }}>
        <Box sx={{ bgcolor: '#cfe8fc', height: '2vh' }} />
        {/* Table to hold all of the user's sleep records */}
        <TableContainer component={Paper} variant='outlined'>
          <Table sx={{ minWidth: 700 }} aria-label='sleep records'>
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell align='right'>Time Slept (H:M:S)</TableCell>
                <TableCell align='right'>Hours Goal</TableCell>
                <TableCell align='right'>Disturbances</TableCell>
                <TableCell align='right'>Disturbance Notes</TableCell>
                <TableCell align='right'>Sleep Aid Used</TableCell>
                <TableCell align='right'>Sleep Starting Time</TableCell>
                <TableCell align='right'>Sleep Ending Time</TableCell>
                <TableCell align='right'>Sleep Rating</TableCell>
                <TableCell align='right'>Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sleepRecords.map((sleepRecordObj) => (
                <TableRow
                  key={sleepRecordObj._id}
                  sx={{ '&:last-child th': { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>
                    {dayjs(sleepRecordObj.begin_sleep).format('YYYY-MM-DD')}
                  </TableCell>
                  <TableCell align='right'>{sleepRecordObj.hours_slept}</TableCell>
                  <TableCell align='right'>{sleepRecordObj.goal}</TableCell>
                  <TableCell align='right'>{sleepRecordObj.disturbances}</TableCell>
                  <TableCell align='right'>{sleepRecordObj.disturbance_notes}</TableCell>
                  <TableCell align='right'>{sleepRecordObj.sleep_aid}</TableCell>
                  <TableCell align='right'>{sleepRecordObj.begin_sleep ? dayjs(sleepRecordObj.begin_sleep).format('YYYY-MM-DD hh:mm:ss A') : 'not set'}</TableCell>
                  <TableCell align='right'>{sleepRecordObj.stop_sleep ? dayjs(sleepRecordObj.stop_sleep).format('YYYY-MM-DD hh:mm:ss A') : 'not set'}</TableCell>
                  <TableCell align='right'>
                    {resolveRating(sleepRecordObj.quality)}
                  </TableCell>
                  <TableCell align='right'>
                    <ButtonGroup variant='contained' aria-label='quick select and delete'>
                      <Button onClick={() => {
                        setSleepRecord(sleepRecordObj);
                      }}>
                        {sleepRecordObj._id === sleepRecord._id ? <CheckCircle fontSize='inherit' /> : <CheckCircleOutline fontSize='inherit' /> }
                        Select
                      </Button>
                      <Button onClick={() => {deleteSleepRecord(sleepRecordObj._id)}}>
                        <Delete fontSize='inherit' />
                        Delete
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default Sleep;
