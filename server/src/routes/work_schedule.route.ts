import express, { Router } from "express";
import { getSchedule, getScheduleById, getScheduleByUserId, createSchedule } from "../controllers/work_schedule.controller";

const router: Router = express.Router();

router.get('/', getSchedule);
router.post('/', createSchedule);
router.get("/:id", getScheduleById);
router.get("/user/:user_id", getScheduleByUserId);

export default router;
