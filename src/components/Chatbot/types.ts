export type BotState = 'idle' | 'waving' | 'talking' | 'thinking';

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface ChatbotConfig {
  webhookUrl: string;
  botName: string;
}