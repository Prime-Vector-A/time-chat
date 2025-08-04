import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getCharacterById } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Trash2, 
  Flag,
  Plus,
  MoreVertical
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Thread {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

const Conversation = () => {
  const navigate = useNavigate();
  const { characterId } = useParams<{ characterId: string }>();
  const [searchParams] = useSearchParams();
  const promptType = searchParams.get('prompt');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: "1",
      title: "Previous conversation about leadership",
      messages: [],
      lastUpdated: new Date(Date.now() - 86400000)
    },
    {
      id: "2", 
      title: "Discussion on historical events",
      messages: [],
      lastUpdated: new Date(Date.now() - 172800000)
    }
  ]);
  const [currentThreadId, setCurrentThreadId] = useState<string>("new");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const character = getCharacterById(characterId!);

  useEffect(() => {
    if (promptType && character) {
      const initialMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: getInitialPrompt(promptType, character.name),
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }
  }, [promptType, character]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!character) {
    navigate("/");
    return null;
  }

  const getInitialPrompt = (type: string, name: string) => {
    switch (type) {
      case "wisdom":
        return `Greetings! I am ${name}. I understand you seek wisdom and guidance. What challenges or questions weigh upon your mind? I shall share what insights my experiences have taught me.`;
      case "personal":
        return `Welcome, friend. I am ${name}. You wish to know of my personal life and experiences? Ask freely, and I shall share the joys, sorrows, and relationships that have shaped who I am.`;
      case "historical":
        return `Ah, you wish to discuss the great events of my time! I am ${name}, and I have witnessed much history unfold. What moments or decisions from my era would you like to explore together?`;
      case "philosophy":
        return `Greetings! I am ${name}. You seek to understand my beliefs and philosophy? Excellent - these are the foundations upon which I built my life. What aspects of my worldview intrigue you most?`;
      default:
        return `Hello! I am ${name}. I'm delighted to speak with you. What would you like to discuss?`;
    }
  };

  const handleBackToPrompts = () => {
    navigate(`/prompts/${character.id}`);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant", 
        content: generateAIResponse(inputValue, character),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userInput: string, char: any) => {
    // Simple response generation for demo
    const responses = [
      `Indeed, that is a profound question. In my experience, ${userInput.toLowerCase()} reminds me of the challenges we faced in my time...`,
      `Your inquiry touches upon matters close to my heart. Let me share what I have learned about such things...`,
      `Ah, this brings to mind a particular moment from my life when I too grappled with such thoughts...`,
      `From my perspective, having lived through what I have, I would say that your question reflects...`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleReportResponse = (messageId: string) => {
    console.log("Reported message:", messageId);
  };

  const handleClearMemory = () => {
    setMessages([]);
    setCurrentThreadId("new");
  };

  const handleNewThread = () => {
    setMessages([]);
    setCurrentThreadId("new");
  };

  const handleFeedback = () => {
    console.log("Feedback clicked");
  };

  return (
    <div className="h-screen bg-gradient-classical flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-card/95 backdrop-blur-sm border-r border-border/50 p-4 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackToPrompts}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <img 
              src={character.image} 
              alt={character.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-sm">{character.name}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Saved Threads</h3>
            <Button variant="ghost" size="sm" onClick={handleNewThread}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Button
              variant={currentThreadId === "new" ? "secondary" : "ghost"}
              className="w-full justify-start text-left h-auto p-3"
              onClick={() => setCurrentThreadId("new")}
            >
              <div>
                <div className="font-medium text-sm">New Conversation</div>
                <div className="text-xs text-muted-foreground">Start fresh</div>
              </div>
            </Button>

            {threads.map((thread) => (
              <Button
                key={thread.id}
                variant={currentThreadId === thread.id ? "secondary" : "ghost"}
                className="w-full justify-between text-left h-auto p-3"
                onClick={() => setCurrentThreadId(thread.id)}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm truncate">{thread.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {thread.lastUpdated.toLocaleDateString()}
                  </div>
                </div>
                <MoreVertical className="w-4 h-4" />
              </Button>
            ))}
          </div>
          </div>
        </div>

        <div className="mt-4">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleClearMemory}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Memory
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header */}
        <div className="p-4 border-b border-border/50 bg-card/95 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src={character.image} 
              alt={character.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
            />
            <div>
              <h2 className="font-semibold">{character.name}</h2>
              <p className="text-sm text-muted-foreground">{character.title}</p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {promptType ? promptType.charAt(0).toUpperCase() + promptType.slice(1) : "General"}
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <img 
                      src={character.image} 
                      alt={character.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium">{character.name}</span>
                  </div>
                )}
                <Card className={`${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.role === 'assistant' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReportResponse(message.id)}
                          className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                        >
                          <Flag className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border/50 bg-card/95 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Message ${character.name}...`}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={handleToggleRecording}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button onClick={handleSendMessage} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
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

export default Conversation;