import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Faculty } from "@/entities/all";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const classTypes = ["Lecture", "Lab", "Tutorial", "Break"];

export default function ScheduleForm({ open, onOpenChange, onSave, classData, day }) {
  const [formData, setFormData] = useState({});
  const [facultyList, setFacultyList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchFaculty = async () => {
      const data = await Faculty.list();
      setFacultyList(data);
    };
    fetchFaculty();
  }, []);

  useEffect(() => {
    if (classData) {
      setFormData(classData);
    } else {
      setFormData({
        day_of_week: day || "Monday",
        time_slot: "",
        subject: "",
        faculty_name: "",
        room_number: "",
        type: "Lecture",
        student_id: "STU001" // Mock student ID
      });
    }
  }, [classData, day]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{classData ? "Edit Class" : "Add New Class"}</DialogTitle>
          <DialogDescription>
            {classData ? "Update the details for this class." : "Fill in the details for the new class."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="day_of_week" className="text-right">Day</Label>
            <Select
              value={formData.day_of_week || ""}
              onValueChange={(value) => handleChange("day_of_week", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time_slot" className="text-right">Time</Label>
            <Input
              id="time_slot"
              value={formData.time_slot || ""}
              onChange={(e) => handleChange("time_slot", e.target.value)}
              className="col-span-3"
              placeholder="e.g., 9:00 AM - 10:00 AM"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">Subject</Label>
            <Input
              id="subject"
              value={formData.subject || ""}
              onChange={(e) => handleChange("subject", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="faculty_name" className="text-right">Faculty</Label>
            <Select
              value={formData.faculty_name || ""}
              onValueChange={(value) => handleChange("faculty_name", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                {facultyList.map((faculty) => (
                  <SelectItem key={faculty.id} value={faculty.name}>{faculty.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room_number" className="text-right">Room</Label>
            <Input
              id="room_number"
              value={formData.room_number || ""}
              onChange={(e) => handleChange("room_number", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select
              value={formData.type || ""}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {classTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSaveClick} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}