import { Routes, Route, Link } from 'react-router-dom'
import Register from './pages/users/Register'
import Login from './pages/users/login'
import Dashboard from './pages/dashboard'
import Schedules from './pages/schedules'
import Calendar from './pages/Calendar'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import Test from './pages/test'
import Foutu from './components/MoneyCounter'
import { Button } from '@/components/ui/button'
import { AlertProvider } from '@/components/ui/alert-context'
import { AlertContainer } from '@/components/ui/alert-container'

function App() {
  return (
    <AlertProvider>
      <div className="min-h-screen bg-background font-sans antialiased">
        <NavBar />
        <AlertContainer />
        <main className="container mx-auto px-4 py-8 animate-fade-in-up animate-delay-200">          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/foutu" element={<Foutu />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/schedules" element={
              <ProtectedRoute>
                <Schedules />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <Calendar />
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

  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-4 animate-fade-in-up animate-delay-100">
        Welcome to <span>HowMuch</span>
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in-up animate-delay-200">
        Manage your work schedules and users efficiently with our comprehensive time tracking platform
      </p>
      <div className="flex gap-4 animate-fade-in-scale animate-delay-300">
        <Button asChild size="lg" className="hover-lift">
          <Link to="/users">View Users</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="hover-lift">
          <Link to="/schedules">View Schedules</Link>
        </Button>
      </div>
    </div>
  )
}

export default App
