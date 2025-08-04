import { useNavigate, useParams } from "react-router-dom";
import { getCharacterById, characterCategories } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Conversation = () => {
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

  const category = characterCategories.find(cat => cat.id === character.category);

  const handleBackToPersonas = () => {
    navigate(`/personas/${character.category}`);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-classical p-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={handleBackToPersonas}>
            ← Back to {category?.name}
          </Button>
          <Button variant="ghost" onClick={handleBackToHome}>
            Home
          </Button>
        </div>

        {/* Character Header */}
        <div className="bg-card/95 backdrop-blur-sm rounded-lg border border-border/50 shadow-elegant p-8">
          <div className="flex items-center gap-6 mb-8">
            <img 
              src={character.image} 
              alt={character.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
            />
            <div>
              <h1 className="text-3xl font-bold text-foreground">{character.name}</h1>
              <p className="text-xl text-muted-foreground">{character.title}</p>
              <Badge variant="secondary" className="mt-2">
                {category?.name}
              </Badge>
            </div>
          </div>

          {/* Character Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">{character.description}</p>
            </div>

            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Background</h3>
              <p className="text-muted-foreground">{character.context.background}</p>
            </div>

            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Era & Style</h3>
              <p className="text-muted-foreground mb-2"><strong>Era:</strong> {character.personality.era}</p>
              <p className="text-muted-foreground"><strong>Tone:</strong> {character.personality.tone}</p>
            </div>

            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Core Values</h3>
              <div className="flex flex-wrap gap-2">
                {character.personality.values.map((value, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Signature Quotes */}
          <div className="p-6 bg-muted/50 rounded-lg mb-8">
            <h3 className="font-semibold mb-4">Notable Quotes</h3>
            <div className="space-y-2">
              {character.context.keyQuotes.map((quote, index) => (
                <blockquote key={index} className="text-muted-foreground italic border-l-4 border-primary/20 pl-4">
                  "{quote}"
                </blockquote>
              ))}
            </div>
          </div>

          {/* Conversation Interface */}
          <div className="text-center py-12 border-t border-border/20">
            <h2 className="text-2xl font-semibold mb-4">Ready to Begin Your Conversation?</h2>
            <p className="text-muted-foreground mb-6">
              Click below to start speaking with {character.name}. You can type or use your microphone.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="px-8">
                🎤 Start Voice Chat
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                💬 Start Text Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;