import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Trophy,
  Search,
  Filter,
  Star,
  ExternalLink,
  Bell,
  BellRing
} from "lucide-react";
import { format, isPast, isToday, isFuture } from "date-fns";
import { Event, EventRegistration, Student } from "@/entities/all";

const categoryColors = {
  "Tech": "bg-blue-100 text-blue-800 border-blue-200",
  "Cultural": "bg-purple-100 text-purple-800 border-purple-200",
  "Sports": "bg-green-100 text-green-800 border-green-200",
  "Club": "bg-orange-100 text-orange-800 border-orange-200",
  "Workshop": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Seminar": "bg-pink-100 text-pink-800 border-pink-200",
  "Competition": "bg-red-100 text-red-800 border-red-200"
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [student, setStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    try {
      const [eventsData, studentsData, registrationsData] = await Promise.all([
        Event.list("event_date"),
        Student.list(),
        EventRegistration.list()
      ]);
      setEvents(eventsData);
      setRegistrations(registrationsData);
      if (studentsData.length > 0) {
        setStudent(studentsData[0]);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    }
    setIsLoading(false);
  }, []);

  const filterEvents = useCallback(() => {
    let filtered = [...events];

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  const getEventsByStatus = () => {
    return {
      upcoming: filteredEvents.filter(e => isFuture(new Date(e.event_date)) && e.status === "Upcoming"),
      today: filteredEvents.filter(e => isToday(new Date(e.event_date))),
      past: filteredEvents.filter(e => isPast(new Date(e.event_date)) && e.status === "Completed")
    };
  };

  const getUniqueCategories = () => {
    return [...new Set(events.map(event => event.category))];
  };

  const handleRemindMe = async (event) => {
    if (!student) return;

    const existingReg = registrations.find(
      r => r.event_id === event.id && r.student_id === student.student_id
    );

    if (existingReg) {
      await EventRegistration.update(existingReg.id, {
        ...existingReg,
        remind_me: !existingReg.remind_me
      });
    } else {
      const qrData = JSON.stringify({
        eventId: event.id,
        studentId: student.student_id,
        name: student.full_name || "Student",
        timestamp: new Date().toISOString()
      });

      await EventRegistration.create({
        event_id: event.id,
        student_id: student.student_id,
        student_name: student.full_name || "Student",
        student_email: student.email || "",
        remind_me: true,
        qr_code: qrData
      });
    }

    loadEvents();
  };

  const isReminderSet = (eventId) => {
    if (!student) return false;
    const reg = registrations.find(
      r => r.event_id === eventId && r.student_id === student.student_id
    );
    return reg?.remind_me || false;
  };

  const { upcoming, today, past } = getEventsByStatus();

  const EventCard = ({ event }) => (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      {event.poster_url && (
        <div className="h-48 overflow-hidden rounded-t-xl">
          <img src={event.poster_url} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-bold text-slate-800 flex-1">{event.title}</CardTitle>
          <Badge className={categoryColors[event.category]}>
            {event.category}
          </Badge>
        </div>
        <p className="text-sm text-slate-600 line-clamp-3">{event.description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{format(new Date(event.event_date), 'MMM d, yyyy')}</span>
            {event.event_time && (
              <>
                <Clock className="w-4 h-4 text-green-500 ml-2" />
                <span>{event.event_time}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="w-4 h-4 text-purple-500" />
            <span className="line-clamp-1">By {event.organizer}</span>
          </div>
        </div>

        {event.prizes && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Trophy className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-amber-700 font-semibold mb-1">Prizes & Rewards</p>
                <p className="text-xs text-amber-800 line-clamp-2">{event.prizes}</p>
              </div>
            </div>
          </div>
        )}

        {event.registration_link && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
            <a 
              href={event.registration_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between text-sm text-blue-700 hover:text-blue-900"
            >
              <span className="font-medium">Register Now</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {event.average_rating && (
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{event.average_rating.toFixed(1)}/5</span>
          </div>
        )}

        <div className="pt-2 flex gap-2">
          <Link to={createPageUrl(`EventDetails?id=${event.id}`)} className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90">
              View Full Details
            </Button>
          </Link>
          <Button 
            variant={isReminderSet(event.id) ? "default" : "outline"}
            size="icon"
            onClick={() => handleRemindMe(event)}
            title={isReminderSet(event.id) ? "Reminder set" : "Set reminder"}
          >
            {isReminderSet(event.id) ? (
              <BellRing className="w-4 h-4" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              Campus Events
            </h1>
            <p className="text-lg text-slate-600">Discover and register for exciting campus activities</p>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-lg border-slate-200 focus:border-blue-500"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-64">
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
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid grid-cols-3 gap-1 bg-white p-2 rounded-xl shadow-sm">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="today" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white">
              Today ({today.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Past ({past.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-96 bg-white rounded-xl shadow-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.length > 0 ? (
                  upcoming.map(event => <EventCard key={event.id} event={event} />)
                ) : (
                  <div className="col-span-full text-center py-16">
                    <Calendar className="w-20 h-20 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-medium text-slate-600 mb-2">No Upcoming Events</h3>
                    <p className="text-slate-500">Check back later for new events!</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="today">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {today.length > 0 ? (
                today.map(event => <EventCard key={event.id} event={event} />)
              ) : (
                <div className="col-span-full text-center py-16">
                  <Calendar className="w-20 h-20 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-medium text-slate-600 mb-2">No Events Today</h3>
                  <p className="text-slate-500">Enjoy your day!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.length > 0 ? (
                past.map(event => <EventCard key={event.id} event={event} />)
              ) : (
                <div className="col-span-full text-center py-16">
                  <Calendar className="w-20 h-20 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-medium text-slate-600 mb-2">No Past Events</h3>
                  <p className="text-slate-500">Past events will appear here.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}