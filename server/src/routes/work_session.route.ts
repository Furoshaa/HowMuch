import express, { Router } from "express";
import { 
    getAllWorkSessions,
    getWorkSessionById,
    getWorkSessionsByUserId,
    createWorkSession
} from "../controllers/work_session.controller";

const router: Router = express.Router();

router.get('/', getAllWorkSessions);
router.get('/user/:userId', getWorkSessionsByUserId); // Move this BEFORE /:id
router.get('/:id', getWorkSessionById);
router.post('/', createWorkSession);

export default router;