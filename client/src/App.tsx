import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import UsersList from './pages/users/usersList'
import SchedulesList from './pages/schedules/schedulesList'
import Register from './pages/users/Register'
import Login from './pages/users/login'
import NavBar from './component/NavBar'

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/schedules" element={<SchedulesList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  )
}

// Simple Home component
function Home() {
  return (
    <div className="home">
      <h1>Welcome to HowMuch</h1>
      <p>Manage your work schedules and users</p>
      <div className="home-links">
        <Link to="/users" className="home-link">View Users</Link>
        <Link to="/schedules" className="home-link">View Schedules</Link>
      </div>
    </div>
  )
}

export default App
