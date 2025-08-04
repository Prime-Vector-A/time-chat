import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { characters } from "@/data/characters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, MessageCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [showPurpose, setShowPurpose] = useState(true);

  const handlePersonaSelect = (characterId: string) => {
    navigate(`/prompts/${characterId}`);
  };

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  const handleFeedback = () => {
    // TODO: Implement feedback functionality
    console.log("Feedback clicked");
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

      {/* Dismissible Statement of Purpose */}
      {showPurpose && (
        <div className="fixed bottom-6 left-6 right-6 max-w-4xl mx-auto">
          <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-elegant">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold mb-1">About Conversations With Heroes</h3>
                  <p className="text-sm text-muted-foreground">
                    Experience meaningful dialogue with heroic figures who shaped our world. 
                    Each conversation is powered by advanced AI trained on historical texts.
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowPurpose(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feedback Button */}
      <Button
        onClick={handleFeedback}
        className="fixed bottom-4 right-4 h-10 w-10 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Index;
