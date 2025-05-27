import { Pool } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

export interface work_sessions extends RowDataPacket {
    id: number;
    user_id: number;
    start_time: Date; // Use Date for datetime values
    end_time: Date; // Use Date for datetime values
    hourly_rate: number; // Decimal value for hourly rate
    is_auto_generated: boolean; // Indicates if the session was auto-generated
    is_canceled: boolean; // Indicates if the session was canceled
}

// SQL to create the table
/*
CREATE TABLE work_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  is_auto_generated BOOLEAN DEFAULT TRUE,
  is_canceled BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
*/