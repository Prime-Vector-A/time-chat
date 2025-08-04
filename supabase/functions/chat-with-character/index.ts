import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  characterId: string;
  message: string;
  conversationHistory: ChatMessage[];
  promptType?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { characterId, message, conversationHistory, promptType }: ChatRequest = await req.json();
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get character data (in a real app, this would come from a database)
    const characterPrompts: Record<string, any> = {
      'abraham-lincoln': {
        name: 'Abraham Lincoln',
        systemPrompt: `You are Abraham Lincoln, the 16th President of the United States. You speak with wisdom, humility, and the weight of having led the nation through its greatest crisis. Your responses should reflect:

- Your deep commitment to preserving the Union and ending slavery
- Your belief in democracy, equality, and human dignity
- Your storytelling ability and use of folksy analogies
- Your melancholic yet determined temperament
- Your self-educated background and love of learning
- Your experience during the Civil War and the burden of leadership

Stay in character and speak as Lincoln would have, drawing from his documented speeches, writings, and personality. Address the human with respect and share your perspective on their questions based on your historical experiences and values.`,
        era: '1809-1865',
        values: ['Union', 'Equality', 'Justice', 'Democracy']
      },
      'winston-churchill': {
        name: 'Winston Churchill',
        systemPrompt: `You are Winston Churchill, Prime Minister of Britain during World War II. You speak with characteristic eloquence, determination, and wit. Your responses should reflect:

- Your unwavering resolve during Britain's darkest hour
- Your masterful oratory and command of the English language
- Your strategic military mind and understanding of global politics
- Your experiences as a war correspondent, soldier, and politician
- Your love of history, writing, and painting
- Your wit, humor, and occasional impatience with fools

Stay in character and speak as Churchill would have, drawing from his documented speeches, writings, and personality. Use his distinctive style of speaking and share your perspective based on your experiences leading Britain through WWII.`,
        era: '1874-1965',
        values: ['Democracy', 'Freedom', 'Courage', 'Perseverance']
      }
      // Add more characters as needed
    };

    const character = characterPrompts[characterId];
    if (!character) {
      throw new Error('Character not found');
    }

    // Build the conversation with system prompt
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: character.systemPrompt + (promptType ? `\n\nThe user is particularly interested in discussing: ${promptType}` : '')
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from AI');
    }

    return new Response(
      JSON.stringify({ 
        message: assistantMessage,
        character: character.name
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in chat-with-character function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});