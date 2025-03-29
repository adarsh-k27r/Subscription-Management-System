import { Router } from 'express';
import authorize, { authorizeRole } from '../middlewares/auth.middleware.js';
import { getUser, getUsers, updateUserRole } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', authorize, authorizeRole, getUsers);

userRouter.get('/:id', authorize, getUser);

userRouter.post('/', (req, res) => res.send({ title: 'CREATE new user' }));

userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE user' }));

userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE user' }));

// Role management endpoint
userRouter.patch('/:id/role', authorize, authorizeRole, updateUserRole);

export default userRouter;