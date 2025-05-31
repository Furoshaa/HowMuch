import { RowDataPacket } from 'mysql2';
export interface work_exceptions extends RowDataPacket {
    id: number;
    user_id: number; // Foreign key to users table
    date: Date; // Date of the exception
    reason: 'vacation' | 'sick' | 'late' | 'early_out' | 'overtime' | 'other'; // Type of exception
    work_start?: string; // Optional start time for custom hours
    break_start?: string; // Optional end time for custom hours
    break_end?: string; // Optional break start time
    work_end?: string; // Optional break end time
    hourly_rate?: number; // Optional hourly rate for custom hours
    comment?: string; // Optional comment for the exception
}

// SQL to create the table 
/*
CREATE OR REPLACE TABLE work_exceptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  reason ENUM('vacation', 'sick', 'late', 'early_out', 'overtime', 'other') NOT NULL,
  work_start TIME,
  break_start TIME,
  break_end TIME,
  work_end TIME,
  hourly_rate DECIMAL(10, 2),
  comment VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, date)
);
*/