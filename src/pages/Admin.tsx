import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus, Filter, Search, MoreHorizontal, Shield, Edit, Save, Bug, Lightbulb, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { characters } from "@/data/characters";
import { defaultGuidelines, type EthicalGuideline } from "@/data/guidelines";
import { Suggestion } from "@/components/SuggestionsButton";
import { useToast } from "@/hooks/use-toast";

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
  const [firecrawlApiKey, setFirecrawlApiKey] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [wikipediaQuery, setWikipediaQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const { toast } = useToast();
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

  useEffect(() => {
    // Load suggestions from localStorage
    const loadedSuggestions = JSON.parse(localStorage.getItem("suggestions") || "[]");
    setSuggestions(loadedSuggestions);
  }, []);

  const updateSuggestionStatus = (id: string, status: Suggestion["status"]) => {
    const updatedSuggestions = suggestions.map(s => 
      s.id === id ? { ...s, status } : s
    );
    setSuggestions(updatedSuggestions);
    localStorage.setItem("suggestions", JSON.stringify(updatedSuggestions));
    
    toast({
      title: "Status Updated",
      description: "Suggestion status has been updated.",
    });
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "bug": return <Bug className="w-4 h-4" />;
      case "source": return <Search className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "reviewed": return <Eye className="w-4 h-4 text-yellow-500" />;
      case "in-progress": return <Clock className="w-4 h-4 text-blue-500" />;
      case "resolved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "destructive";
      case "reviewed": return "secondary";
      case "in-progress": return "default";
      case "resolved": return "outline";
      default: return "secondary";
    }
  };

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

        <Tabs defaultValue="sources" className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sources">Sources Management</TabsTrigger>
            <TabsTrigger value="suggestions">
              Suggestions 
              {suggestions.filter(s => s.status === "new").length > 0 && (
                <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                  {suggestions.filter(s => s.status === "new").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="personas">Persona Library</TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="flex-1">
            <Card className="bg-card/95 backdrop-blur-sm border-border/50 flex flex-col h-full">
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
          </TabsContent>

          <TabsContent value="suggestions" className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>User Suggestions</CardTitle>
                <CardDescription>
                  Bug reports and feature requests from users
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full w-full">
                  {suggestions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No suggestions yet. Users can submit feedback using the suggestion button on any page.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {suggestions.map((suggestion) => (
                        <Card key={suggestion.id} className="w-full">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  {getSuggestionIcon(suggestion.type)}
                                  <h4 className="font-semibold">{suggestion.title}</h4>
                                  <Badge variant={
                                    suggestion.type === "bug" ? "destructive" : 
                                    suggestion.type === "source" ? "secondary" : "default"
                                  }>
                                    {suggestion.type === "bug" ? "🐛 Bug" : 
                                     suggestion.type === "source" ? "📚 Source" : "💡 Feature"}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-muted-foreground">
                                  {suggestion.description}
                                </p>
                                
                                {suggestion.type === "source" && (
                                  <div className="mt-2 p-2 bg-muted/50 rounded-md space-y-1">
                                    <div className="text-xs">
                                      <span className="font-medium">Persona:</span> {suggestion.personaName}
                                    </div>
                                    <div className="text-xs">
                                      <span className="font-medium">URL:</span>{" "}
                                      <a 
                                        href={suggestion.sourceUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline break-all"
                                      >
                                        {suggestion.sourceUrl}
                                      </a>
                                    </div>
                                    {suggestion.sourceTitle && (
                                      <div className="text-xs">
                                        <span className="font-medium">Title:</span> {suggestion.sourceTitle}
                                      </div>
                                    )}
                                    <div className="flex gap-2 mt-2">
                                      <Button 
                                        size="sm" 
                                        variant="default" 
                                        onClick={() => {
                                          // Accept source - in a real app, this would add to character sources
                                          updateSuggestionStatus(suggestion.id, "resolved");
                                          toast({
                                            title: "Source Accepted",
                                            description: "Source has been added to the character's knowledge base.",
                                          });
                                        }}
                                        disabled={suggestion.status === "resolved"}
                                      >
                                        Accept Source
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={() => updateSuggestionStatus(suggestion.id, "resolved")}
                                        disabled={suggestion.status === "resolved"}
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>Page: {suggestion.page}</span>
                                  <span>•</span>
                                  <span>{new Date(suggestion.timestamp).toLocaleDateString()}</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(suggestion.status)}
                                  <Badge variant={getStatusColor(suggestion.status) as any}>
                                    {suggestion.status}
                                  </Badge>
                                </div>
                                
                                <div className="flex gap-1">
                                  {suggestion.type === "source" ? (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          // Auto-populate the source form in the Sources tab
                                          setSelectedPersona(suggestion.personaId || "");
                                          setSourceUrl(suggestion.sourceUrl || "");
                                          updateSuggestionStatus(suggestion.id, "in-progress");
                                        }}
                                        disabled={suggestion.status === "resolved"}
                                      >
                                        Add Source
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateSuggestionStatus(suggestion.id, "resolved")}
                                      >
                                        Resolve
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateSuggestionStatus(suggestion.id, "reviewed")}
                                        disabled={suggestion.status === "resolved"}
                                      >
                                        Review
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateSuggestionStatus(suggestion.id, "resolved")}
                                      >
                                        Resolve
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personas" className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Persona Library</CardTitle>
                <CardDescription>
                  Manage historical figures and conversation personas
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <div className="space-y-4 h-full flex flex-col">
                  <Input
                    placeholder="Search personas..."
                    value={searchPersonas}
                    onChange={(e) => setSearchPersonas(e.target.value)}
                  />
                  
                  <ScrollArea className="flex-1">
                    <div className="space-y-2">
                      {filteredPersonas.map((persona, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{persona.name}</h5>
                            <p className="text-xs text-muted-foreground">
                              {persona.category || (persona as any).title}
                            </p>
                          </div>
                          <Badge 
                            variant={(persona as any).status === "active" ? "default" : "outline"} 
                            className="text-xs"
                          >
                            {(persona as any).status || "active"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
