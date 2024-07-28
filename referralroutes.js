import express from 'express'
import { Mailsended} from './mailcontroller.js';

const router =express.Router();


router.route('/referral').post(Mailsended)

export default router;