import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { characters } from "@/data/characters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, MessageCircle, Menu, Shield, Info, Send } from "lucide-react";
import EthicalGuidelines from "@/components/EthicalGuidelines";
import SuggestionsButton from "@/components/SuggestionsButton";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [developerSuggestion, setDeveloperSuggestion] = useState("");
  const { toast } = useToast();

  const handlePersonaSelect = (characterId: string) => {
    navigate(`/prompts/${characterId}`);
  };

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  const handleFeedback = () => {
    console.log("Feedback clicked");
  };

  const handleShowGuidelines = () => {
    setShowGuidelines(true);
    setShowMenu(false);
  };

  const handleSendSuggestion = () => {
    if (!developerSuggestion.trim()) return;
    
    // In a real app, this would send to the developer
    toast({
      title: "Suggestion Sent",
      description: "Thank you for your feedback! Your suggestion has been sent to the developer.",
    });
    
    setDeveloperSuggestion("");
    setShowMenu(false);
  };
  const handleShowAbout = () => {
    setShowAbout(true);
    setShowMenu(false);
  };

  return (
    <div className="h-screen bg-gradient-classical p-4 overflow-hidden flex flex-col">
      {/* Hidden Admin Access */}
      <div 
        className="absolute top-4 left-4 w-8 h-8 cursor-pointer opacity-0 hover:opacity-30 transition-opacity"
        onClick={handleAdminAccess}
        title="Admin Access"
      >
        <div className="w-full h-full bg-primary/20 rounded"></div>
      </div>

      {/* Hamburger Menu */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMenu(!showMenu)}
          className="h-10 w-10 p-0"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        {showMenu && (
          <Card className="absolute top-12 right-0 w-64 bg-card/95 backdrop-blur-sm border-border/50 shadow-lg z-10">
            <CardContent className="p-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShowGuidelines}
                className="w-full justify-start mb-2"
              >
                <Shield className="w-4 h-4 mr-2" />
                Safety Guidelines
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShowAbout}
                className="w-full justify-start mb-3"
              >
                <Info className="w-4 h-4 mr-2" />
                About This App
              </Button>
              
              <div className="border-t border-border/30 pt-3">
                <h4 className="text-sm font-medium mb-2">Suggest to Developer</h4>
                <Textarea
                  placeholder="Share your ideas or feedback (max 128 chars)..."
                  value={developerSuggestion}
                  onChange={(e) => setDeveloperSuggestion(e.target.value.slice(0, 128))}
                  className="text-xs mb-2 resize-none"
                  rows={2}
                  maxLength={128}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {developerSuggestion.length}/128
                  </span>
                  <Button 
                    size="sm" 
                    onClick={handleSendSuggestion}
                    disabled={!developerSuggestion.trim()}
                    className="h-7"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 text-center pr-16">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Conversations With Heroes
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Choose a heroic figure to begin your conversation
        </p>
      </div>

      {/* Persona Grid */}
      <div className="max-w-7xl mx-auto flex-1 min-h-0">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4 h-full overflow-y-auto pb-4">
          {characters.map((character) => (
            <Card 
              key={character.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105 bg-card/95 backdrop-blur-sm border-border/50 h-fit"
              onClick={() => handlePersonaSelect(character.id)}
            >
              <CardHeader className="text-center p-2 pb-0">
                <img 
                  src={character.image} 
                  alt={character.name}
                  className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-primary/20 mb-1"
                />
                <CardTitle className="text-xs leading-tight mb-0">{character.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground leading-tight pb-1">
                  {character.title}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <SuggestionsButton currentPage="Home" />

      {/* Feedback Button */}
      <Button
        onClick={handleFeedback}
        className="fixed bottom-4 right-4 h-10 w-10 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="w-5 h-5" />
      </Button>

      {/* Ethical Guidelines Modal */}
      <EthicalGuidelines 
        isOpen={showGuidelines} 
        onClose={() => setShowGuidelines(false)} 
      />

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-card/95 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Info className="w-6 h-6 text-primary" />
                    About Conversations With Heroes
                  </CardTitle>
                  <CardDescription>
                    Learn more about this application
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowAbout(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Experience meaningful dialogue with heroic figures who shaped our world. 
                  Each conversation is powered by advanced AI trained on historical texts, 
                  personalities, and documented speech patterns to create authentic interactions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">✝️ Christian Leaders</h4>
                    <p className="text-sm text-muted-foreground">
                      Speak with influential Christian figures throughout history
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">🇺🇸 American Leaders</h4>
                    <p className="text-sm text-muted-foreground">
                      Converse with founders and pioneers of America
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">🌍 WWII Heroes</h4>
                    <p className="text-sm text-muted-foreground">
                      Meet those who lived through history's defining moment
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-border/20 pt-4">
                  <p className="text-sm text-muted-foreground text-center">
                    All conversations are guided by ethical guidelines to ensure respectful, 
                    educational, and age-appropriate interactions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
