import { Request, Response } from 'express';
import { work_exceptions } from '../models/work_exceptions.model';
import { db } from '../config/db';

// Get all work exceptions
export const getWorkExceptions = async (req: Request, res: Response) => {
    try {
        const [exceptions] = await db.execute<work_exceptions[]>("SELECT * FROM work_exceptions");
        res.status(200).json({ success: true, data: exceptions });
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in fetching work exceptions:", error.message);
        }
        res.status(500).json({ success: false, message: "server error" });
    }
}

// Get work exception by ID
export const getWorkExceptionById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const [exception] = await db.execute<work_exceptions[]>(
            "SELECT * FROM work_exceptions WHERE id = ?",
            [id]
        );

        if (!exception[0]) {
            res.status(404).json({ success: false, message: "Work exception not found" });
        } else {
            res.status(200).json({ success: true, data: exception[0] });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in fetching work exception:", error.message);
        }
        res.status(500).json({ success: false, message: "server error" });
    }
}

// Get work exceptions by user ID
export const getWorkExceptionsByUserId = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    try {
        const [exceptions] = await db.execute<work_exceptions[]>(
            "SELECT * FROM work_exceptions WHERE user_id = ?",
            [user_id]
        );

        if (!exceptions[0]) {
            res.status(404).json({ success: false, message: "Work exceptions not found for this user" });
        } else {
            res.status(200).json({ success: true, data: exceptions });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in fetching work exceptions by user_id:", error.message);
        }
        res.status(500).json({ success: false, message: "server error" });
    }
}

// Create a new work exception
export const createWorkException = async (req: Request, res: Response) => {
    const exception = req.body;

    if (!exception.user_id || !exception.date || !exception.reason) {
        res.status(400).json({ success: false, message: "Please provide user_id, date, and reason" });
    } else {
        try {
            const [result] = await db.execute(
                "INSERT INTO work_exceptions (user_id, date, reason, work_start, break_start, break_end, work_end, hourly_rate, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    exception.user_id, 
                    exception.date, 
                    exception.reason, 
                    exception.work_start || null, 
                    exception.break_start || null, 
                    exception.break_end || null, 
                    exception.work_end || null, 
                    exception.hourly_rate || null, 
                    exception.comment || null
                ]
            );
            const [insertedException] = await db.execute<work_exceptions[]>(
                "SELECT * FROM work_exceptions WHERE id = ?",
                [(result as any).insertId]
            );            res.status(201).json({ success: true, data: insertedException[0] });
        } catch (error: any) {
            console.log("Error in creating work exception:", error.message);
            
            // Simple error mapping based on MySQL error codes
            const errorCode = error.code;
            const statusCode = errorCode === 'ER_DUP_ENTRY' ? 409 : 
                             errorCode === 'ER_NO_REFERENCED_ROW_2' ? 400 : 500;
            
            res.status(statusCode).json({ 
                success: false, 
                message: error.message
            });
        }
    }

    
}

