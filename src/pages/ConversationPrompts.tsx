import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCharacterById } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, Heart, Lightbulb, Users, MessageCircle, FileText, Menu, Shield, ExternalLink, X, Plus } from "lucide-react";
import EthicalGuidelines from "@/components/EthicalGuidelines";
import SuggestionsButton from "@/components/SuggestionsButton";
import { useToast } from "@/hooks/use-toast";
import type { Suggestion } from "@/components/SuggestionsButton";

const ConversationPrompts = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [suggestedUrl, setSuggestedUrl] = useState("");
  const [suggestedDescription, setSuggestedDescription] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { characterId } = useParams<{ characterId: string }>();
  
  if (!characterId) {
    navigate("/");
    return null;
  }

  const character = getCharacterById(characterId);

  if (!character) {
    navigate("/");
    return null;
  }

  const handleBackToHome = () => {
    navigate("/");
  };

  const handlePromptSelect = (promptType: string) => {
    navigate(`/conversation/${character.id}?prompt=${promptType}`);
  };

  const handleSources = () => {
    setShowSources(true);
  };

  const handleFeedback = () => {
    console.log("Feedback clicked");
  };

  const handleSuggestSource = () => {
    if (!suggestedUrl.trim() || !suggestedDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both URL and description.",
        variant: "destructive",
      });
      return;
    }

    const suggestion: Suggestion = {
      id: Date.now().toString(),
      type: "source",
      title: `Source suggestion for ${character.name}`,
      description: suggestedDescription.trim(),
      page: `Sources - ${character.name}`,
      timestamp: new Date(),
      status: "new",
      personaId: character.id,
      personaName: character.name,
      sourceUrl: suggestedUrl.trim(),
      sourceTitle: "User Suggested Source"
    };

    // Get existing suggestions from localStorage
    const existingSuggestions = JSON.parse(localStorage.getItem("suggestions") || "[]");
    const updatedSuggestions = [...existingSuggestions, suggestion];
    localStorage.setItem("suggestions", JSON.stringify(updatedSuggestions));

    toast({
      title: "Source Suggested",
      description: "Thank you! Your source suggestion has been submitted for review.",
    });

    // Reset form
    setSuggestedUrl("");
    setSuggestedDescription("");
  };

  const handleShowGuidelines = () => {
    setShowGuidelines(true);
    setShowMenu(false);
  };

  const conversationPrompts = [
    {
      id: "wisdom",
      title: "Seek Wisdom",
      description: "Ask for guidance and life advice",
      icon: Lightbulb,
      color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
    },
    {
      id: "personal",
      title: "Personal Life",
      description: "Learn about their experiences and relationships",
      icon: Heart,
      color: "bg-red-500/10 text-red-600 border-red-500/20"
    },
    {
      id: "historical",
      title: "Historical Events",
      description: "Discuss the events they witnessed or shaped",
      icon: BookOpen,
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    },
    {
      id: "philosophy",
      title: "Philosophy & Values",
      description: "Explore their beliefs and worldview",
      icon: Users,
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20"
    }
  ];

  return (
    <div className="h-screen bg-gradient-classical p-4 overflow-hidden flex flex-col">
      <div className="max-w-2xl mx-auto flex flex-col h-full relative">
        {/* Hamburger Menu */}
        <div className="absolute top-0 right-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className="h-10 w-10 p-0"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          {showMenu && (
            <Card className="absolute top-12 right-0 w-48 bg-card/95 backdrop-blur-sm border-border/50 shadow-lg z-10">
              <CardContent className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShowGuidelines}
                  className="w-full justify-start"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Safety Guidelines
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={handleBackToHome}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Button>
        </div>

        {/* Character Header */}
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <img 
              src={character.image} 
              alt={character.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-primary/20 flex-shrink-0"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-1">{character.name}</h1>
              <p className="text-base text-muted-foreground">{character.title}</p>
              <p className="text-xs text-muted-foreground">{character.personality.era}</p>
            </div>
          </div>
        </div>

        {/* Character Background */}
        <div className="mb-4">
          <Card className="bg-card/95 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">About {character.name}</h3>
              <p className="text-muted-foreground text-sm">{character.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Conversation Prompts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {conversationPrompts.map((prompt) => (
            <Card 
              key={prompt.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105 bg-card/95 backdrop-blur-sm border-border/50"
              onClick={() => handlePromptSelect(prompt.id)}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full ${prompt.color} border flex items-center justify-center flex-shrink-0`}>
                  <prompt.icon className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-0.5">{prompt.title}</h3>
                  <p className="text-xs text-muted-foreground leading-tight">{prompt.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sources Button */}
        <div className="text-center mb-4">
          <Button 
            variant="outline" 
            onClick={handleSources}
            className="px-8"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Sources
          </Button>
        </div>
      </div>

      {/* Feedback Button */}
      <Button
        onClick={handleFeedback}
        className="fixed bottom-4 right-4 h-10 w-10 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="w-5 h-5" />
      </Button>

      <SuggestionsButton currentPage={`Conversation Prompts - ${character.name}`} />

      {/* Sources Modal */}
      <Dialog open={showSources} onOpenChange={setShowSources}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Sources for {character.name}
            </DialogTitle>
            <DialogDescription>
              Historical sources and references used for this character's knowledge base
            </DialogDescription>
          </DialogHeader>
          
          {/* Source Suggestion Section - Compact */}
          <div className="bg-muted/30 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Plus className="w-4 h-4" />
              <h4 className="font-semibold text-sm">Suggest a New Source</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <Input
                id="suggested-url"
                type="url"
                placeholder="Source URL"
                value={suggestedUrl}
                onChange={(e) => setSuggestedUrl(e.target.value)}
                className="text-sm h-8"
              />
              <Button 
                onClick={handleSuggestSource} 
                size="sm" 
                className="h-8"
                disabled={!suggestedUrl.trim() || !suggestedDescription.trim()}
              >
                <Plus className="w-3 h-3 mr-1" />
                Suggest
              </Button>
            </div>
            
            <Textarea
              id="suggested-description"
              placeholder="Why is this source relevant?"
              value={suggestedDescription}
              onChange={(e) => setSuggestedDescription(e.target.value)}
              rows={2}
              className="text-sm"
            />
          </div>

          <div className="border-t border-border/30 pt-3">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Current Sources
            </h4>
          </div>

          <ScrollArea className="flex-1 min-h-[300px] max-h-[50vh]">
            <div className="space-y-4 pr-4">
              {character.sources && character.sources.length > 0 ? (
                character.sources.map((source) => (
                  <Card key={source.id} className="w-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-base leading-tight mb-2">
                            {source.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {source.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Added {new Date(source.dateAdded).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {source.description}
                          </p>
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Source
                          </a>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No sources available for this character yet.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Ethical Guidelines Modal */}
      <EthicalGuidelines 
        isOpen={showGuidelines} 
        onClose={() => setShowGuidelines(false)} 
      />
    </div>
  );
};

export default ConversationPrompts;