import { Router } from 'express';
import { signUp, signIn, signOut, refreshToken } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.delete('/sign-out', signOut);
authRouter.post('/refresh-token', refreshToken);

export default authRouter;