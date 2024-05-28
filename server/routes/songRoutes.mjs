import express from 'express';
import {addSong, getSong} from '../controllers/songController.mjs'

const router = express.Router();
router.post('/', addSong);
router.get('/:id', getSong);

export default router;