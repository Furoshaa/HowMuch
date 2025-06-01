import { Request, Response } from "express";
import { db } from "../config/db";
import { work_schedule } from "../models/work_schedule.model";

// Get all work schedule
export const getSchedule = async (req: Request, res: Response) => {
    try {
        const [schedules] = await db.execute<work_schedule[]>("SELECT * FROM work_schedule");
        res.status(200).json({ success: true, data: schedules });
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in fetching schedule:", error.message);
        }
        res.status(500).json({ success: false, message: "server error" });
    }
}

// Get schedule by ID
export const getScheduleById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const [schedule] = await db.execute<work_schedule[]>(
            "SELECT * FROM work_schedule WHERE id = ?",
            [id]
        );

        if (!schedule[0]) {
            res.status(404).json({ success: false, message: "Schedule not found" });
        } else {
            res.status(200).json({ success: true, data: schedule[0] });
        }
    }catch (error) {
        if (error instanceof Error) {
            console.log("Error in fetching schedule:", error.message);
        }
        res.status(500).json({ success: false, message: "server error" });
    }
}

// Get schedule using the user id fk
export const getScheduleByUserId = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    try {
        const [schedules] = await db.execute<work_schedule[]>(
            "SELECT * FROM work_schedule WHERE user_id = ?",
            [user_id]
        );

        res.status(200).json({ success: true, data: schedules });
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in fetching schedule by user_id:", error.message);
        }
        res.status(500).json({ success: false, message: "server error" });
    }
}

// Create schedule
export const createSchedule = async (req: Request, res: Response) => {
    const schedule = req.body;

    if (!schedule.user_id || !schedule.day_of_week || !schedule.work_start || !schedule.work_end || !schedule.hourly_rate) {
        res.status(400).json({ success: false, message: "Please fill all fields" });
    } else {
        try {
            const [result] = await db.execute(
                "INSERT INTO work_schedule (user_id, day_of_week, work_start, break_start, break_end, work_end, hourly_rate) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [schedule.user_id, schedule.day_of_week, schedule.work_start, schedule.break_start, schedule.break_end, schedule.work_end, schedule.hourly_rate]
            );            
            const [newschedule] = await db.execute<work_schedule[]>(
                "SELECT * FROM work_schedule WHERE id = ?",
                [(result as any).insertId]
            );

            res.status(201).json({ success: true, data: newschedule[0] });
        } catch (error) {
            if (error instanceof Error) {
                console.log("Error in creating schedule:", error.message);
            }
            res.status(500).json({ success: false, message: "server error" });
        }
    }
}

