
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Phone, 
  BookOpen,
  Dumbbell,
  Home,
  Heart,
  Coffee,
  Car,
  Gamepad2
} from "lucide-react";
import { Infrastructure } from "@/entities/all";

const categoryIcons = {
  "Academic": BookOpen,
  "Sports": Dumbbell, 
  "Accommodation": Home,
  "Medical": Heart,
  "Recreation": Gamepad2,
  "Transport": Car,
  "Cafeteria": Coffee,
  "Other": Building
};

const categoryColors = {
  "Academic": "bg-blue-100 text-blue-800 border-blue-200",
  "Sports": "bg-green-100 text-green-800 border-green-200",
  "Accommodation": "bg-purple-100 text-purple-800 border-purple-200", 
  "Medical": "bg-red-100 text-red-800 border-red-200",
  "Recreation": "bg-orange-100 text-orange-800 border-orange-200",
  "Transport": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Cafeteria": "bg-pink-100 text-pink-800 border-pink-200",
  "Other": "bg-slate-100 text-slate-800 border-slate-200"
};

export default function InfrastructurePage() {
  const [infrastructure, setInfrastructure] = useState([]);
  const [filteredInfrastructure, setFilteredInfrastructure] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadInfrastructure = useCallback(async () => {
    try {
      const data = await Infrastructure.list();
      setInfrastructure(data);
    } catch (error) {
      console.error("Error loading infrastructure:", error);
    }
    setIsLoading(false);
  }, []); // Dependencies for setters are not needed as they are stable

  const filterInfrastructure = useCallback(() => {
    let filtered = [...infrastructure];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(facility =>
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(facility => facility.category === selectedCategory);
    }

    setFilteredInfrastructure(filtered);
  }, [infrastructure, searchTerm, selectedCategory]);

  useEffect(() => {
    loadInfrastructure();
  }, [loadInfrastructure]);

  useEffect(() => {
    filterInfrastructure();
  }, [filterInfrastructure]);

  const getFacilitiesByCategory = (category) => {
    return infrastructure.filter(facility => facility.category === category);
  };

  const categories = ["Academic", "Sports", "Accommodation", "Medical", "Recreation", "Transport", "Cafeteria", "Other"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <Building className="w-8 h-8 text-blue-600" />
              Campus Infrastructure
            </h1>
            <p className="text-lg text-slate-600">Explore all facilities and amenities available on campus</p>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search facilities by name, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-lg border-slate-200 focus:border-blue-500"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-1 bg-white p-2 rounded-xl shadow-sm">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white font-medium px-3 py-2 rounded-lg transition-all duration-200"
            >
              All
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white font-medium px-3 py-2 rounded-lg transition-all duration-200"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-80 bg-white rounded-xl shadow-lg animate-pulse" />
                ))
              ) : filteredInfrastructure.length > 0 ? (
                filteredInfrastructure.map((facility) => {
                  const IconComponent = categoryIcons[facility.category] || Building;
                  return (
                    <Card key={facility.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-slate-800">{facility.name}</CardTitle>
                            </div>
                          </div>
                          <Badge className={`${categoryColors[facility.category]} border font-medium text-xs`}>
                            {facility.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-slate-600 text-sm leading-relaxed">{facility.description}</p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-slate-600">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium">{facility.location}</span>
                          </div>

                          {facility.timings && (
                            <div className="flex items-center gap-3 text-slate-600">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">{facility.timings}</span>
                            </div>
                          )}

                          {facility.capacity && (
                            <div className="flex items-center gap-3 text-slate-600">
                              <Users className="w-4 h-4 text-green-500" />
                              <span className="text-sm">Capacity: {facility.capacity}</span>
                            </div>
                          )}

                          {facility.phone && (
                            <div className="flex items-center gap-3 text-slate-600">
                              <Phone className="w-4 h-4 text-orange-500" />
                              <a href={`tel:${facility.phone}`} className="text-sm hover:text-blue-600 transition-colors">
                                {facility.phone}
                              </a>
                            </div>
                          )}

                          {facility.contact_person && (
                            <div className="pt-2 border-t border-slate-200">
                              <p className="text-xs text-slate-500 font-medium">Contact Person:</p>
                              <p className="text-sm text-slate-700">{facility.contact_person}</p>
                            </div>
                          )}

                          {facility.facilities_available && facility.facilities_available.length > 0 && (
                            <div className="pt-2 border-t border-slate-200">
                              <p className="text-xs text-slate-500 font-medium mb-2">Available Facilities:</p>
                              <div className="flex flex-wrap gap-1">
                                {facility.facilities_available.slice(0, 3).map((item, index) => (
                                  <Badge key={index} className="bg-slate-100 text-slate-700 text-xs">
                                    {item}
                                  </Badge>
                                ))}
                                {facility.facilities_available.length > 3 && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                                    +{facility.facilities_available.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-600 mb-2">No Facilities Found</h3>
                  <p className="text-slate-500">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFacilitiesByCategory(category).map((facility) => {
                  const IconComponent = categoryIcons[facility.category] || Building;
                  return (
                    <Card key={facility.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-slate-800">{facility.name}</CardTitle>
                            </div>
                          </div>
                          <Badge className={`${categoryColors[facility.category]} border font-medium text-xs`}>
                            {facility.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-slate-600 text-sm leading-relaxed">{facility.description}</p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-slate-600">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium">{facility.location}</span>
                          </div>

                          {facility.timings && (
                            <div className="flex items-center gap-3 text-slate-600">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">{facility.timings}</span>
                            </div>
                          )}

                          {facility.capacity && (
                            <div className="flex items-center gap-3 text-slate-600">
                              <Users className="w-4 h-4 text-green-500" />
                              <span className="text-sm">Capacity: {facility.capacity}</span>
                            </div>
                          )}

                          {facility.phone && (
                            <div className="flex items-center gap-3 text-slate-600">
                              <Phone className="w-4 h-4 text-orange-500" />
                              <a href={`tel:${facility.phone}`} className="text-sm hover:text-blue-600 transition-colors">
                                {facility.phone}
                              </a>
                            </div>
                          )}

                          {facility.contact_person && (
                            <div className="pt-2 border-t border-slate-200">
                              <p className="text-xs text-slate-500 font-medium">Contact Person:</p>
                              <p className="text-sm text-slate-700">{facility.contact_person}</p>
                            </div>
                          )}

                          {facility.facilities_available && facility.facilities_available.length > 0 && (
                            <div className="pt-2 border-t border-slate-200">
                              <p className="text-xs text-slate-500 font-medium mb-2">Available Facilities:</p>
                              <div className="flex flex-wrap gap-1">
                                {facility.facilities_available.slice(0, 3).map((item, index) => (
                                  <Badge key={index} className="bg-slate-100 text-slate-700 text-xs">
                                    {item}
                                  </Badge>
                                ))}
                                {facility.facilities_available.length > 3 && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                                    +{facility.facilities_available.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
