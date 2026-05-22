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



function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route path='/dashboard' element={<ProtectedRoute><SidebarLayout><Dashboard /></SidebarLayout></ProtectedRoute>} />
        <Route path='/slotarea' element={<SlotArea />} />
        <Route path='/slotarea/:id' element={<SlotDetails />} />
        <Route path='/booking' element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>

  ) 
}

export default App