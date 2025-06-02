import { useState, useEffect } from 'react'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAlert } from '@/components/ui/alert-context'
import { useAuth } from '@/hooks/useAuth'
import { format, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns'
import { Clock, Coffee, AlertTriangle, CheckCircle, Calendar as CalendarIcon } from 'lucide-react'

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

interface WorkException {
  id: number;
  user_id: number;
  date: Date;
  reason: 'vacation' | 'sick' | 'late' | 'early_out' | 'overtime' | 'other';
  work_start?: string;
  break_start?: string;
  break_end?: string;
  work_end?: string;
  hourly_rate?: number;
  comment?: string;
}

interface WorkSession {
  id: number;
  user_id: number;
  work_date: Date;
  work_start: string;
  break_start: string;
  break_end: string;
  work_end: string;
  hourly_rate: number;
  is_auto_generated: boolean;
  is_canceled: boolean;
}

function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [schedules, setSchedules] = useState<WorkSchedule[]>([])
  const [exceptions, setExceptions] = useState<WorkException[]>([])
  const [sessions, setSessions] = useState<WorkSession[]>([])
  const [loading, setLoading] = useState(true)
  const { addAlert } = useAlert()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      fetchAllData()
    }
  }, [user])

  const fetchAllData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [schedulesRes, exceptionsRes, sessionsRes] = await Promise.all([
        fetch(`/api/schedules/user/${user.id}`),
        fetch(`/api/exceptions/user/${user.id}`),
        fetch(`/api/sessions/user/${user.id}`)
      ])

      const [schedulesData, exceptionsData, sessionsData] = await Promise.all([
        schedulesRes.json(),
        exceptionsRes.json(),
        sessionsRes.json()
      ])

      if (schedulesData.success) {
        setSchedules(schedulesData.data || [])
      }

      if (exceptionsData.success) {
        setExceptions((exceptionsData.data || []).map((exc: any) => ({
          ...exc,
          date: new Date(exc.date)
        })))
      }

      if (sessionsData.success) {
        setSessions((sessionsData.data || []).map((session: any) => ({
          ...session,
          work_date: new Date(session.work_date)
        })))
      }

    } catch (error) {
      console.error('Error fetching calendar data:', error)
      addAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to load calendar data',
        duration: 4000
      })
    } finally {
      setLoading(false)
    }
  }

  const getDayOfWeek = (date: Date): WorkSchedule['day_of_week'] => {
    const days: WorkSchedule['day_of_week'][] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[date.getDay()]
  }

  const getScheduleForDay = (date: Date): WorkSchedule | null => {
    const dayOfWeek = getDayOfWeek(date)
    return schedules.find(schedule => schedule.day_of_week === dayOfWeek) || null
  }

  const getExceptionForDay = (date: Date): WorkException | null => {
    return exceptions.find(exception => isSameDay(exception.date, date)) || null
  }

  const getSessionForDay = (date: Date): WorkSession | null => {
    return sessions.find(session => isSameDay(session.work_date, date)) || null
  }

  const getDayStatus = (date: Date) => {
    const session = getSessionForDay(date)
    const exception = getExceptionForDay(date)
    const schedule = getScheduleForDay(date)
    const today = startOfDay(new Date())
    const dayStart = startOfDay(date)
    const isPast = isBefore(dayStart, today)
    const isFuture = isAfter(dayStart, today)

    if (session) {
      if (exception) {
        return { type: 'session-exception', color: 'bg-gray-400' }
      }
      return { type: 'session', color: 'bg-gray-500' }
    }

    if (exception) {
      const badReasons = ['sick', 'vacation']
      const isBad = badReasons.includes(exception.reason)
      return { type: 'exception', color: isBad ? 'bg-red-400' : 'bg-orange-400' }
    }

    if (schedule && (isFuture || isPast)) {
      return { type: 'scheduled', color: 'bg-gray-200' }
    }

    return { type: 'none', color: '' }
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    try {
      return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return time
    }
  }

  const calculateWorkHours = (start: string, end: string, breakStart?: string, breakEnd?: string) => {
    try {
      const workStart = new Date(`1970-01-01T${start}`)
      const workEnd = new Date(`1970-01-01T${end}`)
      let totalWork = (workEnd.getTime() - workStart.getTime()) / (1000 * 60 * 60)
      
      if (breakStart && breakEnd) {
        const breakStartTime = new Date(`1970-01-01T${breakStart}`)
        const breakEndTime = new Date(`1970-01-01T${breakEnd}`)
        const breakTime = (breakEndTime.getTime() - breakStartTime.getTime()) / (1000 * 60 * 60)
        totalWork -= breakTime
      }
      
      return totalWork.toFixed(1)
    } catch {
      return '0'
    }
  }

  const renderDayContent = () => {
    const session = getSessionForDay(selectedDate)
    const exception = getExceptionForDay(selectedDate)
    const schedule = getScheduleForDay(selectedDate)
    const today = startOfDay(new Date())
    const selectedDayStart = startOfDay(selectedDate)
    const isFuture = isAfter(selectedDayStart, today)

    if (loading) {
      return (
        <div className="space-y-4">
          <div className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
          <div className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
        </div>
      )
    }

    const cards = []

    // Session card (actual work done)
    if (session) {
      cards.push(
        <Card key="session" className="border-l-4 border-l-gray-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Work Session {session.is_canceled ? '(Canceled)' : '(Completed)'}
            </CardTitle>
            <CardDescription>
              {session.is_auto_generated ? 'Auto-generated' : 'Manual entry'} • {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Work Hours:</span>
              <span>{formatTime(session.work_start)} - {formatTime(session.work_end)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Coffee className="h-4 w-4 text-orange-600" />
              <span className="font-medium">Break Time:</span>
              <span>{formatTime(session.break_start)} - {formatTime(session.break_end)}</span>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Work Hours:</span>
                <span className="font-medium">{calculateWorkHours(session.work_start, session.work_end, session.break_start, session.break_end)} hours</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-muted-foreground">Hourly Rate:</span>
                <span className="font-medium text-green-600">${session.hourly_rate}/hr</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Exception card
    if (exception) {
      const reasonColors = {
        vacation: 'text-blue-600',
        sick: 'text-red-600',
        late: 'text-orange-600',
        early_out: 'text-yellow-600',
        overtime: 'text-purple-600',
        other: 'text-gray-600'
      }

      cards.push(
        <Card key="exception" className="border-l-4 border-l-orange-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Work Exception
            </CardTitle>
            <CardDescription>
              <span className={`capitalize font-medium ${reasonColors[exception.reason]}`}>
                {exception.reason.replace('_', ' ')}
              </span> • {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {exception.work_start && exception.work_end && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Custom Work Hours:</span>
                  <span>{formatTime(exception.work_start)} - {formatTime(exception.work_end)}</span>
                </div>
                
                {exception.break_start && exception.break_end && (
                  <div className="flex items-center gap-2 text-sm">
                    <Coffee className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Break Time:</span>
                    <span>{formatTime(exception.break_start)} - {formatTime(exception.break_end)}</span>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Work Hours:</span>
                    <span className="font-medium">{calculateWorkHours(exception.work_start, exception.work_end, exception.break_start, exception.break_end)} hours</span>
                  </div>
                  {exception.hourly_rate && (
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-muted-foreground">Hourly Rate:</span>
                      <span className="font-medium text-green-600">${exception.hourly_rate}/hr</span>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {exception.comment && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Note:</span> {exception.comment}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )
    }

    // Schedule card (for future days or days without sessions)
    if (schedule && !session && (isFuture || (!session && !exception))) {
      cards.push(
        <Card key="schedule" className="border-l-4 border-l-blue-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              Scheduled Work
            </CardTitle>
            <CardDescription>
              Weekly schedule • {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
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
                <span className="font-medium">{calculateWorkHours(schedule.work_start, schedule.work_end, schedule.break_start, schedule.break_end)} hours</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-muted-foreground">Hourly Rate:</span>
                <span className="font-medium text-green-600">${schedule.hourly_rate}/hr</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (cards.length === 0) {
      return (
        <Card className="text-center py-8">
          <CardContent>
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events</h3>
            <p className="text-muted-foreground">
              No work scheduled or recorded for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
          </CardContent>
        </Card>
      )
    }

    return <div className="space-y-4">{cards}</div>
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-muted-foreground">
            Please log in to view your work calendar.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Work Calendar</h1>
        <p className="text-muted-foreground">
          View your work schedule, sessions, and exceptions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Calendar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>
                Select a date to view details
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border w-full"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4 w-full",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-lg font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-12 font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 h-12 w-12",
                  day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
                components={{
                  DayContent: ({ date }) => {
                    const status = getDayStatus(date)
                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span className="relative z-10">{date.getDate()}</span>
                        {status.type !== 'none' && (
                          <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${status.color}`} />
                        )}
                      </div>
                    )
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span>Completed session</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span>Session with exception</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <span>Exception (normal)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span>Exception (sick/vacation)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <span>Scheduled day</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Day details */}
        <div className="space-y-4">
          <div className="sticky top-4">
            <h2 className="text-xl font-semibold mb-4">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
            {renderDayContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar