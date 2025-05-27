import { Request, Response } from "express";
import { connectDB } from "../config/db";
import { User } from "../models/users.model";

// Get all users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const db = await connectDB();
        const [rows] = await db.execute<User[]>("SELECT * FROM users");
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in fetching users:", error.message);
        }
        res.status(500).json({ success: false, message: "server error" });
    }
}

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const db = await connectDB();
        const [user] = await db.execute<User[]>(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        if (!user[0]) {
            res.status(404).json({ success: false, message: "User not found" });
        } else {
            res.status(200).json({ success: true, data: user[0] });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in fetching user:", error.message);
        }
        res.status(500).json({ success: false, message: "server error" });
    }
}

// Get user for connection using username
export const getUserByUsername = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        const db = await connectDB();
        const [user] = await db.execute<User[]>(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (!user[0]) {
            res.status(404).json({ success: false, message: "User not found" });
        } else {
            res.status(200).json({ success: true, data: user[0] });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in fetching user by username:", error.message);
        }
        res.status(500).json({ success: false, message: "server error" });
    }
}

// Create user
export const createUser = async (req: Request, res: Response) => {
    const user = req.body;

    if (!user.username || !user.firstname || !user.lastname || !user.email || !user.password) {
        res.status(400).json({ success: false, message: "Please fill all fields" });
    } else {
        try {
            const db = await connectDB();
            const [result] = await db.execute(
                "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
                [user.username, user.firstname, user.lastname, user.email, user.password]
            );

            const [newUser] = await db.execute<User[]>(
                "SELECT * FROM users WHERE id = ?",
                [(result as any).insertId]
            );

            res.status(201).json({ success: true, data: newUser[0] });
        } catch (error) {
            if (error instanceof Error) {
                console.log("Error in creating user:", error.message);
            }
            res.status(500).json({ success: false, message: "server error" });
        }
    }
}

