import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Student } from "@/entities/all";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  CalendarDays,
  Receipt,
  HeartPulse,
  Calendar,
  Users,
  FileText,
  Fingerprint,
  Bell,
  AlertOctagon,
  User,
  GraduationCap
} from "lucide-react";

const dashboardItems = [
  { title: "Digital ID", icon: CreditCard, url: "DigitalID" },
  { title: "Events", icon: CalendarDays, url: "Events" },
  { title: "Schedule", icon: Calendar, url: "Schedule" },
  { title: "Academics", icon: GraduationCap, url: "Academics" },
  { title: "Attendance", icon: Fingerprint, url: "Attendance" },
  { title: "Announcements", icon: Bell, url: "Announcements" },
  { title: "Directory", icon: Users, url: "Faculty" },
  { title: "Library", icon: FileText, url: "Library" },
  { title: "Exams", icon: FileText, url: "Exams" },
  { title: "Help Desk", icon: AlertOctagon, url: "Help" },
];

const ActionItem = ({ item }) => (
  <Link to={createPageUrl(item.url)} className="flex flex-col items-center justify-center text-center gap-2 p-2 group">
    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-primary/10 transition-colors duration-200">
      <item.icon className="w-7 h-7 text-primary/80 group-hover:text-primary" />
    </div>
    <p className="text-sm font-medium text-gray-700 group-hover:text-primary">{item.title}</p>
  </Link>
);

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      setIsLoading(true);
      try {
        const students = await Student.list();
        if (students.length > 0) {
          setStudent(students[0]);
        }
      } catch (e) {
        console.error("Failed to fetch student data", e);
      }
      setIsLoading(false);
    };
    fetchStudent();
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Profile Card */}
      <div className="dark-green-bg rounded-lg shadow-lg p-4 flex items-center gap-4 text-white">
        <div className="w-16 h-16 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center">
           {student?.student_id ? (
            <span className="text-white font-bold text-2xl">
              {student.student_id.substring(0, 2)}
            </span>
          ) : (
            <User className="w-8 h-8 text-white" />
          )}
        </div>
        <div className="flex-grow">
          {isLoading ? (
             <div className="space-y-2">
                <div className="h-6 bg-white/20 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-white/20 rounded w-1/2 animate-pulse"></div>
              </div>
          ) : student ? (
            <>
              <h2 className="font-bold text-lg">{student.full_name || "Student Name"}</h2>
              <p className="text-sm opacity-90">{student.student_id}</p>
            </>
          ) : (
             <p>No student data found.</p>
          )}
        </div>
        <Link to={createPageUrl('Profile')} className="flex-shrink-0">
          <Button variant="ghost" className="text-white hover:bg-white/20">
            View Profile
          </Button>
        </Link>
      </div>

      {/* Actions Grid */}
      <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md">
         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-6 gap-x-4">
          {dashboardItems.map(item => <ActionItem key={item.title} item={item} />)}
        </div>
      </div>
      
       <div className="text-center mt-8">
        <p className="text-sm text-gray-500">POWERED BY EduPortal</p>
      </div>
    </div>
  );
}