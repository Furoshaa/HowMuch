import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import UsersList from './pages/users/usersList'
import SchedulesList from './pages/schedules/schedulesList'
import Register from './pages/users/Register'
import Login from './pages/users/Login'
import Dashboard from './pages/dashboard'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import Test from './pages/test'
import { Button } from '@/components/ui/button'
import OffsetBorderButton from '@/components/ui/OffsetBorderButton'
import { AlertProvider } from '@/components/ui/alert-context'
import { AlertContainer } from '@/components/ui/alert-container'

function App() {
  return (
    <AlertProvider>
      <div className="min-h-screen bg-background font-sans antialiased">
        <NavBar />
        <AlertContainer />
        <main className="container mx-auto px-4 py-8">          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/schedules" element={<SchedulesList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/test" element={<Test />} />
          </Routes>
        </main>
      </div>
    </AlertProvider>
  )
}

// Simple Home component
function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Welcome to <span>HowMuch</span>
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Manage your work schedules and users efficiently with our comprehensive time tracking platform
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link to="/users">View Users</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/schedules">View Schedules</Link>
        </Button>
      </div>

      <div className="mt-16">
        <OffsetBorderButton 
          offset={4} 
          borderRadius={16}
          onClick={() => navigate('/login')}
        >
          Login
        </OffsetBorderButton>
      </div>

    </div>
  )
}

export default App
