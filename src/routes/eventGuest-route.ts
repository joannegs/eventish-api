import express from 'express';
export const router = express.Router();

import * as eventGuestController from '../controllers/eventGuest-controller';
import { authentication } from '../services/authService';

router.get('/', authentication, eventGuestController.getByUser);
router.post('/', authentication, eventGuestController.post);
router.delete('/', authentication, eventGuestController.remove);