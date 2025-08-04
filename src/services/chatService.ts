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
      // Call the Supabase Edge Function directly
      const response = await fetch(`${window.location.origin}/functions/v1/chat-with-character`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`,
        },
        body: JSON.stringify({
          characterId,
          message,
          conversationHistory: conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          promptType
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Function call error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: Failed to get response from AI`);
      }

      const data = await response.json();
      
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