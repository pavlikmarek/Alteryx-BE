import express from "express";
import user from './routes/userRoute';
import auth from './routes/authRoute';

const router = express.Router();

router.use('/auth', auth);
router.use('/user', user);

export default router;