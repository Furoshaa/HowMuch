import React, { useState, useEffect } from 'react';
import './usersList.css'; // Import the CSS file

// Define the user interface based on the backend model
interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string; // Note: Typically you wouldn't display this
}

// API response interface
interface ApiResponse {
    success: boolean;
    data: User[];
    message?: string;
}

const UsersList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Use the actual API endpoint from your server
                const response = await fetch('/api/users');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                
                const responseData: ApiResponse = await response.json();
                
                if (responseData.success) {
                    setUsers(responseData.data);
                } else {
                    throw new Error(responseData.message || 'Failed to fetch users');
                }
                
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading users...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>            
            <h1>Users List</h1>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.firstname}</td>
                            <td>{user.lastname}</td>
                            <td>{user.email}</td>
                            <td>{user.password}</td>
                            <td>
                                <button onClick={() => alert(`View details for ${user.username}`)}>
                                    View
                                </button>
                                <button onClick={() => alert(`Edit user ${user.username}`)}>
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersList;