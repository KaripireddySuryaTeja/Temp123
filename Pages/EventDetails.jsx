import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Trophy,
  Bell,
  QrCode,
  Star,
  ExternalLink,
  Image as ImageIcon,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { Event, EventRegistration, EventReview, Student } from "@/entities/all";

export default function EventDetailsPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const eventId = params.get('id');

  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    try {
      const [eventData, students, registrations, reviewsData] = await Promise.all([
        Event.list(),
        Student.list(),
        EventRegistration.list(),
        EventReview.list()
      ]);

      const currentEvent = eventData.find(e => e.id === eventId);
      setEvent(currentEvent);

      if (students.length > 0) {
        const currentStudent = students[0];
        setStudent(currentStudent);

        const userRegistration = registrations.find(
          r => r.event_id === eventId && r.student_id === currentStudent.student_id
        );
        setRegistration(userRegistration);
      }

      const eventReviews = reviewsData.filter(r => r.event_id === eventId);
      setReviews(eventReviews);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleRegister = async () => {
    if (!student || !event) return;

    const qrData = JSON.stringify({
      eventId: event.id,
      studentId: student.student_id,
      name: student.full_name,
      timestamp: new Date().toISOString()
    });

    await EventRegistration.create({
      event_id: event.id,
      student_id: student.student_id,
      student_name: student.full_name || "Student",
      student_email: student.email || "",
      remind_me: false,
      qr_code: qrData
    });

    loadData();
  };

  const handleRemindMe = async () => {
    if (!registration) return;
    await EventRegistration.update(registration.id, {
      ...registration,
      remind_me: !registration.remind_me
    });
    loadData();
  };

  const handleSubmitReview = async () => {
    if (!student || !event || rating === 0) return;

    await EventReview.create({
      event_id: event.id,
      student_id: student.student_id,
      student_name: student.full_name || "Student",
      rating: rating,
      review: reviewText
    });

    // Update event average rating
    const allReviews = [...reviews, { rating }];
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Event.update(event.id, { ...event, average_rating: avgRating });

    setRating(0);
    setReviewText("");
    loadData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-96 bg-white rounded-xl shadow-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Event Not Found</h2>
          <p className="text-slate-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Event Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          {event.poster_url && (
            <div className="h-64 overflow-hidden rounded-t-xl">
              <img src={event.poster_url} alt={event.title} className="w-full h-full object-cover" />
            </div>
          )}
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold text-slate-800 mb-2">{event.title}</CardTitle>
                <Badge className={`text-sm px-3 py-1`}>
                  {event.category}
                </Badge>
              </div>
              <Badge className={event.status === "Completed" ? "bg-gray-500" : "bg-green-500"} className="text-white">
                {event.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-700 leading-relaxed">{event.description}</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="font-medium text-slate-800">{format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}</p>
                </div>
              </div>

              {event.event_time && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-slate-500">Time</p>
                    <p className="font-medium text-slate-800">{event.event_time}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-slate-500">Venue</p>
                  <p className="font-medium text-slate-800">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-slate-500">Organizer</p>
                  <p className="font-medium text-slate-800">{event.organizer}</p>
                </div>
              </div>
            </div>

            {event.prizes && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-amber-600" />
                  <div>
                    <p className="text-sm text-amber-700 font-medium">Prizes & Rewards</p>
                    <p className="text-amber-800">{event.prizes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Actions */}
            {!registration ? (
              <div className="flex gap-3">
                <Button onClick={handleRegister} className="flex-1 bg-primary hover:bg-primary/90">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Register for Event
                </Button>
                {event.registration_link && (
                  <Button variant="outline" asChild>
                    <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      External Link
                    </a>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-green-800">You're Registered!</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleRemindMe}
                    variant={registration.remind_me ? "default" : "outline"}
                    className="flex-1"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {registration.remind_me ? "Reminder Set" : "Remind Me"}
                  </Button>
                  <Button onClick={() => setShowQR(!showQR)} variant="outline" className="flex-1">
                    <QrCode className="w-4 h-4 mr-2" />
                    Show QR Pass
                  </Button>
                </div>

                {showQR && registration.qr_code && (
                  <Card className="bg-white p-6 text-center">
                    <div className="w-48 h-48 bg-slate-100 mx-auto rounded-lg flex items-center justify-center mb-3">
                      <QrCode className="w-32 h-32 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-600">Show this at event check-in</p>
                  </Card>
                )}

                {registration.checked_in && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-medium text-blue-800 text-center">
                      ✓ Checked In • Certificate sent to your email
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photo Gallery */}
        {event.gallery_urls && event.gallery_urls.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                Event Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.gallery_urls.map((url, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Reviews & Ratings
              {event.average_rating && (
                <span className="text-lg ml-2">({event.average_rating.toFixed(1)}/5)</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Submit Review */}
            {registration?.checked_in && event.status === "Completed" && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-slate-800">Leave a Review</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating ? "text-yellow-500 fill-yellow-500" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Share your experience..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="min-h-24"
                />
                <Button onClick={handleSubmitReview} disabled={rating === 0}>
                  Submit Review
                </Button>
              </div>
            )}

            {/* Display Reviews */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="border-b border-slate-200 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-800">{review.student_name}</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.review && <p className="text-slate-600 text-sm">{review.review}</p>}
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4">No reviews yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}