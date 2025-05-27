import { Pool } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
export interface work_exceptions extends RowDataPacket {
    id: number;
    user_id: number; // Foreign key to users table
    date: Date; // Date of the exception
    type: 'vacation' | 'sick' | 'custom_hours' | 'off'; // Type of exception
    start_time?: string; // Optional start time for custom hours
    end_time?: string; // Optional end time for custom hours
    break_start?: string; // Optional break start time
    break_end?: string; // Optional break end time
    hourly_rate?: number; // Optional hourly rate for custom hours
    comment?: string; // Optional comment for the exception
}

// SQL to create the table 
/*
CREATE TABLE work_exceptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  type ENUM('vacation', 'sick', 'custom_hours', 'off') NOT NULL,
  start_time TIME,
  end_time TIME,
  break_start TIME,
  break_end TIME,
  hourly_rate DECIMAL(10, 2),
  comment TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, date)
);
*/