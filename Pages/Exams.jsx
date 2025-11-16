import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { Exam } from "@/entities/all";

const examTypeColors = {
  "Mid-term": "bg-blue-100 text-blue-800 border-blue-200",
  "End-term": "bg-red-100 text-red-800 border-red-200",
  "Quiz": "bg-green-100 text-green-800 border-green-200",
  "Practical": "bg-purple-100 text-purple-800 border-purple-200",
  "Assignment": "bg-yellow-100 text-yellow-800 border-yellow-200"
};

const statusColors = {
  "Scheduled": "bg-blue-100 text-blue-800 border-blue-200",
  "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Completed": "bg-green-100 text-green-800 border-green-200",
  "Cancelled": "bg-red-100 text-red-800 border-red-200"
};

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const data = await Exam.list("exam_date");
      setExams(data);
    } catch (error) {
      console.error("Error loading exams:", error);
    }
    setIsLoading(false);
  };

  const getExamsByCategory = () => {
    const today = new Date();
    
    return {
      upcoming: exams.filter(exam => {
        const examDate = new Date(exam.exam_date);
        return examDate >= today && exam.status === "Scheduled";
      }),
      today: exams.filter(exam => {
        const examDate = new Date(exam.exam_date);
        return isToday(examDate) && exam.status === "Scheduled";
      }),
      completed: exams.filter(exam => {
        return exam.status === "Completed" || (isPast(new Date(exam.exam_date)) && exam.status === "Scheduled");
      })
    };
  };

  const getExamUrgency = (exam) => {
    const examDate = new Date(exam.exam_date);
    if (isToday(examDate)) return "today";
    if (isTomorrow(examDate)) return "tomorrow";
    return "normal";
  };

  const { upcoming, today, completed } = getExamsByCategory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              Examinations
            </h1>
            <p className="text-lg text-slate-600">View your exam schedule, seating arrangements, and results</p>
          </div>
        </div>

        {/* Today's Exams Alert */}
        {today.length > 0 && (
          <Card className="bg-red-50 border-red-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold text-red-800">Exams Today!</h2>
              </div>
              <div className="grid gap-4">
                {today.map((exam, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-red-800">{exam.subject_name}</h3>
                        <p className="text-sm text-red-600">{exam.exam_type}</p>
                      </div>
                      <div className="text-right text-red-700">
                        <p className="font-bold">{exam.exam_time}</p>
                        <p className="text-sm">Room {exam.room_number}</p>
                        {exam.seat_number && <p className="text-sm">Seat: {exam.seat_number}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid grid-cols-3 gap-1 bg-white p-2 rounded-xl shadow-sm">
            <TabsTrigger 
              value="upcoming"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger 
              value="today"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              Today ({today.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              Completed ({completed.length})
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Exams */}
          <TabsContent value="upcoming">
            <div className="grid gap-6">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-48 bg-white rounded-xl shadow-lg animate-pulse" />
                ))
              ) : upcoming.length > 0 ? (
                upcoming.map((exam, index) => {
                  const urgency = getExamUrgency(exam);
                  return (
                    <Card key={index} className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg ${
                      urgency === "tomorrow" ? "ring-2 ring-yellow-400" : ""
                    }`}>
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl font-bold text-slate-800">{exam.subject_name}</CardTitle>
                            <p className="text-slate-600">{exam.subject_code}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={examTypeColors[exam.exam_type]}>
                              {exam.exam_type}
                            </Badge>
                            {urgency === "tomorrow" && (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                Tomorrow
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <div>
                              <p className="font-medium text-slate-800">
                                {format(new Date(exam.exam_date), 'EEEE, MMMM d, yyyy')}
                              </p>
                              <p className="text-sm text-slate-600">Exam Date</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="font-medium text-slate-800">{exam.exam_time}</p>
                              <p className="text-sm text-slate-600">Duration: {exam.duration || "N/A"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-red-500" />
                            <div>
                              <p className="font-medium text-slate-800">Room {exam.room_number}</p>
                              {exam.seat_number && (
                                <p className="text-sm text-slate-600">Seat: {exam.seat_number}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          {exam.syllabus && (
                            <div className="mb-4">
                              <h4 className="font-medium text-slate-800 mb-2">Syllabus:</h4>
                              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                {exam.syllabus}
                              </p>
                            </div>
                          )}
                          {exam.instructions && (
                            <div>
                              <h4 className="font-medium text-slate-800 mb-2">Instructions:</h4>
                              <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
                                {exam.instructions}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-600 mb-2">No Upcoming Exams</h3>
                  <p className="text-slate-500">All caught up! No exams scheduled for now.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Today's Exams */}
          <TabsContent value="today">
            <div className="grid gap-6">
              {today.length > 0 ? (
                today.map((exam, index) => (
                  <Card key={index} className="bg-red-50 border-red-200 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-red-800">{exam.subject_name}</h3>
                          <p className="text-red-600">{exam.subject_code} • {exam.exam_type}</p>
                        </div>
                        <Badge className="bg-red-100 text-red-800 border-red-200 font-bold">
                          TODAY
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-red-500" />
                          <div>
                            <p className="font-bold text-red-800">{exam.exam_time}</p>
                            <p className="text-sm text-red-600">Duration: {exam.duration || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-red-500" />
                          <div>
                            <p className="font-bold text-red-800">Room {exam.room_number}</p>
                            {exam.seat_number && (
                              <p className="text-sm text-red-600">Seat: {exam.seat_number}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          <div>
                            <p className="font-bold text-red-800">Be Early!</p>
                            <p className="text-sm text-red-600">Arrive 30 min before</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-600 mb-2">No Exams Today</h3>
                  <p className="text-slate-500">Enjoy your day! No exams scheduled for today.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Completed Exams */}
          <TabsContent value="completed">
            <div className="grid gap-6">
              {completed.length > 0 ? (
                completed.map((exam, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg opacity-75">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-700">{exam.subject_name}</h3>
                          <p className="text-slate-500">{exam.subject_code} • {exam.exam_type}</p>
                          <p className="text-sm text-slate-500 mt-2">
                            {format(new Date(exam.exam_date), 'MMM d, yyyy')} at {exam.exam_time}
                          </p>
                        </div>
                        <Badge className={statusColors[exam.status] || "bg-green-100 text-green-800 border-green-200"}>
                          {exam.status === "Scheduled" ? "Completed" : exam.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-600 mb-2">No Completed Exams</h3>
                  <p className="text-slate-500">Completed exams will appear here.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}