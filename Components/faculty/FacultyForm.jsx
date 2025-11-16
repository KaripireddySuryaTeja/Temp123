import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function FacultyForm({ open, onOpenChange, onSave, facultyData }) {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (facultyData) {
      // When editing, convert subjects array to a comma-separated string for the input
      setFormData({
        ...facultyData,
        subjects: facultyData.subjects ? facultyData.subjects.join(", ") : ""
      });
    } else {
      // For a new entry
      setFormData({
        name: "",
        designation: "",
        department: "",
        subjects: "",
        office_room: "",
        phone: "",
        email: "",
        office_hours: "",
        qualifications: "",
      });
    }
  }, [facultyData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    // Convert subjects string back to an array before saving
    const dataToSave = {
      ...formData,
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean)
    };
    await onSave(dataToSave);
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{facultyData ? "Edit Faculty Member" : "Add New Faculty Member"}</DialogTitle>
          <DialogDescription>
            {facultyData ? "Update the details for this faculty member." : "Fill in the details for the new faculty member."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto px-2">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={formData.name || ""} onChange={(e) => handleChange("name", e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="designation">Designation</Label>
            <Input id="designation" value={formData.designation || ""} onChange={(e) => handleChange("designation", e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input id="department" value={formData.department || ""} onChange={(e) => handleChange("department", e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="office_room">Office Room</Label>
            <Input id="office_room" value={formData.office_room || ""} onChange={(e) => handleChange("office_room", e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={formData.email || ""} onChange={(e) => handleChange("email", e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={formData.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="office_hours">Office Hours</Label>
            <Input id="office_hours" value={formData.office_hours || ""} onChange={(e) => handleChange("office_hours", e.target.value)} className="mt-2" placeholder="e.g., Mon-Fri 2-4 PM"/>
          </div>
          <div>
            <Label htmlFor="subjects">Subjects (comma-separated)</Label>
            <Input id="subjects" value={formData.subjects || ""} onChange={(e) => handleChange("subjects", e.target.value)} className="mt-2" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="qualifications">Qualifications</Label>
            <Textarea id="qualifications" value={formData.qualifications || ""} onChange={(e) => handleChange("qualifications", e.target.value)} className="mt-2" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSaveClick} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}