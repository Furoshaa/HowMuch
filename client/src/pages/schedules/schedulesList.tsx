import React, { useState, useEffect } from 'react';
import './schedulesList.css'; // Import the CSS file

// Define the work schedule interface based on the backend model
interface WorkSchedule {
    id: number;
    user_id: number;
    day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    work_start: string; // Format: 'HH:MM:SS'
    break_start: string; // Format: 'HH:MM:SS'
    break_end: string; // Format: 'HH:MM:SS'
    work_end: string; // Format: 'HH:MM:SS'
    hourly_rate: number;
}

// Define the User interface
interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
}

// API response interface
interface ApiResponse {
    success: boolean;
    data: WorkSchedule[] | WorkSchedule;
    message?: string;
}

// Helper function to format time (HH:MM:SS to HH:MM AM/PM)
const formatTime = (timeStr: string): string => {
    if (!timeStr) return 'N/A';
    
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${formattedHour}:${minutes} ${ampm}`;
};

// Helper function to capitalize first letter
const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const SchedulesList: React.FC = () => {
    const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
    const [usersMap, setUsersMap] = useState<Record<number, User>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                // Use the actual API endpoint from your server
                const response = await fetch('/api/schedules');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch schedules');
                }
                
                const responseData: ApiResponse = await response.json();
                
                if (responseData.success) {
                    // Make sure we're working with an array
                    const schedulesData = Array.isArray(responseData.data) 
                        ? responseData.data 
                        : [responseData.data];
                    setSchedules(schedulesData);
                } else {
                    throw new Error(responseData.message || 'Failed to fetch schedules');
                }
                
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setLoading(false);
            }
        };        const fetchUsers = async () => {
            try {
                // Use the actual API endpoint from your server
                const response = await fetch('/api/users');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                
                const responseData = await response.json();
                
                if (responseData.success) {
                    // Make sure we're working with an array
                    const usersData = Array.isArray(responseData.data) 
                        ? responseData.data 
                        : [responseData.data];
                    
                    // Create a map of user_id -> user object for faster lookups
                    const userMap: Record<number, User> = {};
                    usersData.forEach((user: User) => {
                        userMap[user.id] = user;
                    });
                    setUsersMap(userMap);
                } else {
                    throw new Error(responseData.message || 'Failed to fetch users');
                }
                
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setLoading(false);
            }
        };

        fetchSchedules();
        fetchUsers();
    }, []);

    // Calculate work hours
    const calculateWorkHours = (schedule: WorkSchedule): number => {
        const workStart = new Date(`1970-01-01T${schedule.work_start}`);
        const workEnd = new Date(`1970-01-01T${schedule.work_end}`);
        const breakStart = new Date(`1970-01-01T${schedule.break_start}`);
        const breakEnd = new Date(`1970-01-01T${schedule.break_end}`);
        
        // Calculate total work time in milliseconds
        const workTimeMs = workEnd.getTime() - workStart.getTime();
        
        // Calculate break time in milliseconds
        const breakTimeMs = breakEnd.getTime() - breakStart.getTime();
        
        // Calculate net work time (work time minus break time) in hours
        const netWorkTimeHours = (workTimeMs - breakTimeMs) / (1000 * 60 * 60);
        
        return Math.round(netWorkTimeHours * 100) / 100;  // Round to 2 decimal places
    };

    if (loading) {
        return <div className="loading-container">Loading schedules...</div>;
    }

    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

    return (
        <div className="schedules-container">
            <h1>Work Schedules</h1>
            <table className="schedules-table">                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Day</th>
                        <th>Work Start</th>
                        <th>Break Start</th>
                        <th>Break End</th>
                        <th>Work End</th>
                        <th>Hours Worked</th>
                        <th>Hourly Rate</th>
                        <th>Daily Earnings</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>                    {schedules.map((schedule) => {
                        const workHours = calculateWorkHours(schedule);
                        // Make sure hourly_rate is treated as a number
                        const hourlyRate = parseFloat(String(schedule.hourly_rate));
                        const dailyEarning = workHours * hourlyRate;                        // Get the user from the map using user_id
                        const user = usersMap[schedule.user_id];
                        const username = user ? user.username : `User ${schedule.user_id}`;
                        const userTooltip = user ? `${user.firstname} ${user.lastname} (${user.email})` : '';
                        
                        return (
                            <tr key={schedule.id}>
                                <td>{schedule.id}</td>
                                <td>{username}</td>
                                <td>{capitalize(schedule.day_of_week)}</td>
                                <td>{formatTime(schedule.work_start)}</td>
                                <td>{formatTime(schedule.break_start)}</td>
                                <td>{formatTime(schedule.break_end)}</td>
                                <td>{formatTime(schedule.work_end)}</td>
                                <td>{workHours} hrs</td>
                                <td>${isNaN(hourlyRate) ? '0.00' : hourlyRate.toFixed(2)}</td>
                                <td>${isNaN(dailyEarning) ? '0.00' : dailyEarning.toFixed(2)}</td>
                                <td>
                                    <button 
                                        className="view-btn"
                                        onClick={() => alert(`View details for schedule ${schedule.id}`)}
                                    >
                                        View
                                    </button>
                                    <button 
                                        className="edit-btn"
                                        onClick={() => alert(`Edit schedule ${schedule.id}`)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SchedulesList;
