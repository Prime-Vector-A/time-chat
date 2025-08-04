import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { characterCategories, getCharactersByCategory, type Character } from "@/data/characters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SuggestionsButton from "@/components/SuggestionsButton";

const Personas = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  
  if (!categoryId) {
    navigate("/");
    return null;
  }

  const categoryInfo = characterCategories.find(cat => cat.id === categoryId);
  const characters = getCharactersByCategory(categoryId);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleCharacterSelect = (character: Character) => {
    navigate(`/conversation/${character.id}`);
  };

  if (!categoryInfo) {
    navigate("/");
    return null;
  }

  return (
    <div className="h-screen bg-gradient-classical p-4 overflow-hidden flex flex-col">
      <div className="max-w-6xl mx-auto flex flex-col h-full">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={handleBackToHome}>
            ← Back to Home
          </Button>
        </div>

        {/* Category Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{categoryInfo.icon}</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{categoryInfo.name}</h1>
          <p className="text-lg text-muted-foreground">{categoryInfo.description}</p>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1 overflow-y-auto">
          {characters.map((character) => (
            <Card 
              key={character.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105 bg-card/95 backdrop-blur-sm border-border/50"
              onClick={() => handleCharacterSelect(character)}
            >
              <CardHeader className="text-center pb-2">
                <img 
                  src={character.image} 
                  alt={character.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-primary/20 mb-2"
                />
                <CardTitle className="text-lg">{character.name}</CardTitle>
                <CardDescription className="text-sm">{character.title}</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-muted-foreground text-center mb-3 text-sm">{character.description}</p>
                <div className="flex justify-center">
                  <Button variant="outline" className="w-full text-sm">
                    Start Conversation →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <SuggestionsButton currentPage={`Personas - ${categoryInfo?.name || 'Unknown'}`} />
    </div>
  );
};

export default Personas;