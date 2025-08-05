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
  private static async sendToWebhook(messageData: any): Promise<void> {
    try {
      await fetch('https://claritasllc.app.n8n.cloud/webhook/5b51b564-5628-4d9b-a4f0-a2c39f531673', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });
    } catch (error) {
      console.error('Webhook error:', error);
      // Don't throw error to avoid disrupting the main chat flow
    }
  }

  static async sendMessage(
    characterId: string,
    message: string,
    conversationHistory: ChatMessage[] = [],
    promptType?: string
  ): Promise<ChatResponse> {
    try {
      // Send user message to webhook
      await this.sendToWebhook({
        type: 'user_message',
        characterId,
        message,
        promptType,
        timestamp: new Date().toISOString()
      });

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

      // Send AI response to webhook
      await this.sendToWebhook({
        type: 'ai_response',
        characterId,
        userMessage: message,
        aiResponse: data.message,
        character: data.character,
        promptType,
        timestamp: new Date().toISOString()
      });

      return data;
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  }
}