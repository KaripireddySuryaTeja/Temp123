import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const colorMap = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600", 
  purple: "from-purple-500 to-purple-600",
  orange: "from-orange-500 to-orange-600"
};

export default function StatsCard({ title, value, icon: Icon, color, trend }) {
  return (
    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-r ${colorMap[color]} opacity-5 rounded-full transform translate-x-8 -translate-y-8`} />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-r ${colorMap[color]} shadow-md`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span className="text-green-600 font-medium">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}