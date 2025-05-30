import { RowDataPacket } from 'mysql2';

export interface work_schedule extends RowDataPacket {
    id: number;
    user_id: number;
    day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    start_time: string; // Format: 'HH:MM:SS'
    break_start: string; // Format: 'HH:MM:SS'
    break_end: string; // Format: 'HH:MM:SS'
    end_time: string; // Format: 'HH:MM:SS'
    hourly_rate: number; // Decimal value for hourly rate
}

// SQL to create the table
/*
CREATE TABLE work_schedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
  start_time TIME NOT NULL,
  break_start TIME NOT NULL,
  break_end TIME NOT NULL,
  end_time TIME NOT NULL,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
*/