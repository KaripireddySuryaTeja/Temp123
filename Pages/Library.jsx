
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, 
  Search, 
  Filter, 
  User,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { LibraryBook } from "@/entities/all";

const statusColors = {
  "Available": "bg-green-100 text-green-800 border-green-200",
  "Issued": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Reserved": "bg-blue-100 text-blue-800 border-blue-200",
  "Lost": "bg-red-100 text-red-800 border-red-200"
};

const statusIcons = {
  "Available": <CheckCircle className="w-4 h-4" />,
  "Issued": <Clock className="w-4 h-4" />,
  "Reserved": <Calendar className="w-4 h-4" />,
  "Lost": <XCircle className="w-4 h-4" />
};

export default function LibraryPage() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadBooks = useCallback(async () => {
    try {
      const data = await LibraryBook.list("title");
      setBooks(data);
    } catch (error) {
      console.error("Error loading books:", error);
    }
    setIsLoading(false);
  }, []); // Empty dependency array as it doesn't depend on any props or state from the component scope that would change.

  const filterBooks = useCallback(() => {
    let filtered = [...books];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(book => book.status === selectedStatus);
    }

    setFilteredBooks(filtered);
  }, [books, searchTerm, selectedCategory, selectedStatus]); // Dependencies for filterBooks

  useEffect(() => {
    loadBooks();
  }, [loadBooks]); // Now depends on the stable `loadBooks` from useCallback

  useEffect(() => {
    filterBooks();
  }, [filterBooks]); // Now depends on the stable `filterBooks` from useCallback

  const getUniqueCategories = () => {
    return [...new Set(books.map(book => book.category))];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              Library Catalog
            </h1>
            <p className="text-lg text-slate-600">Browse and search through our book collection</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-blue-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Books</p>
                  <p className="text-3xl font-bold mt-2">{books.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Available</p>
                  <p className="text-3xl font-bold mt-2">
                    {books.filter(book => book.status === "Available").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-yellow-100 text-sm font-medium uppercase tracking-wide">Issued</p>
                  <p className="text-3xl font-bold mt-2">
                    {books.filter(book => book.status === "Issued").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">Categories</p>
                  <p className="text-3xl font-bold mt-2">{getUniqueCategories().length}</p>
                </div>
                <Filter className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search by title, author, ISBN, or category..."
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
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Issued">Issued</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Books Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-80 bg-white rounded-xl shadow-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <Card key={book.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                          {book.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                          <User className="w-4 h-4" />
                          <span className="text-sm">{book.author}</span>
                        </div>
                      </div>
                      <Badge className={`${statusColors[book.status]} flex items-center gap-1 font-medium`}>
                        {statusIcons[book.status]}
                        {book.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 font-medium">Category</p>
                        <p className="text-slate-700">{book.category}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Publisher</p>
                        <p className="text-slate-700">{book.publisher || "N/A"}</p>
                      </div>
                    </div>

                    {book.isbn && (
                      <div className="text-sm">
                        <p className="text-slate-500 font-medium">ISBN</p>
                        <p className="text-slate-700 font-mono">{book.isbn}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 font-medium">Available Copies</p>
                        <p className="text-slate-700 font-bold">
                          {book.copies_available} / {book.total_copies}
                        </p>
                      </div>
                      {book.location && (
                        <div>
                          <p className="text-slate-500 font-medium">Location</p>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <p className="text-slate-700 text-xs">{book.location}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {book.publication_year && (
                      <div className="text-sm">
                        <p className="text-slate-500 font-medium">Published</p>
                        <p className="text-slate-700">{book.publication_year}</p>
                      </div>
                    )}

                    {book.description && (
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {book.description}
                        </p>
                      </div>
                    )}

                    <div className="pt-2">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            book.status === "Available" ? "bg-green-500" : "bg-yellow-500"
                          }`}
                          style={{ 
                            width: `${(book.copies_available / book.total_copies) * 100}%` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {Math.round((book.copies_available / book.total_copies) * 100)}% available
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-600 mb-2">No Books Found</h3>
                <p className="text-slate-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
