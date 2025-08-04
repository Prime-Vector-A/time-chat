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
  MoreVertical,
  Menu,
  Shield,
  Loader2,
  X
} from "lucide-react";
import EthicalGuidelines from "@/components/EthicalGuidelines";
import SuggestionsButton from "@/components/SuggestionsButton";
import { ChatService, type ChatMessage } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

interface Message extends ChatMessage {
  id: string;
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
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { toast } = useToast();
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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Get conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));

      const response = await ChatService.sendMessage(
        character.id,
        messageToSend,
        conversationHistory,
        promptType || undefined
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get response from the AI. Please check that your OpenAI API key is configured.",
        variant: "destructive",
      });
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble responding right now. Please make sure the OpenAI API key is properly configured in the admin settings.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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

  const handleShowGuidelines = () => {
    setShowGuidelines(true);
    setShowMenu(false);
  };

  return (
    <div className="h-screen bg-gradient-classical flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-50 w-80 bg-card/95 backdrop-blur-sm border-r border-border/50 p-4 flex flex-col h-full transition-transform duration-300`}>
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
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto lg:hidden"
            onClick={() => setShowSidebar(false)}
          >
            <X className="w-4 h-4" />
          </Button>
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
        <div className="p-4 border-b border-border/50 bg-card/95 backdrop-blur-sm flex-shrink-0 relative">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowSidebar(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
            <img 
              src={character.image} 
              alt={character.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
            />
            <div className="flex-1">
              <h2 className="font-semibold">{character.name}</h2>
              <p className="text-sm text-muted-foreground">{character.title}</p>
            </div>
            <Badge variant="secondary" className="mr-2 hidden sm:block">
              {promptType ? promptType.charAt(0).toUpperCase() + promptType.slice(1) : "General"}
            </Badge>
            
            {/* Hamburger Menu */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="h-8 w-8 p-0"
            >
              <Menu className="w-4 h-4" />
            </Button>
            
            {showMenu && (
              <Card className="absolute top-16 right-4 w-48 bg-card/95 backdrop-blur-sm border-border/50 shadow-lg z-10">
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
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 min-h-0">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
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
        <div className="p-2 sm:p-4 border-t border-border/50 bg-card/95 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Message ${character.name}...`}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              className="flex-1 text-sm"
              disabled={isLoading}
            />
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={handleToggleRecording}
              disabled={isLoading}
              className="hidden sm:flex"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <SuggestionsButton currentPage={`Conversation - ${character.name}`} />

      {/* Feedback Button */}
      <Button
        onClick={handleFeedback}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="w-5 h-5" />
      </Button>

      {/* Ethical Guidelines Modal */}
      <EthicalGuidelines 
        isOpen={showGuidelines} 
        onClose={() => setShowGuidelines(false)} 
      />
    </div>
  );
};

export default Conversation;