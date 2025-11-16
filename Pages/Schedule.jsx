
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, User, BookOpen, Edit, Plus, Trash2, Check } from "lucide-react";
import { Schedule } from "@/entities/all";
import ScheduleForm from "../components/schedule/ScheduleForm"; 

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayAbbreviations = {"Monday": "Mon", "Tuesday": "Tue", "Wednesday": "Wed", "Thursday": "Thu", "Friday": "Fri", "Saturday": "Sat"};

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [activeDay, setActiveDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));

  useEffect(() => {
    if (!daysOfWeek.includes(activeDay)) {
        setActiveDay("Monday");
    }
  }, [activeDay]);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    setIsLoading(true);
    try {
      const data = await Schedule.list();
      setSchedule(data);
    } catch (error) {
      console.error("Error loading schedule:", error);
    }
    setIsLoading(false);
  };

  const getScheduleForDay = (day) => {
    return schedule
      .filter(s => s.day_of_week === day)
      .sort((a, b) => a.time_slot.localeCompare(b.time_slot));
  };

  const handleSave = async (classData) => {
    try {
      if (classData.id) {
        await Schedule.update(classData.id, classData);
      } else {
        await Schedule.create(classData);
      }
      setShowForm(false);
      setEditingClass(null);
      loadSchedule();
    } catch (error) {
      console.error("Error saving schedule item:", error);
    }
  };

  const handleDelete = async (classId) => {
    if (window.confirm("Are you sure you want to delete this class? This action cannot be undone.")) {
      try {
        await Schedule.delete(classId);
        loadSchedule();
      } catch (error) {
        console.error("Error deleting schedule item:", error);
      }
    }
  };

  const handleAddClick = (day) => {
    setEditingClass(null);
    setActiveDay(day);
    setShowForm(true);
  };

  const handleEditClick = (classData) => {
    setEditingClass(classData);
    setShowForm(true);
  };

  return (
    <div className="bg-[hsl(var(--secondary))] p-0 md:p-4">
       <Tabs defaultValue={activeDay} onValueChange={setActiveDay} className="w-full">
         <div className="dark-green-bg p-4 rounded-t-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-white">Time Table</h1>
                <Button onClick={() => setIsEditing(!isEditing)} size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Done" : "Edit"}
                </Button>
            </div>
            <TabsList className="grid w-full grid-cols-6 bg-transparent p-0">
                {daysOfWeek.map((day) => (
                <TabsTrigger 
                    key={day} 
                    value={day}
                    className="text-white/80 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md"
                >
                    {dayAbbreviations[day]}
                </TabsTrigger>
                ))}
            </TabsList>
         </div>

        <div className="p-4 bg-card rounded-b-lg">
          {daysOfWeek.map((day) => (
            <TabsContent key={day} value={day} className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-primary">{day}</h2>
                {isEditing && <Button size="sm" onClick={() => handleAddClick(day)}><Plus className="w-4 h-4 mr-1"/>Add</Button>}
              </div>

              {isLoading ? (
                 <div className="space-y-3">
                    <div className="h-16 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-16 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-16 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              ) : getScheduleForDay(day).length > 0 ? (
                <div className="space-y-3">
                  {getScheduleForDay(day).map((classItem) => (
                    <div key={classItem.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex items-center">
                        <div className="flex-grow">
                            <p className="text-sm text-gray-500">{classItem.time_slot}</p>
                            <p className="font-semibold text-gray-800">{classItem.subject}</p>
                            <p className="text-sm text-gray-600">{classItem.faculty_name}</p>
                        </div>
                        {isEditing && (
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditClick(classItem)}><Edit className="w-4 h-4"/></Button>
                                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(classItem.id)}><Trash2 className="w-4 h-4"/></Button>
                            </div>
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                    <Calendar className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">No classes scheduled for {day}.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </div>
       </Tabs>
       <ScheduleForm
        open={showForm}
        onOpenChange={setShowForm}
        onSave={handleSave}
        classData={editingClass}
        day={activeDay}
      />
    </div>
  );
}
