import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAlert } from '@/components/ui/alert-context'
import { useAuth } from '@/hooks/useAuth'
import { Clock, Coffee, User } from 'lucide-react'

interface WorkSchedule {
    id: number;
    user_id: number;
    day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    work_start: string;
    break_start: string;
    break_end: string;
    work_end: string;
    hourly_rate: number;
}

function Schedules() {
    const [schedules, setSchedules] = useState<WorkSchedule[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const { addAlert } = useAlert()
    const { user } = useAuth()

    const [newSchedule, setNewSchedule] = useState({
        day_of_week: '',
        work_start: '',
        break_start: '',
        break_end: '',
        work_end: '',
        hourly_rate: ''
    })

    const days = [
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
        { value: 'sunday', label: 'Sunday' }
    ]

    useEffect(() => {
        if (user?.id) {
            fetchSchedules()
        }
    }, [user])

    const fetchSchedules = async () => {
        if (!user?.id) return

        try {
            const response = await fetch(`/api/schedules/user/${user.id}`)
            const data = await response.json()
            
            if (data.success) {
                setSchedules(data.data)
            } else {
                addAlert({
                    type: 'error',
                    title: 'Error',
                    message: data.message || 'Failed to fetch schedules',
                    duration: 4000
                })
            }
        } catch (error) {
            console.error('Error fetching schedules:', error)
            addAlert({
                type: 'error',
                title: 'Error',
                message: error instanceof Error ? error.message : 'Failed to fetch schedules',
                duration: 4000
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        if (!user?.id) {
            addAlert({
                type: 'error',
                title: 'Error',
                message: 'You must be logged in to create a schedule',
                duration: 4000
            })
            setSubmitting(false)
            return
        }

        try {
            const response = await fetch('/api/schedules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newSchedule,
                    user_id: user.id,
                    hourly_rate: parseFloat(newSchedule.hourly_rate)
                })
            })

            const data = await response.json()
            
            if (data.success) {
                addAlert({
                    type: 'success',
                    title: 'Success',
                    message: 'Schedule created successfully',
                    duration: 4000
                })
                
                setNewSchedule({
                    day_of_week: '',
                    work_start: '',
                    break_start: '',
                    break_end: '',
                    work_end: '',
                    hourly_rate: ''
                })
                fetchSchedules() // Refresh the list
            } else {
                addAlert({
                    type: 'error',
                    title: 'Error',
                    message: data.message || 'Failed to create schedule',
                    duration: 4000
                })
            }
        } catch (error) {
            console.error('Error creating schedule:', error)
            addAlert({
                type: 'error',
                title: 'Error',
                message: 'Failed to create schedule',
                duration: 4000
            })
        } finally {
            setSubmitting(false)
        }
    }

    const formatTime = (time: string) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    const getUserName = (userId: number) => {
        if (user && user.id === userId) {
            return user.firstname && user.lastname 
                ? `${user.firstname} ${user.lastname}` 
                : user.name || user.email
        }
        return 'Unknown User'
    }

    const calculateWorkHours = (start: string, end: string, breakStart: string, breakEnd: string) => {
        const workStart = new Date(`1970-01-01T${start}`)
        const workEnd = new Date(`1970-01-01T${end}`)
        const breakStartTime = new Date(`1970-01-01T${breakStart}`)
        const breakEndTime = new Date(`1970-01-01T${breakEnd}`)
        
        const totalWork = (workEnd.getTime() - workStart.getTime()) / (1000 * 60 * 60)
        const breakTime = (breakEndTime.getTime() - breakStartTime.getTime()) / (1000 * 60 * 60)
        
        return (totalWork - breakTime).toFixed(1)
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading schedules...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-16">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                    <p className="text-muted-foreground">
                        Please log in to view and manage your work schedules.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Work Schedules</h1>
                <p className="text-muted-foreground">
                    Manage and view your work schedules
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Create New Schedule Form Card */}
                <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Create New Schedule
                        </CardTitle>
                        <CardDescription>
                            Create a new work schedule
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="day">Day of Week</Label>
                                <Select 
                                    value={newSchedule.day_of_week} 
                                    onValueChange={(value) => setNewSchedule({...newSchedule, day_of_week: value})}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a day" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {days.map((day) => (
                                            <SelectItem key={day.value} value={day.value}>
                                                {day.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="work_start">Work Start</Label>
                                    <Input
                                        id="work_start"
                                        type="time"
                                        value={newSchedule.work_start}
                                        onChange={(e) => setNewSchedule({...newSchedule, work_start: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="work_end">Work End</Label>
                                    <Input
                                        id="work_end"
                                        type="time"
                                        value={newSchedule.work_end}
                                        onChange={(e) => setNewSchedule({...newSchedule, work_end: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="break_start">Break Start</Label>
                                    <Input
                                        id="break_start"
                                        type="time"
                                        value={newSchedule.break_start}
                                        onChange={(e) => setNewSchedule({...newSchedule, break_start: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="break_end">Break End</Label>
                                    <Input
                                        id="break_end"
                                        type="time"
                                        value={newSchedule.break_end}
                                        onChange={(e) => setNewSchedule({...newSchedule, break_end: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                                <Input
                                    id="hourly_rate"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={newSchedule.hourly_rate}
                                    onChange={(e) => setNewSchedule({...newSchedule, hourly_rate: e.target.value})}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create Schedule'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Existing Schedules */}
                {schedules.map((schedule) => (
                    <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="capitalize">{schedule.day_of_week}</span>
                                <div className="flex items-center gap-1 text-green-600">
                                    <span className="font-semibold">${schedule.hourly_rate}/hr</span>
                                </div>
                            </CardTitle>
                            <CardDescription>
                                {getUserName(schedule.user_id)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">Work Hours:</span>
                                <span>{formatTime(schedule.work_start)} - {formatTime(schedule.work_end)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm">
                                <Coffee className="h-4 w-4 text-orange-600" />
                                <span className="font-medium">Break Time:</span>
                                <span>{formatTime(schedule.break_start)} - {formatTime(schedule.break_end)}</span>
                            </div>

                            <div className="pt-2 border-t">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Total Work Hours:</span>
                                    <span className="font-semibold">
                                        {calculateWorkHours(
                                            schedule.work_start, 
                                            schedule.work_end, 
                                            schedule.break_start, 
                                            schedule.break_end
                                        )} hours
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-1">
                                    <span className="text-muted-foreground">Daily Earnings:</span>
                                    <span className="font-semibold text-green-600">
                                        ${(parseFloat(calculateWorkHours(
                                            schedule.work_start, 
                                            schedule.work_end, 
                                            schedule.break_start, 
                                            schedule.break_end
                                        )) * schedule.hourly_rate).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {schedules.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No schedules found</h3>
                        <p className="text-muted-foreground">
                            Create your first work schedule using the form above.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Schedules