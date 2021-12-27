import express from 'express';
export const router = express.Router();

import * as inviteController from '../controllers/invite-controller';
import { authentication } from '../services/authService';

router.get('/', authentication, inviteController.getByUser);
router.post('/', authentication, inviteController.post);
router.patch('/', authentication, inviteController.patch);
router.delete('/', authentication, inviteController.remove);