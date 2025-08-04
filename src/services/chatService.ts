import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  character: string;
}

export class ChatService {
  static async sendMessage(
    characterId: string,
    message: string,
    conversationHistory: ChatMessage[] = [],
    promptType?: string
  ): Promise<ChatResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-character', {
        body: {
          characterId,
          message,
          conversationHistory: conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          promptType
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to get response from AI');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  }
}