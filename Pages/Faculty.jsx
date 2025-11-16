import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Mail, Phone, MapPin, Clock, GraduationCap, Search, Filter, Edit, Plus, Trash2, Check } from "lucide-react";
import { Faculty } from "@/entities/all";
import FacultyForm from "../components/faculty/FacultyForm";

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const loadFaculty = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await Faculty.list();
      setFaculty(data);
    } catch (error) {
      console.error("Error loading faculty:", error);
    }
    setIsLoading(false);
  }, []);

  const filterFaculty = useCallback(() => {
    let filtered = [...faculty];

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.subjects?.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedDepartment !== "all") {
      filtered = filtered.filter(member => member.department === selectedDepartment);
    }

    setFilteredFaculty(filtered);
  }, [faculty, searchTerm, selectedDepartment]);

  useEffect(() => {
    loadFaculty();
  }, [loadFaculty]);

  useEffect(() => {
    filterFaculty();
  }, [filterFaculty]);

  const handleSave = async (facultyData) => {
    if (facultyData.id) {
      await Faculty.update(facultyData.id, facultyData);
    } else {
      await Faculty.create(facultyData);
    }
    setShowForm(false);
    setEditingFaculty(null);
    loadFaculty();
  };

  const handleDelete = async (facultyId) => {
    if (window.confirm("Are you sure you want to delete this faculty member?")) {
      await Faculty.delete(facultyId);
      loadFaculty();
    }
  };

  const handleAddClick = () => {
    setEditingFaculty(null);
    setShowForm(true);
  };

  const handleEditClick = (facultyData) => {
    setEditingFaculty(facultyData);
    setShowForm(true);
  };

  const getUniqueDepartments = () => {
    return [...new Set(faculty.map(member => member.department))];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              Faculty Directory
            </h1>
            <p className="text-lg text-slate-600">Find and manage faculty information</p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
          >
            {isEditing ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Done Editing
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Manage Faculty
              </>
            )}
          </Button>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search faculty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-lg border-slate-200 focus:border-blue-500"
                />
              </div>
              <div className="flex w-full md:w-auto gap-4">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-full md:w-64">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {getUniqueDepartments().map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isEditing && (
                  <Button onClick={handleAddClick} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-80 bg-white rounded-xl shadow-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.length > 0 ? (
              filteredFaculty.map((member) => (
                <Card key={member.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative">
                  {isEditing && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditClick(member)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(member.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-800">{member.name}</CardTitle>
                        <p className="text-blue-600 font-medium">{member.designation}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <GraduationCap className="w-5 h-5 text-purple-500" />
                      <span className="font-medium">{member.department}</span>
                    </div>

                    {member.subjects && member.subjects.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Subjects:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.subjects.slice(0, 3).map((subject, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                              {subject}
                            </Badge>
                          ))}
                          {member.subjects.length > 3 && (
                            <Badge className="bg-slate-100 text-slate-600 text-xs">
                              +{member.subjects.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 pt-2 border-t border-slate-200">
                      {member.email && (
                        <div className="flex items-center gap-3 text-slate-600">
                          <Mail className="w-4 h-4 text-green-500" />
                          <a href={`mailto:${member.email}`} className="text-sm hover:text-blue-600 transition-colors">
                            {member.email}
                          </a>
                        </div>
                      )}

                      {member.phone && (
                        <div className="flex items-center gap-3 text-slate-600">
                          <Phone className="w-4 h-4 text-blue-500" />
                          <a href={`tel:${member.phone}`} className="text-sm hover:text-blue-600 transition-colors">
                            {member.phone}
                          </a>
                        </div>
                      )}

                      {member.office_room && (
                        <div className="flex items-center gap-3 text-slate-600">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Room {member.office_room}</span>
                        </div>
                      )}

                      {member.office_hours && (
                        <div className="flex items-center gap-3 text-slate-600">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className="text-sm">{member.office_hours}</span>
                        </div>
                      )}
                    </div>

                    {member.qualifications && (
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-xs text-slate-500 font-medium mb-1">Qualifications:</p>
                        <p className="text-xs text-slate-600">{member.qualifications}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-600 mb-2">No Faculty Found</h3>
                <p className="text-slate-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <FacultyForm
        open={showForm}
        onOpenChange={setShowForm}
        onSave={handleSave}
        facultyData={editingFaculty}
      />
    </div>
  );
}