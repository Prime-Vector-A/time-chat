import { useState } from "react";
import { X, ShieldCheck, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProhibitedGuidelines, getEncouragedGuidelines } from "@/data/guidelines";

interface EthicalGuidelinesProps {
  isOpen: boolean;
  onClose: () => void;
}

const EthicalGuidelines = ({ isOpen, onClose }: EthicalGuidelinesProps) => {
  const prohibitedGuidelines = getProhibitedGuidelines();
  const encouragedGuidelines = getEncouragedGuidelines();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
                AI Conversation Guidelines
              </CardTitle>
              <CardDescription>
                Safety filters and ethical guidelines for all conversations
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Prohibited Content */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldX className="w-5 h-5 text-destructive" />
              <h3 className="text-lg font-semibold text-destructive">🛑 What the AI Cannot Say/Do</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {prohibitedGuidelines.map((guideline) => (
                <Card key={guideline.id} className="border-destructive/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{guideline.title}</h4>
                      <Badge variant="destructive" className="text-xs">Prohibited</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{guideline.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Encouraged Content */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-600">✅ What the AI Should Encourage</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {encouragedGuidelines.map((guideline) => (
                <Card key={guideline.id} className="border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{guideline.title}</h4>
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Encouraged</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{guideline.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border/20 pt-4">
            <p className="text-sm text-muted-foreground text-center">
              These guidelines ensure all conversations remain respectful, educational, and appropriate for our community.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EthicalGuidelines;