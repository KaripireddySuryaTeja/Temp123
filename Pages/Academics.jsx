
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Trophy, TrendingUp, Calendar, BarChart3, GraduationCap } from "lucide-react";
import { AcademicRecord } from "@/entities/all";

const gradePoints = {
  "A+": 10, "A": 9, "B+": 8, "B": 7, "C+": 6, "C": 5, "D": 4, "F": 0
};

const gradeColors = {
  "A+": "bg-green-100 text-green-800 border-green-200",
  "A": "bg-green-100 text-green-800 border-green-200", 
  "B+": "bg-blue-100 text-blue-800 border-blue-200",
  "B": "bg-blue-100 text-blue-800 border-blue-200",
  "C+": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "C": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "D": "bg-orange-100 text-orange-800 border-orange-200",
  "F": "bg-red-100 text-red-800 border-red-200"
};

export default function AcademicsPage() {
  const [records, setRecords] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});

  const calculateStats = useCallback((data) => {
    if (data.length === 0) {
      setStats({ cgpa: 0, totalCredits: 0, semesterGPAs: [] });
      return;
    }

    const semesterGroups = data.reduce((acc, record) => {
      if (!acc[record.semester]) acc[record.semester] = [];
      acc[record.semester].push(record);
      return acc;
    }, {});

    const semesterGPAs = Object.entries(semesterGroups).map(([semester, records]) => {
      const totalCredits = records.reduce((sum, r) => sum + (r.credits || 0), 0);
      const totalPoints = records.reduce((sum, r) => sum + (gradePoints[r.grade] || 0) * (r.credits || 0), 0);
      const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
      return { semester, gpa: parseFloat(gpa), credits: totalCredits };
    });

    const totalCredits = data.reduce((sum, r) => sum + (r.credits || 0), 0);
    const totalPoints = data.reduce((sum, r) => sum + (gradePoints[r.grade] || 0) * (r.credits || 0), 0);
    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

    setStats({ cgpa: parseFloat(cgpa), totalCredits, semesterGPAs });
  }, []); // gradePoints is a constant outside the component, setStats is a stable dispatcher

  const loadAcademicRecords = useCallback(async () => {
    try {
      const data = await AcademicRecord.list("-semester");
      setRecords(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error loading academic records:", error);
    }
    setIsLoading(false);
  }, [calculateStats]); // calculateStats, setRecords, setIsLoading are dependencies

  useEffect(() => {
    loadAcademicRecords();
  }, [loadAcademicRecords]);

  const getFilteredRecords = () => {
    if (selectedSemester === "all") return records;
    return records.filter(record => record.semester === selectedSemester);
  };

  const getUniqueSemesters = () => {
    return [...new Set(records.map(record => record.semester))];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              Academic Records
            </h1>
            <p className="text-lg text-slate-600">Track your academic performance and progress</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">CGPA</p>
                  <p className="text-4xl font-bold mt-2">{stats.cgpa || "0.00"}</p>
                </div>
                <Trophy className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Total Credits</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">{stats.totalCredits || 0}</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Semesters</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">{getUniqueSemesters().length}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="grid grid-cols-2 gap-1 bg-white p-2 rounded-xl shadow-sm">
            <TabsTrigger 
              value="records"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              Grade Records
            </TabsTrigger>
            <TabsTrigger 
              value="progress"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              Progress Chart
            </TabsTrigger>
          </TabsList>

          {/* Grade Records Tab */}
          <TabsContent value="records">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle className="text-2xl font-bold text-slate-800">Academic Records</CardTitle>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Filter by semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      {getUniqueSemesters().map((semester) => (
                        <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    {getFilteredRecords().length > 0 ? (
                      getFilteredRecords().map((record, index) => (
                        <div 
                          key={index}
                          className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300 bg-white hover:bg-slate-50"
                        >
                          <div className="flex-1 mb-3 md:mb-0">
                            <h3 className="text-lg font-semibold text-slate-800">{record.subject_name}</h3>
                            <p className="text-sm text-slate-600">{record.subject_code} • {record.semester}</p>
                            {record.marks && (
                              <p className="text-sm text-slate-500">
                                Marks: {record.marks}/{record.max_marks || 100}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-slate-500">Credits</p>
                              <p className="font-bold text-slate-800">{record.credits || 0}</p>
                            </div>
                            <Badge className={`${gradeColors[record.grade]} border font-bold text-lg px-3 py-1`}>
                              {record.grade}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-medium text-slate-600 mb-2">No Records Found</h3>
                        <p className="text-slate-500">Academic records will appear here once they're available.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Chart Tab */}
          <TabsContent value="progress">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Semester-wise Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.semesterGPAs && stats.semesterGPAs.length > 0 ? (
                  <div className="space-y-4">
                    {stats.semesterGPAs.map((sem, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-slate-800">{sem.semester}</h3>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-600">{sem.credits} credits</span>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              GPA: {sem.gpa}
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${(sem.gpa / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-600 mb-2">No Progress Data</h3>
                    <p className="text-slate-500">Academic progress charts will appear here once you have semester results.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
