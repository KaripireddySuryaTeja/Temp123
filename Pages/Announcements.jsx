
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Megaphone, 
  Search, 
  Filter, 
  Calendar,
  AlertTriangle,
  Info,
  Star,
  Clock,
  Paperclip
} from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { Announcement } from "@/entities/all";

const categoryColors = {
  "Academic": "bg-blue-100 text-blue-800 border-blue-200",
  "Events": "bg-purple-100 text-purple-800 border-purple-200",
  "Holidays": "bg-green-100 text-green-800 border-green-200",
  "Exams": "bg-red-100 text-red-800 border-red-200",
  "Important": "bg-orange-100 text-orange-800 border-orange-200",
  "General": "bg-slate-100 text-slate-800 border-slate-200"
};

const priorityIcons = {
  "Low": <Info className="w-4 h-4" />,
  "Medium": <Clock className="w-4 h-4" />,
  "High": <Star className="w-4 h-4" />,
  "Urgent": <AlertTriangle className="w-4 h-4" />
};

const priorityColors = {
  "Low": "bg-gray-100 text-gray-800 border-gray-200",
  "Medium": "bg-blue-100 text-blue-800 border-blue-200", 
  "High": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Urgent": "bg-red-100 text-red-800 border-red-200"
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadAnnouncements = useCallback(async () => {
    try {
      const data = await Announcement.list("-created_date");
      setAnnouncements(data);
    } catch (error) {
      console.error("Error loading announcements:", error);
    }
    setIsLoading(false);
  }, []); // No external dependencies are needed here, setAnnouncements and setIsLoading are stable

  const filterAnnouncements = useCallback(() => {
    let filtered = [...announcements];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(announcement => announcement.category === selectedCategory);
    }

    // Priority filter
    if (selectedPriority !== "all") {
      filtered = filtered.filter(announcement => announcement.priority === selectedPriority);
    }

    // Sort by priority (Urgent first) then by date
    filtered.sort((a, b) => {
      const priorityOrder = { "Urgent": 4, "High": 3, "Medium": 2, "Low": 1 };
      const aPriority = priorityOrder[a.priority] || 1;
      const bPriority = priorityOrder[b.priority] || 1;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return new Date(b.created_date) - new Date(a.created_date);
    });

    setFilteredAnnouncements(filtered);
  }, [announcements, searchTerm, selectedCategory, selectedPriority]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]); // Depend on the useCallback-wrapped loadAnnouncements

  useEffect(() => {
    filterAnnouncements();
  }, [filterAnnouncements]); // Depend on the useCallback-wrapped filterAnnouncements

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };

  const getUniqueCategories = () => {
    return [...new Set(announcements.map(announcement => announcement.category))];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-blue-600" />
              Announcements
            </h1>
            <p className="text-lg text-slate-600">Stay updated with important college news and updates</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-lg border-slate-200 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {getUniqueCategories().map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <div className="space-y-6">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-xl shadow-lg animate-pulse" />
            ))
          ) : filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <Card 
                key={announcement.id} 
                className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  announcement.priority === "Urgent" ? "ring-2 ring-red-400" : ""
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl font-bold text-slate-800">
                          {announcement.title}
                        </CardTitle>
                        {announcement.priority === "Urgent" && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 font-bold animate-pulse">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            URGENT
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(announcement.created_date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <span>By {announcement.author}</span>
                        </div>
                        {announcement.target_audience && (
                          <div className="flex items-center gap-1">
                            <span>• {announcement.target_audience}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={categoryColors[announcement.category]}>
                        {announcement.category}
                      </Badge>
                      <Badge className={`${priorityColors[announcement.priority]} flex items-center gap-1`}>
                        {priorityIcons[announcement.priority]}
                        {announcement.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    {announcement.content}
                  </p>
                  
                  {announcement.attachments && announcement.attachments.length > 0 && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Paperclip className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">Attachments:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {announcement.attachments.map((attachment, index) => (
                          <a 
                            key={index}
                            href={attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                          >
                            Attachment {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {announcement.valid_until && new Date(announcement.valid_until) > new Date() && (
                    <div className="mt-4 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Valid until: {format(new Date(announcement.valid_until), "MMM d, yyyy")}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Megaphone className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-600 mb-2">No Announcements Found</h3>
              <p className="text-slate-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
