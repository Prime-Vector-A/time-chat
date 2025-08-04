import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Filter, Search, MoreHorizontal, Shield, Edit, Save } from "lucide-react";
import { characters } from "@/data/characters";
import { defaultGuidelines, type EthicalGuideline } from "@/data/guidelines";

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "rejected";
  priority: "low" | "medium" | "high";
  votes: number;
  createdAt: string;
}

const initialFeatureRequests: FeatureRequest[] = [
  {
    id: "1",
    title: "Support for voice input",
    description: "Allow users to speak their questions instead of typing",
    status: "in-progress",
    priority: "high",
    votes: 47,
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    title: "Adjustable text size",
    description: "Let users customize font size for better accessibility",
    status: "pending",
    priority: "medium",
    votes: 23,
    createdAt: "2024-01-20"
  },
  {
    id: "3",
    title: "More conversation prompts",
    description: "Provide suggested conversation starters for each character",
    status: "pending",
    priority: "medium", 
    votes: 31,
    createdAt: "2024-01-22"
  },
  {
    id: "4",
    title: "Offline mode",
    description: "Allow conversations to work without internet connection",
    status: "pending",
    priority: "low",
    votes: 15,
    createdAt: "2024-01-25"
  },
  {
    id: "5",
    title: "Inappropriate content filtering",
    description: "Add content moderation and filtering capabilities",
    status: "completed",
    priority: "high",
    votes: 62,
    createdAt: "2024-01-10"
  }
];

const additionalPersonas = [
  { name: "Lewis & Clark", category: "Explorers", status: "active" },
  { name: "Elizabeth Cady Stanton", category: "Women's Rights", status: "active" },
  { name: "Beethoven", category: "Musicians", status: "draft" },
  { name: "Marie Curie", category: "Scientists", status: "active" },
  { name: "Frederick Douglass", category: "Civil Rights", status: "draft" }
];

const Admin = () => {
  const navigate = useNavigate();
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>(initialFeatureRequests);
  const [searchPersonas, setSearchPersonas] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newFeatureTitle, setNewFeatureTitle] = useState("");
  const [newFeatureDescription, setNewFeatureDescription] = useState("");
  const [guidelines, setGuidelines] = useState<EthicalGuideline[]>(defaultGuidelines);
  const [editingGuideline, setEditingGuideline] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleBackToHome = () => {
    navigate("/");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "in-progress": return "secondary";
      case "pending": return "outline";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const handleEditGuideline = (guideline: EthicalGuideline) => {
    setEditingGuideline(guideline.id);
    setEditTitle(guideline.title);
    setEditDescription(guideline.description);
  };

  const handleSaveGuideline = () => {
    if (editingGuideline) {
      setGuidelines(prev => prev.map(g => 
        g.id === editingGuideline 
          ? { ...g, title: editTitle, description: editDescription }
          : g
      ));
      setEditingGuideline(null);
      setEditTitle("");
      setEditDescription("");
    }
  };

  const handleCancelEdit = () => {
    setEditingGuideline(null);
    setEditTitle("");
    setEditDescription("");
  };

  const filteredRequests = featureRequests.filter(request => 
    filterStatus === "all" || request.status === filterStatus
  );

  const filteredPersonas = [...characters, ...additionalPersonas.map(p => ({ ...p, id: p.name.toLowerCase() }))]
    .filter(persona => 
      persona.name.toLowerCase().includes(searchPersonas.toLowerCase())
    );

  const removeFeatureRequest = (id: string) => {
    setFeatureRequests(prev => prev.filter(req => req.id !== id));
  };

  const addFeatureRequest = () => {
    if (newFeatureTitle.trim() && newFeatureDescription.trim()) {
      const newRequest: FeatureRequest = {
        id: Date.now().toString(),
        title: newFeatureTitle,
        description: newFeatureDescription,
        status: "pending",
        priority: "medium",
        votes: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setFeatureRequests(prev => [newRequest, ...prev]);
      setNewFeatureTitle("");
      setNewFeatureDescription("");
    }
  };

  return (
    <div className="h-screen bg-gradient-classical p-4 overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Admin Backend</h1>
            <p className="text-muted-foreground">Manage feature requests and persona library</p>
          </div>
          <Button variant="outline" onClick={handleBackToHome}>
            ← Back to App
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Feature Requests Section */}
          <Card className="bg-card/95 backdrop-blur-sm border-border/50 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Feature Requests
              </CardTitle>
              <CardDescription>
                Manage user feature requests and development priorities
              </CardDescription>
              
              {/* Filter Controls */}
              <div className="flex gap-2 mt-4">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 flex-1 overflow-hidden flex flex-col">
              {/* Add New Feature Request */}
              <div className="p-3 border border-border/50 rounded-lg bg-muted/20">
                <h4 className="font-semibold mb-2">Add New Request</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Feature title"
                    value={newFeatureTitle}
                    onChange={(e) => setNewFeatureTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Feature description"
                    value={newFeatureDescription}
                    onChange={(e) => setNewFeatureDescription(e.target.value)}
                    rows={2}
                  />
                  <Button onClick={addFeatureRequest} size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Request
                  </Button>
                </div>
              </div>

              {/* Feature Requests List */}
              <div className="space-y-2 flex-1 overflow-y-auto">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="p-3 border border-border/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{request.title}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFeatureRequest(request.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{request.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge variant={getStatusBadgeVariant(request.status)} className="text-xs">
                          {request.status}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(request.priority)} className="text-xs">
                          {request.priority}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {request.votes} votes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ethical Guidelines Management Section */}
          <Card className="bg-card/95 backdrop-blur-sm border-border/50 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Ethical Guidelines
              </CardTitle>
              <CardDescription>
                Manage AI conversation safety filters and ethical guidelines
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4">
                {/* Prohibited Guidelines */}
                <div>
                  <h4 className="font-semibold mb-3 text-destructive">🛑 Prohibited Content</h4>
                  <div className="space-y-2">
                    {guidelines.filter(g => g.category === "prohibited").map((guideline) => (
                      <div key={guideline.id} className="p-3 border border-destructive/20 rounded-lg">
                        {editingGuideline === guideline.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="text-sm"
                            />
                            <Textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="text-xs"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveGuideline}>
                                <Save className="w-3 h-3 mr-1" />
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{guideline.title}</h5>
                              <p className="text-xs text-muted-foreground">{guideline.description}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditGuideline(guideline)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Encouraged Guidelines */}
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">✅ Encouraged Content</h4>
                  <div className="space-y-2">
                    {guidelines.filter(g => g.category === "encouraged").map((guideline) => (
                      <div key={guideline.id} className="p-3 border border-green-200 rounded-lg">
                        {editingGuideline === guideline.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="text-sm"
                            />
                            <Textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="text-xs"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveGuideline}>
                                <Save className="w-3 h-3 mr-1" />
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{guideline.title}</h5>
                              <p className="text-xs text-muted-foreground">{guideline.description}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditGuideline(guideline)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sources Management Section */}
          <Card className="bg-card/95 backdrop-blur-sm border-border/50 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Sources Management
              </CardTitle>
              <CardDescription>
                Add and manage Wikipedia and web sources for personas
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              {/* API Key Management */}
              <div className="mb-4 p-3 border border-border/50 rounded-lg bg-muted/20">
                <h4 className="font-semibold mb-2">Firecrawl API Configuration</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Firecrawl API key..."
                    type="password"
                    className="flex-1 text-sm"
                  />
                  <Button size="sm">
                    Save Key
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Get your API key from <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="underline">firecrawl.dev</a>
                </p>
              </div>

              {/* Add Source Form */}
              <div className="mb-4 p-3 border border-border/50 rounded-lg bg-muted/20">
                <h4 className="font-semibold mb-2">Add New Source</h4>
                <div className="space-y-2">
                  <select className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                    <option value="">Select Persona...</option>
                    {characters.map((char) => (
                      <option key={char.id} value={char.id}>{char.name}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Wikipedia search term or full URL..."
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Scrape Wikipedia
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Scrape URL
                    </Button>
                  </div>
                </div>
              </div>

              {/* Existing Sources */}
              <div className="flex-1 overflow-y-auto">
                <h4 className="font-semibold mb-3">Existing Sources</h4>
                <div className="space-y-2">
                  {characters.map((character) => (
                    <div key={character.id} className="p-3 border border-border/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">{character.name}</h5>
                        <Badge variant="outline" className="text-xs">
                          {character.sources?.length || 0} sources
                        </Badge>
                      </div>
                      {character.sources && character.sources.length > 0 ? (
                        <div className="space-y-1">
                          {character.sources.slice(0, 2).map((source) => (
                            <div key={source.id} className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground truncate">
                                {source.title}
                              </span>
                              <div className="flex gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {source.type}
                                </Badge>
                                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                                  <MoreHorizontal className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          {character.sources.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{character.sources.length - 2} more sources
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No sources added</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Persona Library Section */}
          <Card className="bg-card/95 backdrop-blur-sm border-border/50 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Persona Library
              </CardTitle>
              <CardDescription>
                Manage historical figures and conversation personas
              </CardDescription>
              
              {/* Search */}
              <div className="mt-4">
                <Input
                  placeholder="Search personas..."
                  value={searchPersonas}
                  onChange={(e) => setSearchPersonas(e.target.value)}
                  className="w-full"
                />
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              <div className="mb-4">
                <h4 className="font-semibold mb-3">Resources</h4>
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {filteredPersonas.map((persona, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border border-border/50 rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{persona.name}</h5>
                        <p className="text-xs text-muted-foreground">
                          {persona.category || (persona as any).title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={(persona as any).status === "active" ? "default" : "outline"} 
                          className="text-xs"
                        >
                          {(persona as any).status || "active"}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Management Actions */}
              <div className="border-t border-border/20 pt-3 mt-auto">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Persona
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Import Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;