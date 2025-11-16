
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Clock, TrendingUp, Calendar, Filter } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Attendance } from "@/entities/all";

const statusIcons = {
  "Present": <CheckCircle className="w-5 h-5 text-green-500" />,
  "Absent": <XCircle className="w-5 h-5 text-red-500" />,
  "Late": <Clock className="w-5 h-5 text-orange-500" />
};

const statusColors = {
  "Present": "bg-green-100 text-green-800 border-green-200",
  "Absent": "bg-red-100 text-red-800 border-red-200",
  "Late": "bg-orange-100 text-orange-800 border-orange-200"
};

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("current");
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const calculateStats = useCallback((data) => {
    const total = data.length;
    const present = data.filter(r => r.status === "Present").length;
    const absent = data.filter(r => r.status === "Absent").length;
    const late = data.filter(r => r.status === "Late").length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    setStats({ total, present, absent, late, percentage });
  }, []); // setStats is stable, so no dependencies for the function itself.

  const loadAttendance = useCallback(async () => {
    try {
      const data = await Attendance.list("-date");
      setAttendance(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error loading attendance:", error);
    }
    setIsLoading(false);
  }, [calculateStats]); // calculateStats is a dependency because it's called inside.

  const filterAttendance = useCallback(() => {
    let filtered = [...attendance];

    // Filter by subject
    if (selectedSubject !== "all") {
      filtered = filtered.filter(record => record.subject === selectedSubject);
    }

    // Filter by month
    if (selectedMonth !== "all") {
      const now = new Date();
      let startDate, endDate;

      if (selectedMonth === "current") {
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
      } else if (selectedMonth === "previous") {
        startDate = startOfMonth(subMonths(now, 1));
        endDate = endOfMonth(subMonths(now, 1));
      }

      if (startDate && endDate) {
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= startDate && recordDate <= endDate;
        });
      }
    }

    setFilteredAttendance(filtered);
  }, [attendance, selectedSubject, selectedMonth]); // Dependencies are the state variables used in the function.

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]); // loadAttendance is now stable due to useCallback, so it can be a dependency.

  useEffect(() => {
    filterAttendance();
  }, [filterAttendance]); // filterAttendance is now stable due to useCallback, so it can be a dependency.

  const getUniqueSubjects = () => {
    return [...new Set(attendance.map(record => record.subject))];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Attendance Records
            </h1>
            <p className="text-lg text-slate-600">Track your class attendance and performance</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Attendance Rate</p>
                  <p className="text-3xl font-bold mt-2">{stats.percentage}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Total Classes</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">{stats.total}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Present</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.present}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Absent</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stats.absent}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Records */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-2xl font-bold text-slate-800">Attendance History</CardTitle>
              <div className="flex flex-col md:flex-row gap-3">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {getUniqueSubjects().map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="current">Current Month</SelectItem>
                    <SelectItem value="previous">Previous Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record) => (
                    <div 
                      key={record.id}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300 bg-white hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-4 mb-3 md:mb-0">
                        {statusIcons[record.status]}
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">{record.subject}</h3>
                          <p className="text-sm text-slate-600">
                            {format(new Date(record.date), 'EEEE, MMMM d, yyyy')} • {record.time_slot}
                          </p>
                          <p className="text-xs text-slate-500">Faculty: {record.faculty_name}</p>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <Badge className={`${statusColors[record.status]} border font-medium px-3 py-1`}>
                          {record.status}
                        </Badge>
                        {record.remarks && (
                          <p className="text-xs text-slate-500 italic">{record.remarks}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Filter className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-600 mb-2">No Records Found</h3>
                    <p className="text-slate-500">Try adjusting your filters or check back later.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
