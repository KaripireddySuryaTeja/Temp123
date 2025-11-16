import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, History } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const statusIcons = {
  "Present": <CheckCircle className="w-4 h-4 text-green-500" />,
  "Absent": <XCircle className="w-4 h-4 text-red-500" />,
  "Late": <Clock className="w-4 h-4 text-orange-500" />
};

const statusColors = {
  "Present": "bg-green-100 text-green-800 border-green-200",
  "Absent": "bg-red-100 text-red-800 border-red-200", 
  "Late": "bg-orange-100 text-orange-800 border-orange-200"
};

export default function RecentAttendance({ attendance, isLoading }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          Recent Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
                <Skeleton className="w-4 h-4 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : attendance.length > 0 ? (
          <div className="space-y-3">
            {attendance.slice(0, 5).map((record) => (
              <div 
                key={record.id}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {statusIcons[record.status]}
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{record.subject}</p>
                    <p className="text-xs text-slate-500">{format(new Date(record.date), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <Badge className={`${statusColors[record.status]} border font-medium text-xs`}>
                  {record.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <History className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm">No attendance records yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}