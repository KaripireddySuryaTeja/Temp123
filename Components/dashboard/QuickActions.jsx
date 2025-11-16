import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, CheckSquare, Users, Building, HelpCircle, Zap } from "lucide-react";

const actions = [
  {
    title: "View Schedule",
    description: "Check today's classes",
    icon: Calendar,
    url: "Schedule",
    color: "blue"
  },
  {
    title: "Attendance",
    description: "View your records",
    icon: CheckSquare,
    url: "Attendance", 
    color: "green"
  },
  {
    title: "Faculty Directory",
    description: "Contact information",
    icon: Users,
    url: "Faculty",
    color: "purple"
  },
  {
    title: "Get Help",
    description: "Information desk",
    icon: HelpCircle,
    url: "Help",
    color: "orange"
  }
];

const colorMap = {
  blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  green: "bg-green-50 text-green-600 hover:bg-green-100",
  purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
  orange: "bg-orange-50 text-orange-600 hover:bg-orange-100"
};

export default function QuickActions() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link key={action.title} to={createPageUrl(action.url)}>
              <Button
                variant="outline"
                className={`w-full h-auto p-4 flex flex-col items-center gap-2 border-0 ${colorMap[action.color]} transition-all duration-200 hover:shadow-md`}
              >
                <action.icon className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-semibold text-sm">{action.title}</p>
                  <p className="text-xs opacity-80">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}