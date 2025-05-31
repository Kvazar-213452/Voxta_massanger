import { Router } from 'express';
import { register_start, register_end } from '../components/User/Register';
import { GetChats } from '../components/GetChats/GetChats';

const router = Router();

// login
router.post('/register_post', register_start);
router.post('/register_end_post', register_end);

// msg
router.post('/get_chats_post', GetChats);

export default router;
