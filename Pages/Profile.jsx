import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HelpCircle, 
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  BookOpen
} from "lucide-react";
import { format } from "date-fns";
import { HelpTicket } from "@/entities/all";

const statusColors = {
  "Open": "bg-blue-100 text-blue-800 border-blue-200",
  "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Resolved": "bg-green-100 text-green-800 border-green-200",
  "Closed": "bg-slate-100 text-slate-800 border-slate-200"
};

const statusIcons = {
  "Open": <AlertCircle className="w-4 h-4" />,
  "In Progress": <Clock className="w-4 h-4" />,
  "Resolved": <CheckCircle className="w-4 h-4" />,
  "Closed": <CheckCircle className="w-4 h-4" />
};

const priorityColors = {
  "Low": "bg-green-100 text-green-800 border-green-200",
  "Medium": "bg-yellow-100 text-yellow-800 border-yellow-200", 
  "High": "bg-orange-100 text-orange-800 border-orange-200",
  "Urgent": "bg-red-100 text-red-800 border-red-200"
};

export default function HelpPage() {
  const [tickets, setTickets] = useState([]);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    category: "",
    subject: "",
    description: "",
    priority: "Medium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      // For demo purposes, we'll use a mock student ID
      const data = await HelpTicket.list("-created_date");
      setTickets(data);
    } catch (error) {
      console.error("Error loading tickets:", error);
    }
    setIsLoading(false);
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await HelpTicket.create({
        ...newTicket,
        student_id: "STU001" // Mock student ID
      });
      
      setNewTicket({
        category: "",
        subject: "",
        description: "",
        priority: "Medium"
      });
      setShowTicketForm(false);
      loadTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      title: "Academic Office",
      phone: "+1 (555) 123-4567",
      email: "academic@college.edu",
      hours: "Mon-Fri 9:00 AM - 5:00 PM"
    },
    {
      title: "Student Services",
      phone: "+1 (555) 234-5678", 
      email: "services@college.edu",
      hours: "Mon-Fri 8:00 AM - 6:00 PM"
    },
    {
      title: "IT Help Desk",
      phone: "+1 (555) 345-6789",
      email: "it@college.edu", 
      hours: "24/7 Support Available"
    },
    {
      title: "Library",
      phone: "+1 (555) 456-7890",
      email: "library@college.edu",
      hours: "Mon-Sun 8:00 AM - 10:00 PM"
    }
  ];

  const faqItems = [
    {
      question: "How do I access my grades?",
      answer: "You can view your grades through the student portal. Go to Dashboard > Academic Records to see all your current and past grades."
    },
    {
      question: "How do I change my password?", 
      answer: "Navigate to Profile > Security Settings to update your password. Make sure your new password meets the security requirements."
    },
    {
      question: "What are the library timings?",
      answer: "The library is open Monday through Sunday from 8:00 AM to 10:00 PM. Extended hours are available during exam periods."
    },
    {
      question: "How do I report attendance issues?",
      answer: "If there's a discrepancy in your attendance, contact the respective faculty member first. If unresolved, submit a ticket through the Information Desk."
    },
    {
      question: "Where can I find my class schedule?",
      answer: "Your complete class schedule is available in the 'My Schedule' section. It shows your daily, weekly, and monthly timetable."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-blue-600" />
              Information Desk
            </h1>
            <p className="text-lg text-slate-600">Get help and support for all college-related queries</p>
          </div>
          <Button 
            onClick={() => setShowTicketForm(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Ticket
          </Button>
        </div>

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-1 bg-white p-2 rounded-xl shadow-sm">
            <TabsTrigger 
              value="tickets"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              My Tickets
            </TabsTrigger>
            <TabsTrigger 
              value="contact"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              Contact Info
            </TabsTrigger>
            <TabsTrigger 
              value="faq"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              FAQs
            </TabsTrigger>
            <TabsTrigger 
              value="emergency"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              Emergency
            </TabsTrigger>
          </TabsList>

          {/* My Tickets Tab */}
          <TabsContent value="tickets">
            <div className="space-y-6">
              {/* New Ticket Form */}
              {showTicketForm && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">Create New Support Ticket</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Select 
                          value={newTicket.category} 
                          onValueChange={(value) => setNewTicket({...newTicket, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Academic">Academic</SelectItem>
                            <SelectItem value="Administrative">Administrative</SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                            <SelectItem value="Hostel">Hostel</SelectItem>
                            <SelectItem value="Transport">Transport</SelectItem>
                            <SelectItem value="Library">Library</SelectItem>
                            <SelectItem value="Fees">Fees</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select 
                          value={newTicket.priority} 
                          onValueChange={(value) => setNewTicket({...newTicket, priority: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        placeholder="Subject / Brief description of your issue"
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                        required
                      />
                      <Textarea
                        placeholder="Detailed description of your issue..."
                        value={newTicket.description}
                        onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                        className="min-h-32"
                        required
                      />
                      <div className="flex justify-end gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowTicketForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Ticket"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Tickets List */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800">My Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : tickets.length > 0 ? (
                    <div className="space-y-4">
                      {tickets.map((ticket) => (
                        <div 
                          key={ticket.id}
                          className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300 bg-white hover:bg-slate-50"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-slate-800">{ticket.subject}</h3>
                                <Badge className={`${statusColors[ticket.status]} border font-medium`}>
                                  {statusIcons[ticket.status]}
                                  <span className="ml-1">{ticket.status}</span>
                                </Badge>
                                <Badge className={`${priorityColors[ticket.priority]} border font-medium text-xs`}>
                                  {ticket.priority}
                                </Badge>
                              </div>
                              <p className="text-slate-600 mb-3">{ticket.description}</p>
                              <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span>Category: {ticket.category}</span>
                                <span>•</span>
                                <span>Created: {format(new Date(ticket.created_date), 'MMM d, yyyy')}</span>
                              </div>
                              {ticket.response && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <p className="text-sm font-medium text-green-800 mb-1">Response:</p>
                                  <p className="text-sm text-green-700">{ticket.response}</p>
                                  {ticket.resolved_by && (
                                    <p className="text-xs text-green-600 mt-2">Resolved by: {ticket.resolved_by}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-medium text-slate-600 mb-2">No Tickets Yet</h3>
                      <p className="text-slate-500">Create your first support ticket to get help with any issues.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact">
            <div className="grid md:grid-cols-2 gap-6">
              {contactInfo.map((contact, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">{contact.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-500" />
                      <a href={`tel:${contact.phone}`} className="text-slate-600 hover:text-blue-600 transition-colors">
                        {contact.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-green-500" />
                      <a href={`mailto:${contact.email}`} className="text-slate-600 hover:text-green-600 transition-colors">
                        {contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span className="text-slate-600">{contact.hours}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {faqItems.map((faq, index) => (
                    <div key={index} className="border-b border-slate-200 pb-6 last:border-b-0">
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">{faq.question}</h3>
                      <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency">
            <Card className="bg-red-50 border-red-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-red-200">
                    <h3 className="text-xl font-bold text-red-800 mb-4">Campus Security</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-red-500" />
                        <a href="tel:911" className="text-lg font-bold text-red-600">911</a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-red-500" />
                        <a href="tel:+15551234567" className="text-red-600">Campus: +1 (555) 123-4567</a>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-red-200">
                    <h3 className="text-xl font-bold text-red-800 mb-4">Medical Emergency</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-red-500" />
                        <a href="tel:911" className="text-lg font-bold text-red-600">911</a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-red-500" />
                        <a href="tel:+15552345678" className="text-red-600">Health Center: +1 (555) 234-5678</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-medium">
                    ⚠️ For immediate life-threatening emergencies, always call 911 first, then notify campus security.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}