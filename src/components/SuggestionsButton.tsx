import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Suggestion {
  id: string;
  type: "bug" | "feature";
  title: string;
  description: string;
  page: string;
  timestamp: Date;
  status: "new" | "reviewed" | "in-progress" | "resolved";
}

interface SuggestionsButtonProps {
  currentPage: string;
}

const SuggestionsButton = ({ currentPage }: SuggestionsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"bug" | "feature">("feature");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and description.",
        variant: "destructive",
      });
      return;
    }

    const suggestion: Suggestion = {
      id: Date.now().toString(),
      type,
      title: title.trim(),
      description: description.trim(),
      page: currentPage,
      timestamp: new Date(),
      status: "new"
    };

    // Get existing suggestions from localStorage
    const existingSuggestions = JSON.parse(localStorage.getItem("suggestions") || "[]");
    const updatedSuggestions = [...existingSuggestions, suggestion];
    localStorage.setItem("suggestions", JSON.stringify(updatedSuggestions));

    toast({
      title: "Suggestion Submitted",
      description: "Thank you for your feedback! We'll review it soon.",
    });

    // Reset form
    setTitle("");
    setDescription("");
    setType("feature");
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 shadow-lg"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Suggest
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit a Suggestion</DialogTitle>
            <DialogDescription>
              Help us improve by reporting bugs or suggesting new features.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value: "bug" | "feature") => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">🐛 Bug Report</SelectItem>
                  <SelectItem value="feature">💡 Feature Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <input
                id="title"
                type="text"
                placeholder="Brief summary of your suggestion"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide more details about your suggestion or bug report"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Current page: <span className="font-medium">{currentPage}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Send className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SuggestionsButton;