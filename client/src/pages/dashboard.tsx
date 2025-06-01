import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Plus } from 'lucide-react'
import { useAlert } from '@/components/ui/alert-context'
import { useAuth } from '@/hooks/useAuth'

function Dashboard() {
    const [hasSchedule, setHasSchedule] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { addAlert } = useAlert()
    const navigate = useNavigate()
    const { user, isAuthenticated, isLoading: authLoading } = useAuth()

    useEffect(() => {
        // Wait for auth loading to complete before checking authentication
        if (authLoading) return

        // Check authentication after loading is done
        if (!isAuthenticated) {
            addAlert({
                type: 'error',
                title: 'Access Denied',
                message: 'Please log in to access the dashboard.',
                duration: 5000
            })
            navigate('/login')
            return
        }        // TODO: Check if user has a schedule
        // For now, simulate loading and no schedule found
        const timer = setTimeout(() => {
            setHasSchedule(false)
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [isAuthenticated, authLoading, navigate, addAlert])

    // Test function to demonstrate different alert types
    const testAlerts = () => {
        addAlert({
            type: 'info',
            title: 'Info Alert',
            message: 'This is an informational message that will auto-dismiss.',
            duration: 4000
        })
        
        setTimeout(() => {
            addAlert({
                type: 'warning',
                title: 'Warning Alert',
                message: 'This is a warning message.',
                duration: 5000
            })
        }, 1000)

        setTimeout(() => {
            addAlert({
                type: 'success',
                title: 'Success Alert',
                message: 'This persistent alert will stay until you close it!',
                duration: 0 // Persistent
            })
        }, 2000)
    }

    if (authLoading || isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        {user && (
                            <p className="text-muted-foreground mt-2">
                                Welcome back, {user.name || user.email}!
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!hasSchedule) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        {user && (
                            <p className="text-muted-foreground mt-2">
                                Welcome back, {user.firstname || user.name || user.email}!
                            </p>
                        )}
                    </div>
                    
                    {/* No Schedule State */}
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Card className="w-full max-w-md text-center">
                            <CardHeader className="pb-4">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                    <Calendar className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <CardTitle className="text-xl">No Schedule Found</CardTitle>
                                <CardDescription className="text-base">
                                    You don't have a work schedule set up yet. Create one to start tracking your time and manage your work sessions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button asChild size="lg" className="w-full">
                                    <Link to="/schedules">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Your Schedule
                                    </Link>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full"
                                    onClick={testAlerts}
                                >
                                    Test Alerts System
                                </Button>
                                <div className="text-sm text-muted-foreground">
                                    <p>Get started by setting up your work hours, breaks, and preferences.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                            <CardHeader className="pb-3">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-base">Schedule Management</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Set up your work hours, break times, and weekly schedule preferences.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                            <CardHeader className="pb-3">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-base">Time Tracking</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Track your work sessions, breaks, and monitor your productivity patterns.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                            <CardHeader className="pb-3">
                                <div className="flex items-center space-x-2">
                                    <Plus className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-base">Quick Actions</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Manage work exceptions, view reports, and customize your workspace.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    // This will be implemented later when user has a schedule
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    {user && (
                        <p className="text-muted-foreground mt-2">
                            Welcome back, {user.firstname || user.name || user.email}!
                        </p>
                    )}
                </div>
                <p>Schedule dashboard content will go here...</p>
            </div>
        </div>
    )
}

export default Dashboard