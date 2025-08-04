import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { characters } from "@/data/characters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, MessageCircle, Menu, Shield, Info } from "lucide-react";
import EthicalGuidelines from "@/components/EthicalGuidelines";

const Index = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

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
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShowAbout}
                className="w-full justify-start"
              >
                <Info className="w-4 h-4 mr-2" />
                About This App
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Conversations With Heroes
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Choose a heroic figure to begin your conversation
        </p>
      </div>

      {/* Persona Grid */}
      <div className="max-w-7xl mx-auto flex-1 flex flex-col">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4 flex-1 overflow-y-auto">
          {characters.map((character) => (
            <Card 
              key={character.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105 bg-card/95 backdrop-blur-sm border-border/50"
              onClick={() => handlePersonaSelect(character.id)}
            >
              <CardHeader className="text-center pb-2 px-3 pt-3">
                <img 
                  src={character.image} 
                  alt={character.name}
                  className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-primary/20 mb-2"
                />
                <CardTitle className="text-xs leading-tight">{character.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {character.title}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
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
