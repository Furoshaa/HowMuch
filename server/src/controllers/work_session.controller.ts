import { Request, Response } from 'express';
import { work_session } from '../models/work_session.model';
import { db } from '../config/db';

// Get all work sessions
export const getAllWorkSessions = async (req: Request, res: Response): Promise<void> => {
    try {
        const [sessions] = await db.query<work_session[]>('SELECT * FROM work_sessions');
        res.status(200).json({success: true, data: sessions});
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in fetching work sessions:", error.message);
        }
        res.status(500).json({ success: false, message: "server error" });
    }
};

// Get work session by ID
export const getWorkSessionById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const [rows] = await db.query<work_session[]>('SELECT * FROM work_sessions WHERE id = ?', [id]);
        if (rows.length === 0) {
            res.status(404).json({ success: false, message: 'Work session not found' });
            return;
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in fetching work session:", error.message);
        }
        res.status(500).json({ success: false, message: "server error" });
    }
};

// Get work session by userid 
export const getWorkSessionsByUserId = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const [rows] = await db.query<work_session[]>('SELECT * FROM work_sessions WHERE user_id = ?', [userId]);
        if (rows.length === 0) {
            res.status(404).json({ success: false, message: 'No work sessions found for this user' });
            return;
        }
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in fetching work sessions by user ID:", error.message);
        }
        res.status(500).json({ success: false, message: "server error" });
    }
};

// Create a new work session
export const createWorkSession = async (req: Request, res: Response): Promise<void> => {
    const { user_id, work_date, work_start, break_start, break_end, work_end, hourly_rate, is_auto_generated, is_canceled } = req.body;

    if (!user_id || !work_date || !work_start || !break_start || !break_end || !work_end || hourly_rate === undefined) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
    }

    try {
        const [result] = await db.query(
            'INSERT INTO work_sessions (user_id, work_date, work_start, break_start, break_end, work_end, hourly_rate, is_auto_generated, is_canceled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [
                user_id, 
                work_date, 
                work_start, 
                break_start, 
                break_end, 
                work_end, 
                hourly_rate, 
                is_auto_generated, 
                is_canceled
            ]
        );
        
        const [insertedSession] = await db.execute<work_session[]>(
            "SELECT * FROM work_sessions WHERE id = ?",
            [(result as any).insertId]
        );
        
        res.status(201).json({ success: true, data: insertedSession[0] });
    } catch (error: any) {
        console.error("Error in creating work session:", error.message);
        
        // Simple error mapping based on MySQL error codes
        const errorCode = error.code;
        const statusCode = errorCode === 'ER_DUP_ENTRY' ? 409 : 
                          errorCode === 'ER_NO_REFERENCED_ROW_2' ? 400 : 500;
        
        res.status(statusCode).json({ 
            success: false, 
            message: error.message
        });
    }
};