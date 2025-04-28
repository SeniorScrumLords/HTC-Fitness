/* eslint-disable no-console */
const express = require('express');
const { User, Tips } = require('../db/index'); 
// change Tip to Tips line 22 example
const router = express.Router();
const mongoose = require("mongoose");




router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // make the userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId format" });
        }

        // find the user's tips entry
        let userTips = await Tips.findOne({ userId: new mongoose.Types.ObjectId(userId) });

        // if no tips exist for the user create a default entry
        if (!userTips) {
            const defaultTips = {
                userId: new mongoose.Types.ObjectId(userId),
                gender: "male", // default gender
                intensity: 1, // default intensity
                tipsEnabled: true,
                tips: [
                    "Stay hydrated!",
                    "Take deep breaths to improve focus.",
                    "Maintain good posture to avoid injuries."
                ]
            };

            userTips = await Tips.create(defaultTips);
        }

        //  retrieve tips based on user's gender and intensity
        const tipsData = await Tips.findOne({
            gender: userTips.gender,
            intensity: userTips.intensity
        });

        if (!tipsData || !tipsData.tips.length) {
            return res.status(404).json({ message: "No tips available for this intensity and gender" });
        }

        // pick a random tip
        const randomTip = tipsData.tips[Math.floor(Math.random() * tipsData.tips.length)];

        res.json({ tip: randomTip, intensity: userTips.intensity });

    } catch (error) {
        console.error("Error fetching tips:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST new tips for a user
router.post("/", async (req, res) => {
    try {
        const { userId, gender, intensity, tips } = req.body;

        // make sure userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // use updateOne to update if exists or insert if not
        const updatedTips = await Tips.updateOne(
            { userId: userId },
            {
                $set: { gender, intensity, tips, disabled: false }
            },
            // insert if it doesntt exist
            { upsert: true } 
        );

        res.status(200).json({ message: "Tips updated successfully", data: updatedTips });
    } catch (error) {
        console.error("Error updating tips:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// update gender or intensity
router.patch('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { gender, intensity } = req.body;

    try {
        if (!gender && intensity === undefined) {
            return res.status(400).json({ message: "No valid fields to update" });
        }

        let updatedTips = await Tips.findOneAndUpdate(
            { userId },
            { $set: { gender, intensity } },
            { new: true }
        );

        if (!updatedTips) {
            return res.status(404).json({ message: "User tips not found" });
        }

        // get new tips based on updated gender & intensity
        const newTips = await Tips.findOne({ gender, intensity });

        res.json({ message: "Updated successfully", newTips });
    } catch (error) {
        console.error("Error updating gender/intensity:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE tips for a user
router.delete('/:userId', async (req, res) => {
    try {
        // extract the userId from URL
        const { userId } = req.params; 
        console.log("Deleting tips for userId:", userId);

        const deletedTip = await Tips.findOneAndDelete({ userId });

        if (!deletedTip) {
            return res.status(404).json({ message: 'Tips not found for this user' });
        }

        res.json({ message: 'Tips deleted successfully' });
    } catch (error) {
        console.error('Error deleting tips:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;