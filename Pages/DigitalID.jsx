import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  QrCode, 
  Download, 
  Share2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  User
} from "lucide-react";
import { Student } from "@/entities/all";

export default function DigitalIDPage() {
  const [student, setStudent] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      // For demo, load first student record
      const students = await Student.list();
      if (students.length > 0) {
        setStudent(students[0]);
      }
    } catch (error) {
      console.error("Error loading student data:", error);
    }
    setIsLoading(false);
  };

  const generateQRData = () => {
    return JSON.stringify({
      id: student.student_id,
      name: student.full_name || "Student Name",
      course: student.course,
      year: student.year,
      semester: student.semester,
      valid: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-blue-600" />
              Digital ID Card
            </h1>
            <p className="text-lg text-slate-600">Your official student identification card</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="h-96 bg-white rounded-xl shadow-lg animate-pulse" />
            <div className="h-48 bg-white rounded-xl shadow-lg animate-pulse" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Digital ID Card */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full transform translate-x-10 -translate-y-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full transform -translate-x-10 translate-y-10" />
              
              <CardContent className="p-8 relative z-10">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left Section - Photo and Basic Info */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border-2 border-white/30">
                      <span className="text-4xl font-bold text-white">
                        {(student.student_id || "ST").substring(0, 2)}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      {student.full_name || "Student Name"}
                    </h2>
                    <Badge className="bg-white/20 text-white border-white/30 font-medium">
                      {student.student_id || "STU001"}
                    </Badge>
                  </div>

                  {/* Middle Section - Academic Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-blue-200" />
                      <div>
                        <p className="text-blue-100 text-sm">Course</p>
                        <p className="font-semibold">{student.course || "Course Name"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-200" />
                      <div>
                        <p className="text-blue-100 text-sm">Academic Year</p>
                        <p className="font-semibold">{student.year || "1st Year"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-200" />
                      <div>
                        <p className="text-blue-100 text-sm">Semester</p>
                        <p className="font-semibold">{student.semester || "1st Semester"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - QR Code */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mb-3">
                      <QrCode className="w-24 h-24 text-slate-700" />
                    </div>
                    <p className="text-blue-100 text-xs text-center">
                      Scan for verification
                    </p>
                  </div>
                </div>

                {/* College Info Footer */}
                <div className="mt-8 pt-6 border-t border-white/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">EduPortal College</h3>
                      <p className="text-blue-100 text-sm">Official Student ID</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-100 text-sm">Valid Until</p>
                      <p className="font-semibold">Dec 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-slate-500">Phone</p>
                        <p className="font-medium text-slate-800">{student.phone}</p>
                      </div>
                    </div>
                  )}
                  {student.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="font-medium text-slate-800">{student.email}</p>
                      </div>
                    </div>
                  )}
                  {student.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-sm text-slate-500">Address</p>
                        <p className="font-medium text-slate-800">{student.address}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.guardian_name && (
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-slate-500">Guardian Name</p>
                        <p className="font-medium text-slate-800">{student.guardian_name}</p>
                      </div>
                    </div>
                  )}
                  {student.guardian_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-slate-500">Guardian Phone</p>
                        <p className="font-medium text-slate-800">{student.guardian_phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 font-medium text-sm">
                        🚨 Emergency: Call Campus Security at +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Instructions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-blue-600" />
                  How to Use Your Digital ID
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Library Access</h3>
                    <p className="text-sm text-slate-600">Show QR code to access library resources and borrow books</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Exam Entry</h3>
                    <p className="text-sm text-slate-600">Present ID for examination hall entry and verification</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Campus Events</h3>
                    <p className="text-sm text-slate-600">Use QR code for event registration and attendance tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}