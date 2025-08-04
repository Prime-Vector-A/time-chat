import { useNavigate, useParams } from "react-router-dom";
import { getCharacterById } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Heart, Lightbulb, Users, MessageCircle, FileText } from "lucide-react";

const ConversationPrompts = () => {
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
    // TODO: Implement sources functionality
    console.log("Sources clicked");
  };

  const handleFeedback = () => {
    // TODO: Implement feedback functionality
    console.log("Feedback clicked");
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
    <div className="min-h-screen bg-gradient-classical p-6">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={handleBackToHome}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Button>
        </div>

        {/* Character Header */}
        <div className="text-center mb-12">
          <img 
            src={character.image} 
            alt={character.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-foreground mb-2">{character.name}</h1>
          <p className="text-xl text-muted-foreground">{character.title}</p>
          <p className="text-sm text-muted-foreground mt-2">{character.personality.era}</p>
        </div>

        {/* Conversation Prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {conversationPrompts.map((prompt) => (
            <Card 
              key={prompt.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105 bg-card/95 backdrop-blur-sm border-border/50"
              onClick={() => handlePromptSelect(prompt.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 rounded-full ${prompt.color} border-2 flex items-center justify-center mx-auto mb-4`}>
                  <prompt.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{prompt.title}</h3>
                <p className="text-sm text-muted-foreground">{prompt.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sources Button */}
        <div className="text-center mb-8">
          <Button 
            variant="outline" 
            onClick={handleSources}
            className="px-8"
          >
            <FileText className="w-4 h-4 mr-2" />
            Sources
          </Button>
        </div>

        {/* Character Background */}
        <Card className="bg-card/95 backdrop-blur-sm border-border/50 mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">About {character.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{character.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Core Values</h4>
                <div className="flex flex-wrap gap-1">
                  {character.personality.values.slice(0, 3).map((value, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      {value}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Speaking Style</h4>
                <p className="text-muted-foreground text-xs">{character.personality.tone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Button */}
      <Button
        onClick={handleFeedback}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default ConversationPrompts;