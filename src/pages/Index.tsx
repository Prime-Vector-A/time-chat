import { useState } from "react";
import { characterCategories, getCharactersByCategory, type Character } from "@/data/characters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedCharacter(null);
  };

  const handleBackToCharacters = () => {
    setSelectedCharacter(null);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  if (selectedCharacter) {
    return (
      <div className="min-h-screen bg-gradient-classical p-6">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={handleBackToCharacters}>
              ← Back to Characters
            </Button>
            <Button variant="ghost" onClick={handleBackToCategories}>
              All Categories
            </Button>
          </div>

          {/* Character Conversation Interface */}
          <div className="bg-card/95 backdrop-blur-sm rounded-lg border border-border/50 shadow-elegant p-8">
            <div className="flex items-center gap-6 mb-8">
              <img 
                src={selectedCharacter.image} 
                alt={selectedCharacter.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
              />
              <div>
                <h1 className="text-3xl font-bold text-foreground">{selectedCharacter.name}</h1>
                <p className="text-xl text-muted-foreground">{selectedCharacter.title}</p>
                <Badge variant="secondary" className="mt-2">
                  {characterCategories.find(cat => cat.id === selectedCharacter.category)?.name}
                </Badge>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{selectedCharacter.description}</p>
              </div>

              <div className="p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Background</h3>
                <p className="text-muted-foreground">{selectedCharacter.context.background}</p>
              </div>

              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">Ready to Begin Your Conversation?</h2>
                <p className="text-muted-foreground mb-6">
                  Click below to start speaking with {selectedCharacter.name}
                </p>
                <Button size="lg" className="px-8">
                  🎤 Start Conversation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    const categoryInfo = characterCategories.find(cat => cat.id === selectedCategory);
    const characters = getCharactersByCategory(selectedCategory);

    return (
      <div className="min-h-screen bg-gradient-classical p-6">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={handleBackToCategories}>
              ← Back to Categories
            </Button>
          </div>

          {/* Category Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">{categoryInfo?.icon}</div>
            <h1 className="text-4xl font-bold text-foreground mb-4">{categoryInfo?.name}</h1>
            <p className="text-xl text-muted-foreground">{categoryInfo?.description}</p>
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
  }

  return (
    <div className="min-h-screen bg-gradient-classical">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-6xl font-bold text-foreground mb-6">
            Conversations with
            <span className="block text-primary">History's Greatest Minds</span>
          </h1>
          <p className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Step into the past and engage in meaningful dialogue with influential figures who shaped our world.
            Experience their wisdom, perspective, and humanity through voice conversations.
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-bold text-center text-foreground mb-16">Choose Your Era</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {characterCategories.map((category) => (
            <Card 
              key={category.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105 bg-card/95 backdrop-blur-sm border-border/50"
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardHeader className="text-center pb-6">
                <div className="text-6xl mb-4">{category.icon}</div>
                <CardTitle className="text-2xl">{category.name}</CardTitle>
                <CardDescription className="text-lg">{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Button variant="outline" className="w-full">
                    Explore Characters →
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

export default Index;
