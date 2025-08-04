import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { characterCategories, getCharactersByCategory, type Character } from "@/data/characters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-gradient-classical p-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={handleBackToHome}>
            ← Back to Home
          </Button>
        </div>

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{categoryInfo.icon}</div>
          <h1 className="text-4xl font-bold text-foreground mb-4">{categoryInfo.name}</h1>
          <p className="text-xl text-muted-foreground">{categoryInfo.description}</p>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {characters.map((character) => (
            <Card 
              key={character.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105 bg-card/95 backdrop-blur-sm border-border/50"
              onClick={() => handleCharacterSelect(character)}
            >
              <CardHeader className="text-center pb-4">
                <img 
                  src={character.image} 
                  alt={character.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/20 mb-4"
                />
                <CardTitle className="text-2xl">{character.name}</CardTitle>
                <CardDescription className="text-lg">{character.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">{character.description}</p>
                <div className="flex justify-center">
                  <Button variant="outline" className="w-full">
                    Start Conversation →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Personas;