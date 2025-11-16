import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const typeColors = {
  "Lecture": "bg-blue-100 text-blue-800 border-blue-200",
  "Lab": "bg-green-100 text-green-800 border-green-200",
  "Tutorial": "bg-purple-100 text-purple-800 border-purple-200",
  "Break": "bg-orange-100 text-orange-800 border-orange-200"
};

export default function TodaySchedule({ schedule, isLoading }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-600" />
          Today's Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4 border border-slate-200 rounded-xl">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48 mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : schedule.length > 0 ? (
          <div className="space-y-4">
            {schedule.map((class_, index) => (
              <div 
                key={index}
                className="p-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-slate-800">{class_.subject}</h3>
                  <Badge className={`${typeColors[class_.type]} border font-medium`}>
                    {class_.type}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{class_.time_slot}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-4 h-4" />
                    <span>{class_.faculty_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>Room {class_.room_number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">No Classes Today</h3>
            <p className="text-slate-500">Enjoy your free day!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}