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
  private static async sendToWebhook(messageData: any): Promise<any> {
    try {
      const response = await fetch('https://claritasllc.app.n8n.cloud/webhook/5b51b564-5628-4d9b-a4f0-a2c39f531673', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Webhook error:', error);
      return null;
    }
  }

  static async sendMessage(
    characterId: string,
    message: string,
    conversationHistory: ChatMessage[] = [],
    promptType?: string
  ): Promise<ChatResponse> {
    try {
      // Send user message to webhook and wait for response
      const webhookResponse = await this.sendToWebhook({
        type: 'user_message',
        characterId,
        message,
        promptType,
        conversationHistory: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        timestamp: new Date().toISOString()
      });

      if (webhookResponse && webhookResponse.output) {
        return {
          message: webhookResponse.output,
          character: characterId
        };
      }

      // Fallback error if webhook doesn't respond properly
      throw new Error('No response received from webhook');
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  }
}