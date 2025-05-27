import express, { Router } from "express";
import { getUserById, getUserByUsername, getUsers, createUser } from "../controllers/user.controller";

const router: Router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get("/:id", getUserById);
router.get("/:username", getUserByUsername);

export default router;