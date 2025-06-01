import { useState, useEffect } from 'react'

interface User {
    id: number
    name?: string
    email: string
    [key: string]: any
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Initial check
        checkAuthState()

        // Listen for storage changes to sync across tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'user') {
                checkAuthState()
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    const checkAuthState = () => {
        setIsLoading(true)
        try {
            const savedUser = localStorage.getItem('user')
            if (savedUser) {
                const userData = JSON.parse(savedUser)
                if (userData && userData.id) {
                    setUser(userData)
                } else {
                    // Invalid user data, clear it
                    localStorage.removeItem('user')
                    setUser(null)
                }            } else {
                setUser(null)
            }
        } catch (error) {
            // Invalid JSON, clear it
            localStorage.removeItem('user')
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const login = (userData: User) => {
        console.log('🔐 useAuth login called with:', userData);
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        console.log('🔐 useAuth login - user state set to:', userData);
        console.log('🔐 useAuth login - localStorage now contains:', localStorage.getItem('user'));
        
        // Force a storage event to trigger updates in other components
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'user',
            newValue: JSON.stringify(userData),
            oldValue: null
        }));
    }

    const logout = () => {
        localStorage.removeItem('user')
        setUser(null)
    }

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            setUser(updatedUser)
        }
    }

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        checkAuthState
    }
}
