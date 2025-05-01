import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message, MessageType } from '../types';
import { formatTime } from '../utils/helpers';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.type === MessageType.BOT;
  
  return (
    <div className={`flex mb-4 ${isBot ? '' : 'justify-end'}`}>
      <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 ${isBot ? 'mr-2' : 'ml-2'}`}>
          <div className={`rounded-full p-2 ${isBot ? 'bg-forest-700' : 'bg-green-600'}`}>
            {isBot ? (
              <Bot className="h-5 w-5 text-white" />
            ) : (
              <User className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
        
        <div>
          <div 
            className={`p-3 rounded-lg ${
              isBot 
                ? 'bg-white border border-sage-200 text-forest-900' 
                : 'bg-green-600 text-white'
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
            
            {message.image && (
              <div className="mt-2">
                <img 
                  src={message.image} 
                  alt="Attachment" 
                  className="rounded-md max-w-full max-h-48 object-contain"
                />
              </div>
            )}
          </div>
          
          <div 
            className={`text-xs text-gray-500 mt-1 ${
              isBot ? 'text-left' : 'text-right'
            }`}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;