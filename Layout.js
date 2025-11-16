import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, LogOut, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Student } from "@/entities/all"; // For user info

const navLinks = [
  { title: "Dashboard", url: createPageUrl("Dashboard") },
  { title: "My Schedule", url: createPageUrl("Schedule") },
  { title: "Attendance", url: createPageUrl("Attendance") },
  { title: "Academics", url: createPageUrl("Academics") },
  { title: "Exams", url: createPageUrl("Exams") },
  { title: "Faculty Directory", url: createPageUrl("Faculty") },
  { title: "Library", url: createPageUrl("Library") },
  { title: "Digital ID", url: createPageUrl("DigitalID") },
  { title: "Announcements", url: createPageUrl("Announcements") },
  { title: "Campus Info", url: createPageUrl("Infrastructure") },
  { title: "Information Desk", url: createPageUrl("Help") },
  { title: "Profile", url: createPageUrl("Profile") },
];

export default function Layout({ children, currentPageName }) {
  const [student, setStudent] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const students = await Student.list();
        if (students.length > 0) {
          setStudent(students[0]);
        }
      } catch (e) {
        console.error("Failed to fetch student data", e);
      }
    };
    fetchStudent();
  }, []);

  return (
    <>
      <style>{`
        :root {
          --background: 240 10% 98%;
          --foreground: 240 5% 10%;
          --card: 0 0% 100%;
          --card-foreground: 240 5% 10%;
          --popover: 0 0% 100%;
          --popover-foreground: 240 5% 10%;
          --primary: 153 69% 20%; /* Dark Green */
          --primary-foreground: 0 0% 100%;
          --secondary: 40 43% 90%; /* Light Beige */
          --secondary-foreground: 153 69% 20%;
          --muted: 240 5% 90%;
          --muted-foreground: 240 4% 45%;
          --accent: 240 5% 90%;
          --accent-foreground: 153 69% 20%;
          --destructive: 0 84% 60%;
          --destructive-foreground: 0 0% 100%;
          --border: 240 6% 90%;
          --input: 240 6% 90%;
          --ring: 153 69% 20%;
          --radius: 0.5rem;
        }
        body {
          background-color: hsl(40, 43%, 93%);
          color: hsl(var(--foreground));
        }
        .dark-green-bg { background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); }
        .light-beige-bg { background-color: hsl(var(--secondary)); color: hsl(var(--secondary-foreground)); }
      `}</style>
      <div className="min-h-screen flex flex-col bg-[hsl(var(--secondary))]">
        <header className="dark-green-bg shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to={createPageUrl('Dashboard')} className="flex-shrink-0 flex items-center gap-2">
                   <img className="h-10 w-auto" src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c5432219c137bd593aecf9/61ab5f727_IMG-20250922-WA0002.jpg" alt="GITAM Logo" style={{filter: 'brightness(0) invert(1)', height: '40px', objectFit: 'contain', width: 'auto'}}/>
                  <span className="text-white font-bold text-xl hidden md:block">EduPortal</span>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                 <Link to={createPageUrl('Profile')}>
                  {student?.student_id ? (
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {student.student_id.substring(0, 2)}
                        </span>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                 </Link>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <LogOut className="w-5 h-5" />
                </Button>
                <div className="md:hidden">
                  <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden dark-green-bg border-t border-green-800">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map(link => (
                   <Link
                    key={link.title}
                    to={link.url}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.url ? 'bg-green-900 text-white' : 'text-green-100 hover:bg-green-700 hover:text-white'}`}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </header>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}