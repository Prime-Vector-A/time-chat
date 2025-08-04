import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCharacterById } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Heart, Lightbulb, Users, MessageCircle, FileText, Menu, Shield } from "lucide-react";
import EthicalGuidelines from "@/components/EthicalGuidelines";
import SuggestionsButton from "@/components/SuggestionsButton";

const ConversationPrompts = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
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
    navigate(`/admin`);
  };

  const handleFeedback = () => {
    console.log("Feedback clicked");
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
        <div className="text-center mb-6">
          <img 
            src={character.image} 
            alt={character.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-foreground mb-1">{character.name}</h1>
          <p className="text-lg text-muted-foreground">{character.title}</p>
          <p className="text-sm text-muted-foreground mt-1">{character.personality.era}</p>
        </div>

        {/* Conversation Prompts */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {conversationPrompts.map((prompt) => (
            <Card 
              key={prompt.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105 bg-card/95 backdrop-blur-sm border-border/50"
              onClick={() => handlePromptSelect(prompt.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-full ${prompt.color} border-2 flex items-center justify-center mx-auto mb-3`}>
                  <prompt.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base mb-1">{prompt.title}</h3>
                <p className="text-sm text-muted-foreground">{prompt.description}</p>
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
            Sources
          </Button>
        </div>

        {/* Character Background */}
        <div className="flex-1 overflow-y-auto">
          <Card className="bg-card/95 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">About {character.name}</h3>
              <p className="text-muted-foreground text-sm mb-3">{character.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
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

      {/* Ethical Guidelines Modal */}
      <EthicalGuidelines 
        isOpen={showGuidelines} 
        onClose={() => setShowGuidelines(false)} 
      />
    </div>
  );
};

export default ConversationPrompts;