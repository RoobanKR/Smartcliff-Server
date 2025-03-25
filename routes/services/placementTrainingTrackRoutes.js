
const express = require('express');
const router = express.Router();
const { userRole } = require('../../middlewares/userRole.js');
const { userAuth } = require('../../middlewares/userAuth.js');
const { createPlacementTrainingTrack, getAllPlacementTrainingTrack, getPlacementTrainingTrackById, updatePlacementTrainingTrack, deletePlacementTrainingTrack } = require('../../controllers/services/placementTrainingTracks.js');

router.post('/create/service/placement-training-track',createPlacementTrainingTrack);

router.get('/getAll/service/placement-training-tracks', getAllPlacementTrainingTrack); 

router.get('/getById/service/placement-training-track/:id', getPlacementTrainingTrackById);

router.delete('/delete/service/placement-training-track/:id', deletePlacementTrainingTrack);

router.put('/update/service/placement-training-track/:id', updatePlacementTrainingTrack);

module.exports = router;
