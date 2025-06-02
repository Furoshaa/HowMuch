import { RowDataPacket } from 'mysql2';

export interface work_session extends RowDataPacket {
    id: number;
    user_id: number;
    work_date: Date; // Use Date for date values
    work_start: string; // Format: 'HH:MM:SS'
    break_start: string; // Format: 'HH:MM:SS'
    break_end: string; // Format: 'HH:MM:SS'
    work_end: string; // Format: 'HH:MM:SS'
    hourly_rate: number; // Decimal value for hourly rate
    is_auto_generated: boolean; // Indicates if the session was auto-generated
    is_canceled: boolean; // Indicates if the session was canceled
}

// SQL to create the table
/*
CREATE OR REPLACE TABLE work_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  work_date DATE NOT NULL,
  work_start TIME NOT NULL,
  break_start TIME NOT NULL,
  break_end TIME NOT NULL,
  work_end TIME NOT NULL,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  is_auto_generated BOOLEAN DEFAULT TRUE,
  is_canceled BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
*/