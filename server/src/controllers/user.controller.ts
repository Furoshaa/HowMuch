import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../config/db";
import { User } from "../models/users.model";

// Get all users
export const getUsers = async (req: Request, res: Response) => {
    try {
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
            // Hash the password before storing
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);
            
            const [result] = await db.execute(
                "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
                [user.username, user.firstname, user.lastname, user.email, hashedPassword]
            );

            const [newUser] = await db.execute<User[]>(
                "SELECT * FROM users WHERE id = ?",
                [(result as any).insertId]
            );

            // Don't return the password in the response
            const { password, ...userWithoutPassword } = newUser[0];
            res.status(201).json({ success: true, data: userWithoutPassword });
        } catch (error: any) {
            console.log("Error in creating user:", error.message);
            
            const errorCode = error.code;
            const statusCode = errorCode === 'ER_DUP_ENTRY' ? 409 : 500;
            
            res.status(statusCode).json({ 
                success: false, 
                message: error.message            });
        }
    }
}

// Login user
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ success: false, message: "Please provide email and password" });
        return;
    }

    try {
        const [users] = await db.execute<User[]>(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (!users[0]) {
            res.status(401).json({ success: false, message: "This email isn't in our database" });
            return;
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ success: false, message: "Invalid password" });
            return;
        }

        // Don't return the password in the response
        const { password: userPassword, ...userWithoutPassword } = user;
        res.status(200).json({ 
            success: true, 
            message: "Login successful",
            data: userWithoutPassword 
        });
    } catch (error: any) {
        console.log("Error in login:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
}

