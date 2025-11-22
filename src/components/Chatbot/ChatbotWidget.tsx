import { useState, useEffect, useRef } from 'react';
import { BotAvatar } from './BotAvatar';
import { ChatPanel } from './ChatPanel';
import { Message, BotState, ChatbotConfig } from './types';
import { useToast } from '@/hooks/use-toast';

// ============================================================================
// STEP 1: REPLACE THIS WITH YOUR n8n WEBHOOK URL
// ============================================================================
// 1. Go to your n8n instance
// 2. Create a new workflow with a "Webhook" trigger node
// 3. Set the webhook to accept POST requests
// 4. Copy the webhook URL (e.g., https://your-n8n-instance.app.n8n.cloud/webhook/ljds-chatbot)
// 5. Replace the URL below with your actual webhook URL
const DEFAULT_WEBHOOK_URL = 'https://n8n.srv1084037.hstgr.cloud/webhook/701eda06-a840-4157-a96a-932fd7b9c129';

const DEFAULT_CONFIG: ChatbotConfig = {
  webhookUrl: DEFAULT_WEBHOOK_URL,
  botName: 'LJDS Bot',
};

const INTRO_MESSAGE = "Hi, I'm Laurenz' bot. How may I help you today?";

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [botState, setBotState] = useState<BotState>('idle');
  const [isThinking, setIsThinking] = useState(false);
  const [hasShownIntro, setHasShownIntro] = useState(false);
  const [conversationId] = useState(() => `conv_${Date.now()}`);
  const inactivityTimer = useRef<NodeJS.Timeout>();
  const talkingTimer = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Wave animation every 10 seconds of inactivity
  useEffect(() => {
    const startInactivityTimer = () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      
      inactivityTimer.current = setTimeout(() => {
        if (!isOpen && botState === 'idle') {
          setBotState('waving');
          setTimeout(() => {
            setBotState('idle');
            startInactivityTimer();
          }, 1000);
        } else {
          startInactivityTimer();
        }
      }, 2000);
    };

    startInactivityTimer();

    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [isOpen, botState]);

  // Reset inactivity timer on user interaction
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
  };

  const handleBotClick = () => {
    resetInactivityTimer();
    
    
    // Toggle chat open/closed
    if (isOpen) {
      setIsOpen(false);
      setBotState('idle');
      return;
    }
    
    setIsOpen(true);

    if (!hasShownIntro) {
      // Play talking animation and show intro
      setBotState('talking');
      
      const introMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'bot',
        content: INTRO_MESSAGE,
        timestamp: new Date(),
      };
      
      setMessages([introMessage]);
      setHasShownIntro(true);

      setTimeout(() => {
        setBotState('idle');
      }, 3000);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setBotState('idle');
  };

  const handleTyping = (isTyping: boolean) => {
    if (isTyping && !isThinking) {
      setBotState('thinking');
    } else if (!isTyping && !isThinking) {
      setBotState('idle');
    }
  };

  const handleSendMessage = async (content: string) => {
    resetInactivityTimer();
    
    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);
    setBotState('thinking');

    try {
      // ============================================================================
      // STEP 2: HTTP REQUEST TO n8n
      // ============================================================================
      // This sends a POST request to your n8n webhook with the user's message
      // The payload includes:
      // - message: The text the user typed
      // - conversationId: Unique ID for this chat session (useful for tracking)
      // - timestamp: When the message was sent
      // - source: Where the message came from (this chatbot)
      const response = await fetch(DEFAULT_CONFIG.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationId,
          timestamp: new Date().toISOString(),
          source: 'ljds-portfolio-chatbot',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from bot');
      }

      // ============================================================================
      // STEP 3: HANDLE n8n RESPONSE
      // ============================================================================
      // Your n8n workflow should return a JSON response like:
      // {
      //   "reply": "This is the bot's response text"
      // }
      // 
      // In n8n, add a "Respond to Webhook" node at the end of your workflow
      // and configure it to return this JSON structure.

      const replyText = await response.text();

const botMessage: Message = {
  id: `msg_${Date.now()}_bot`,
  role: 'bot',
  content: replyText || 'I received your message!',
  timestamp: new Date(),
};

      
      setMessages(prev => [...prev, botMessage]);
      setIsThinking(false);
      
      // Play talking animation
      setBotState('talking');
      if (talkingTimer.current) {
        clearTimeout(talkingTimer.current);
      }
      talkingTimer.current = setTimeout(() => {
        setBotState('idle');
      }, 3000);

    } catch (error) {
      console.error('Chatbot error:', error);
      setIsThinking(false);
      setBotState('idle');
      
      toast({
        title: 'Connection Error',
        description: "I'm having trouble connecting right now. Please try again.",
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
      {isOpen && (
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          onClose={handleClose}
          isThinking={isThinking}
          botName={DEFAULT_CONFIG.botName}
          onTyping={handleTyping}
        />
      )}
      
      <BotAvatar state={botState} onClick={handleBotClick} />
    </div>
  );
};