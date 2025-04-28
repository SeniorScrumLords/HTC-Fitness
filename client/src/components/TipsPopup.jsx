import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog } from '@mui/material';
import axios from 'axios';

const TipsPopup = ({ userId, tipsEnabled, setTipsEnabled }) => {
    const [tip, setTip] = useState("");
    const [intensity, setIntensity] = useState(1);
    const [gender, setGender] = useState("male");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (userId && tipsEnabled) {
            fetchTips();
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [userId, tipsEnabled]);

    const fetchTips = async () => {
        try {
            console.log("Fetching tips for userId:", userId);
            if (!userId || userId.length !== 24) {
                console.error("Invalid userId passed:", userId);
                return;
            }

            const response = await axios.get(`/api/tips/${userId}`);
            console.log("API Response:", response.data);

            if (response.data) {
                setTip(response.data.tip || "No tips available for this level.");
                setIntensity(response.data.intensity || 1);
                setGender(response.data.gender || "male");
                setTipsEnabled(true);
            }
        } catch (error) {
            console.error('Error fetching tips:', error);
        }
    };

    const updateIntensity = async () => {
        if (intensity < 7) {
            try {
                const newIntensity = intensity + 1;
                await axios.patch(`/api/tips/${userId}`, { intensity: newIntensity });

                setIntensity(newIntensity);
                fetchTips();
            } catch (error) {
                console.error('Error updating intensity:', error);
            }
        }
    };

    const deleteTips = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your workout tips?");
        if (!confirmDelete) return;

        try {
            console.log("Deleting tips for userId:", userId);
            await axios.delete(`/api/tips/${userId}`);

            setTipsEnabled(false);
            setOpen(false);
            console.log("Tips deleted successfully.");
        } catch (error) {
            console.error("Error deleting tips:", error);
        }
    };

    if (!tipsEnabled) return null;

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <Box p={3} textAlign="center">
                <Typography variant="h6">Daily Workout Tip</Typography>

                <Typography variant="body1" mt={2}>
                    {tip || "Loading tips..."}
                </Typography>

                <Typography variant="body2">Current Intensity: {intensity}</Typography>

                <Box mt={2}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={updateIntensity} 
                        disabled={intensity >= 7}
                    >
                        Increase Intensity
                    </Button>

                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={deleteTips}
                    >
                        Delete Tips
                    </Button>

                    <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default TipsPopup;