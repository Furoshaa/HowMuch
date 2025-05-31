import express, { Router } from "express";
import { getWorkExceptions, getWorkExceptionById, getWorkExceptionsByUserId, createWorkException } from "../controllers/work_exceptions.controller";

const router: Router = express.Router();

router.get('/', getWorkExceptions);
router.post('/', createWorkException);
router.get("/:id", getWorkExceptionById);
router.get("/user/:user_id", getWorkExceptionsByUserId);

export default router;