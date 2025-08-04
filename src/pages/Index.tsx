import { useNavigate } from "react-router-dom";
import { characterCategories } from "@/data/characters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/personas/${categoryId}`);
  };

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-classical">
      {/* Hidden Admin Access - Click logo area */}
      <div 
        className="absolute top-4 left-4 w-8 h-8 cursor-pointer opacity-0 hover:opacity-30 transition-opacity"
        onClick={handleAdminAccess}
        title="Admin Access"
      >
        <div className="w-full h-full bg-primary/20 rounded"></div>
      </div>

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
