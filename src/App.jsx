import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import ProtectedRoute from "./components/ProtectedRoute";
import SlotDetails from './pages/SlotDetails';
import SlotArea from './pages/SlotArea';
import Booking from './pages/Booking';
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import SidebarLayout from './components/SidebarLayout';
import Favourites from "./pages/Favourites";
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from "./components/AdminAnalytics";



function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/slotarea' element={<SlotArea />} />
        <Route path='/slotarea/:id' element={<SlotDetails />} />
        <Route path="/contact" element={<Contact />} />

        {/*Protected Routes */}

        <Route path='/dashboard' element={<ProtectedRoute allowedRole="user"><SidebarLayout><Dashboard /></SidebarLayout></ProtectedRoute>} />
        <Route path='/booking' element={<ProtectedRoute allowedRole="user"><Booking /></ProtectedRoute>} />
        <Route path="/favourites" element={<ProtectedRoute allowedRole="user"><Favourites /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="admin"><SidebarLayout><AdminDashboard /></SidebarLayout></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<SidebarLayout><AdminAnalytics /></SidebarLayout>} />

      </Routes>
    </BrowserRouter>

  )
}

export default App