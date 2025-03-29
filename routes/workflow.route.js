import { Router} from 'express';
import { sendReminders } from '../controllers/workflow.controller.js';
import { verifyInternalRequest } from '../middlewares/auth.middleware.js';

const workflowRouter = Router();

// Apply the middleware to protect internal routes
workflowRouter.post('/subscription/reminder', verifyInternalRequest, sendReminders);

export default workflowRouter;