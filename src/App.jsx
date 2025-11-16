import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '../Layout'; // Adjusted path to root

// Import all your pages
import Dashboard from './Pages/Dashboard';
import Academics from './Pages/Academics';
import Announcements from './Pages/Announcements';
import Attendance from './Pages/Attendence'; // Corrected import
import DigitalID from './Pages/DigitalID';
import EventDetails from './Pages/EventDetails';
import Events from './Pages/Events';
import Exams from './Pages/Exams';
import Faculty from './Pages/Faculty';
import Help from './Pages/Help';
import Infrastructure from './Pages/Infrastructure';
import Library from './Pages/Library';
import Profile from './Pages/Profile';
import Schedule from './Pages/Schedule';

export default function App() {
  const location = useLocation();
  
  // This logic helps find the "name" of the current page for the Layout
  const getPageName = () => {
    const path = location.pathname.replace('/', '');
    if (path === '') return 'Dashboard';
    return path;
  };

  return (
    <Layout currentPageName={getPageName()}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Academics" element={<Academics />} />
        <Route path="/Announcements" element={<Announcements />} />
        <Route path="/Attendance" element={<Attendance />} />
        <Route path="/DigitalID" element={<DigitalID />} />
        <Route path="/EventDetails" element={<EventDetails />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/Exams" element={<Exams />} />
        <Route path="/Faculty" element={<Faculty />} />
        <Route path="/Help" element={<Help />} />
        <Route path="/Infrastructure" element={<Infrastructure />} />
        <Route path="/Library" element={<Library />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Schedule" element={<Schedule />} />
      </Routes>
    </Layout>
  );
}