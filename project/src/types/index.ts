export enum MessageType {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  image?: string | null;
}

export interface BotResponse {
  content: string;
  suggestions?: string[];
}