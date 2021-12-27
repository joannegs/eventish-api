import express from 'express';
export const router = express.Router();

import * as eventController from '../controllers/event-controller';
import { authentication, authorizationEvents } from '../services/authService';

router.get('/:id', authentication, authorizationEvents, eventController.getById);
router.get('/', authentication, eventController.getByUser);
router.post('/', authentication, eventController.post);
router.put('/', authentication, authorizationEvents, eventController.put);
router.delete('/', authentication, authorizationEvents, eventController.remove);