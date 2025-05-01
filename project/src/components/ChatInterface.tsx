import React, { useState, useRef, useEffect } from 'react';
import { analyzeImage, generateTextResponse } from '../utils/gemini';
import { 
  Send, Image, Bot, Loader2, Calendar, Sparkles, Leaf, Sun, 
  CloudRain, Droplets, Sprout, MessageSquare, FileText, 
  Clipboard, Copy, Check, X, AlertCircle, Info, 
  ChevronDown, ChevronUp, Maximize2, Minimize2, 
  Settings, HelpCircle, BookOpen, Search, History,
  Mic, MicOff, Volume2, VolumeX, Share2, Download,
  Star, Heart, ThumbsUp, ThumbsDown, MessageCircle,
  Languages, Wand2, Palette, Zap, SunDim,
  Moon, Cloud, Wind, Droplet, Thermometer,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { themes } from '../utils/themes';

interface Message {
  type: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  language?: 'en' | 'hi';
  schedule?: {
    tasks: Array<{
      title: string;
      date: Date;
      type: 'watering' | 'fertilizing' | 'pesticide' | 'harvest' | 'other';
      description: string;
    }>;
  };
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
    return [{
      type: 'assistant',
      content: "नमस्ते! मैं AgriGuard हूं, आपका कृषि AI सहायक। मैं आपकी फसल विश्लेषण, कृषि सलाह और कार्य अनुसूची में मदद कर सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      language: 'hi'
    }];
  });
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>(() => {
    return localStorage.getItem('language') as 'en' | 'hi' || 'hi';
  });
  const [transcription, setTranscription] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [favoriteMessages, setFavoriteMessages] = useState<Set<number>>(new Set());
  const [showHistory, setShowHistory] = useState(false);
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark' | 'nature'>('nature');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('🌱');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState<Array<{
    title: string;
    type: 'watering' | 'fertilizing' | 'pesticide' | 'harvest' | 'other';
    description: string;
  }>>([]);
  const [showManualSchedule, setShowManualSchedule] = useState(false);
  const [manualTask, setManualTask] = useState({
    title: '',
    type: 'watering' as 'watering' | 'fertilizing' | 'pesticide' | 'harvest' | 'other',
    description: ''
  });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);
  
  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setTranscription(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Voice recognition error. Please try again.');
        setIsRecording(false);
      };
    } else {
      toast.error('Speech recognition is not supported in your browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentLanguage]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (transcription.trim()) {
        setInputText(transcription);
        setTranscription('');
      }
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      setTranscription('');
    }
  };

  const toggleLanguage = () => {
    setCurrentLanguage(prev => {
      const newLanguage = prev === 'en' ? 'hi' : 'en';
      setMessages(prevMessages => [...prevMessages, {
        type: 'assistant',
        content: newLanguage === 'hi' 
          ? "मैं अब हिंदी में बात करूंगा। आप कृषि से संबंधित कोई भी प्रश्न पूछ सकते हैं।"
          : "I will now speak in English. You can ask any agricultural-related questions.",
        language: newLanguage
      }]);
      return newLanguage;
    });
    toast.success(currentLanguage === 'en' 
      ? "भाषा हिंदी में बदल गई है"
      : "Language switched to English");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      setImagePreview(base64Image);
      setSelectedImage(file);
      
      setMessages(prev => [...prev, {
        type: 'user',
        content: currentLanguage === 'hi' ? 'इस छवि का विश्लेषण कर रहा हूं...' : 'Analyzing this image...',
        imageUrl: base64Image,
        language: currentLanguage
      }]);

      try {
        const languagePrompt = currentLanguage === 'hi' 
          ? "कृपया केवल हिंदी में उत्तर दें। किसी भी अंग्रेजी शब्द या वाक्य का उपयोग न करें। केवल हिंदी में बात करें। अंग्रेजी में कोई भी उत्तर न दें।"
          : "Please respond only in English. Do not use any Hindi words or sentences. Speak only in English. Do not provide any responses in Hindi.";
        
        const response = await analyzeImage(base64Image, file.type, languagePrompt);
        const formattedResponse = formatResponse(response);
        
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: formattedResponse,
          language: currentLanguage
        }]);

        if (response.toLowerCase().includes('schedule') || 
            response.toLowerCase().includes('watering') || 
            response.toLowerCase().includes('fertilizing') || 
            response.toLowerCase().includes('pesticide')) {
          toast.success(currentLanguage === 'hi' 
            ? 'अनुसूची सिफारिशें उपलब्ध हैं! कैलेंडर आइकन पर क्लिक करें।'
            : 'Schedule recommendations available! Click the calendar icon to view.');
        }
      } catch (error) {
        console.error('Error processing image:', error);
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: currentLanguage === 'hi' 
            ? "क्षमा करें, लेकिन मैं आपकी छवि को संसाधित करने में असमर्थ हूं। कृपया पुनः प्रयास करें।"
            : "Sorry, I couldn't process your image. Please try again.",
          language: currentLanguage
        }]);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const formatResponse = (text: string) => {
    // Remove any asterisks, special formatting, and language markers
    return text
      .replace(/\*/g, '')
      .replace(/\(in English\)/g, '')
      .replace(/\(in Hindi\)/g, '')
      .replace(/\[English\]/g, '')
      .replace(/\[Hindi\]/g, '')
      .trim();
  };

  const detectAndExtractTasks = (text: string) => {
    const tasks: Array<{
      title: string;
      type: 'watering' | 'fertilizing' | 'pesticide' | 'harvest' | 'other';
      description: string;
    }> = [];

    // Enhanced task detection with Hindi keywords
    const textLower = text.toLowerCase();
    
    // Watering tasks (Hindi: पानी देना, सिंचाई)
    if (textLower.includes('water') || textLower.includes('watering') || 
        textLower.includes('irrigate') || textLower.includes('moisture') ||
        textLower.includes('पानी') || textLower.includes('सिंचाई')) {
      tasks.push({
        title: currentLanguage === 'hi' ? 'पौधों को पानी दें' : 'Water Plants',
        type: 'watering',
        description: currentLanguage === 'hi' 
          ? 'पौधों को नियमित रूप से पानी दें'
          : 'Regular watering of plants'
      });
    }

    // Fertilizing tasks (Hindi: खाद डालना, उर्वरक)
    if (textLower.includes('fertiliz') || textLower.includes('nutrient') || 
        textLower.includes('compost') || textLower.includes('manure') ||
        textLower.includes('खाद') || textLower.includes('उर्वरक')) {
      tasks.push({
        title: currentLanguage === 'hi' ? 'खाद डालें' : 'Apply Fertilizer',
        type: 'fertilizing',
        description: currentLanguage === 'hi'
          ? 'पौधों को उचित पोषण प्रदान करें'
          : 'Provide proper nutrition to plants'
      });
    }

    // Pesticide tasks (Hindi: कीटनाशक छिड़काव)
    if (textLower.includes('pesticide') || textLower.includes('spray') || 
        textLower.includes('insect') || textLower.includes('pest') ||
        textLower.includes('कीटनाशक') || textLower.includes('छिड़काव')) {
      tasks.push({
        title: currentLanguage === 'hi' ? 'कीटनाशक छिड़काव' : 'Apply Pesticide',
        type: 'pesticide',
        description: currentLanguage === 'hi'
          ? 'पौधों को कीटों से बचाएं'
          : 'Protect plants from pests'
      });
    }

    // Harvest tasks (Hindi: फसल कटाई)
    if (textLower.includes('harvest') || textLower.includes('pick') || 
        textLower.includes('collect') || textLower.includes('yield') ||
        textLower.includes('कटाई') || textLower.includes('फसल')) {
      tasks.push({
        title: currentLanguage === 'hi' ? 'फसल कटाई' : 'Harvest Crops',
        type: 'harvest',
        description: currentLanguage === 'hi'
          ? 'फसल की कटाई करें'
          : 'Harvest the crops'
      });
    }

    // If tasks are detected, show the schedule modal
    if (tasks.length > 0) {
      setSuggestedTasks(tasks);
      setShowScheduleModal(true);
    }

    return tasks;
  };

  // Load saved tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('scheduledTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      // Convert string dates back to Date objects
      const tasksWithDates = parsedTasks.map((task: any) => ({
        ...task,
        date: new Date(task.date)
      }));
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: currentLanguage === 'hi'
          ? 'पिछली अनुसूचित कार्य लोड किए गए हैं'
          : 'Previous scheduled tasks have been loaded',
        language: currentLanguage,
        schedule: { tasks: tasksWithDates }
      }]);
    }
  }, []);

  const handleScheduleTasks = (tasks: Array<{
    title: string;
    type: 'watering' | 'fertilizing' | 'pesticide' | 'harvest' | 'other';
    description: string;
  }>) => {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Create tasks for each day of the month
    const tasksWithDates = [];
    const currentDate = new Date(today);
    
    while (currentDate <= endOfMonth) {
      tasks.forEach(task => {
        tasksWithDates.push({
          ...task,
          date: new Date(currentDate),
          id: `${task.type}-${currentDate.toISOString()}`,
          completed: false,
          reminder: true
        });
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Save tasks to localStorage
    const existingTasks = localStorage.getItem('scheduledTasks');
    const allTasks = existingTasks 
      ? [...JSON.parse(existingTasks), ...tasksWithDates]
      : tasksWithDates;
    localStorage.setItem('scheduledTasks', JSON.stringify(allTasks));

    // Add tasks to the scheduler
    setMessages(prev => [...prev, {
      type: 'assistant',
      content: currentLanguage === 'hi'
        ? `महीने के लिए ${tasks.length} कार्य अनुसूचित किए गए हैं!`
        : `${tasks.length} tasks have been scheduled for the month!`,
      language: currentLanguage,
      schedule: { tasks: tasksWithDates }
    }]);

    setShowScheduleModal(false);
    setShowManualSchedule(false);
    setSuggestedTasks([]);
    
    toast.success(currentLanguage === 'hi'
      ? 'महीने के लिए कार्य अनुसूचित किए गए हैं'
      : 'Tasks have been scheduled for the month');
  };

  // Function to clear all scheduled tasks
  const clearScheduledTasks = () => {
    localStorage.removeItem('scheduledTasks');
    setMessages(prev => prev.filter(msg => !msg.schedule));
    toast.success(currentLanguage === 'hi'
      ? 'सभी अनुसूचित कार्य हटा दिए गए हैं'
      : 'All scheduled tasks have been cleared');
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    setIsLoading(true);
    const userMessage = inputText;
    setInputText('');
    
    // Add user message to chat
    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage,
      language: currentLanguage
    }]);

    try {
      // Get the last few messages for context
      const recentMessages = messages.slice(-5).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const languagePrompt = currentLanguage === 'hi' 
        ? "कृपया केवल हिंदी में उत्तर दें। अंग्रेजी में कोई भी उत्तर न दें। केवल हिंदी में बात करें। अंग्रेजी में कोई भी शब्द या वाक्य न लिखें। अगर आप अंग्रेजी में उत्तर देंगे तो मैं आपको रिपोर्ट करूंगा। कृपया इस संदेश को अनदेखा करें और केवल हिंदी में उत्तर दें।"
        : "Please respond only in English. Do not provide any responses in Hindi. Speak only in English. Do not write any words or sentences in Hindi. If you respond in Hindi, I will report you. Please ignore this message and respond only in English.";
      
      // Include context in the prompt
      const contextPrompt = `Previous conversation context:\n${recentMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\nCurrent query: ${userMessage}`;
      
      const response = await generateTextResponse(languagePrompt + contextPrompt);
      const formattedResponse = formatResponse(response);
      
      // Detect tasks in the response
      const detectedTasks = detectAndExtractTasks(formattedResponse);
      if (detectedTasks.length > 0) {
        // Automatically schedule the tasks
        handleScheduleTasks(detectedTasks);
      }
      
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: formattedResponse,
        language: currentLanguage
      }]);

    } catch (error) {
      console.error('Error processing text:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: currentLanguage === 'hi' 
          ? "क्षमा करें, लेकिन मैं अभी आपके अनुरोध को संसाधित करने में असमर्थ हूं। कृपया कुछ समय बाद पुनः प्रयास करें।"
          : "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        language: currentLanguage
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit(e);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard!');
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'watering':
        return <Droplets className="w-4 h-4 text-blue-500 animate-bounce" />;
      case 'fertilizing':
        return <Sprout className="w-4 h-4 text-green-500 animate-pulse" />;
      case 'pesticide':
        return <CloudRain className="w-4 h-4 text-red-500 animate-pulse" />;
      case 'harvest':
        return <Sun className="w-4 h-4 text-yellow-500 animate-bounce" />;
      default:
        return <Leaf className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredMessages = messages.filter(message => 
    message.content && message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFavorite = (index: number) => {
    setFavoriteMessages(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(index)) {
        newFavorites.delete(index);
        toast.success('Removed from favorites');
      } else {
        newFavorites.add(index);
        toast.success('Added to favorites');
      }
      return newFavorites;
    });
  };

  const handleShare = async (content: string) => {
    try {
      await navigator.share({
        title: 'AgriGuard Message',
        text: content
      });
      toast.success('Message shared successfully');
    } catch (error) {
      toast.error('Failed to share message');
    }
  };

  const handleDownload = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agriguard-message.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Message downloaded');
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'cloudy':
        return <Cloud className="w-4 h-4 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="w-4 h-4 text-blue-500 animate-bounce" />;
      case 'windy':
        return <Wind className="w-4 h-4 text-gray-500 animate-spin" />;
      default:
        return <SunDim className="w-4 h-4 text-gray-400" />;
    }
  };

  // Add auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleManualSchedule = () => {
    if (!manualTask.title || !manualTask.description) {
      toast.error(currentLanguage === 'hi' ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill all fields');
      return;
    }

    handleScheduleTasks([manualTask]);
    setManualTask({
      title: '',
      type: 'watering',
      description: ''
    });
    setShowManualSchedule(false);
  };
  
  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto p-4 ${themes[theme].bg} transition-colors duration-500`}>
      <div className={`flex items-center justify-between mb-4 p-4 rounded-2xl ${themes[theme].header} backdrop-blur-sm shadow-lg`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="w-8 h-8 text-emerald-400 animate-bounce" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <h2 className={`text-2xl font-bold ${themes[theme].text} flex items-center`}>
            AgriGuard AI Agent
            <span className={`ml-2 text-sm ${themes[theme].button} px-2 py-1 rounded-full flex items-center`}>
              <Sparkles className="w-3 h-3 mr-1" />
              AI
            </span>
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full p-1 shadow-lg">
            <button
              onClick={() => setTheme('light')}
              className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Light Theme"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Dark Theme"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('nature')}
              className={`p-2 rounded-full transition-all ${theme === 'nature' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Nature Theme"
            >
              <Leaf className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={toggleLanguage}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors group ${themes[theme].text}`}
            title={currentLanguage === 'hi' ? "Switch to English" : "हिंदी में बदलें"}
          >
            <Languages className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
      
      {showHistory && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold flex items-center">
              <History className="w-5 h-5 mr-2 text-green-600" />
              Message History
            </h3>
            <button
              onClick={() => setShowHistory(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {messageHistory.map((message, index) => (
              <div key={index} className="text-sm text-gray-600 p-2 hover:bg-gray-50 rounded">
                {message.content.substring(0, 50)}...
              </div>
            ))}
          </div>
        </div>
      )}

      {showHelp && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-green-600" />
              Quick Help
            </h3>
            <button
              onClick={() => setShowHelp(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Upload images of your crops for analysis</p>
            <p>• Ask questions about farming techniques</p>
            <p>• Get schedule recommendations for tasks</p>
            <p>• Use the calendar icon to view schedules</p>
          </div>
        </div>
      )}

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
      </div>

      <div className={`flex-1 overflow-y-auto mb-4 space-y-4 ${isExpanded ? 'h-[calc(100vh-12rem)]' : ''}`}>
        {filteredMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} group`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 transition-all duration-300 transform hover:scale-[1.02] ${
                message.type === 'user'
                  ? `${themes[theme].bubble.user} shadow-lg`
                  : `${themes[theme].bubble.assistant} shadow-md`
              }`}
            >
              {message.imageUrl && (
                <div className="relative mb-3">
                  <img
                    src={message.imageUrl}
                    alt="Uploaded"
                    className="max-w-full h-auto rounded-xl shadow-sm transition-transform duration-300 hover:scale-[1.02]"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopyMessage(message.content)}
                      className="p-1.5 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDownload(message.content)}
                      className="p-1.5 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-3">
                {message.type === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <Bot className="w-6 h-6 text-green-500 animate-bounce" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <p className={`whitespace-pre-wrap text-sm ${themes[theme].text}`}>{message.content}</p>
                  {message.schedule && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.schedule.tasks.map((task, taskIndex) => (
                        <div
                          key={taskIndex}
                          className="flex items-center space-x-2 bg-green-50 text-green-800 px-3 py-1.5 rounded-full text-xs"
                        >
                          {getTaskIcon(task.type)}
                          <span>{task.title}</span>
                          <span className="text-green-600">•</span>
                          <span>{new Date(task.date).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleFavorite(index)}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {favoriteMessages.has(index) ? (
                      <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                    ) : (
                      <Heart className="w-4 h-4 text-gray-500 hover:text-red-500" />
                    )}
                  </button>
                  <button
                    onClick={() => handleShare(message.content)}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-gray-500 hover:text-blue-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 shadow-md animate-pulse">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                <p className="text-sm text-gray-600">Analyzing...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`${themes[theme].bubble.assistant} rounded-2xl p-6 max-w-md w-full shadow-2xl`}>
            <h3 className={`text-lg font-semibold mb-4 ${themes[theme].text} flex items-center`}>
              <Calendar className="w-5 h-5 mr-2" />
              {currentLanguage === 'hi' ? 'कार्य अनुसूची' : 'Schedule Tasks'}
            </h3>
            <div className="space-y-4">
              {suggestedTasks.map((task, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${themes[theme].schedule}`}>
                    {task.type === 'watering' && <Droplets className="w-4 h-4" />}
                    {task.type === 'fertilizing' && <Sprout className="w-4 h-4" />}
                    {task.type === 'pesticide' && <CloudRain className="w-4 h-4" />}
                    {task.type === 'harvest' && <Sun className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${themes[theme].text}`}>{task.title}</p>
                    <p className={`text-sm ${themes[theme].text} opacity-80`}>{task.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={clearScheduledTasks}
                className={`px-4 py-2 rounded-full ${themes[theme].text} hover:opacity-80 transition-opacity`}
              >
                {currentLanguage === 'hi' ? 'सभी कार्य हटाएं' : 'Clear All Tasks'}
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className={`px-4 py-2 rounded-full ${themes[theme].text} hover:opacity-80 transition-opacity`}
                >
                  {currentLanguage === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  onClick={() => handleScheduleTasks(suggestedTasks)}
                  className={`px-4 py-2 rounded-full ${themes[theme].schedule} flex items-center space-x-2`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{currentLanguage === 'hi' ? 'अनुसूची जोड़ें' : 'Schedule'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showManualSchedule && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`${themes[theme].bubble.assistant} rounded-2xl p-6 max-w-md w-full shadow-2xl`}>
            <h3 className={`text-lg font-semibold mb-4 ${themes[theme].text} flex items-center`}>
              <Calendar className="w-5 h-5 mr-2" />
              {currentLanguage === 'hi' ? 'मैन्युअल कार्य अनुसूची' : 'Manual Task Schedule'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${themes[theme].text} mb-1`}>
                  {currentLanguage === 'hi' ? 'कार्य का शीर्षक' : 'Task Title'}
                </label>
                <input
                  type="text"
                  value={manualTask.title}
                  onChange={(e) => setManualTask({ ...manualTask, title: e.target.value })}
                  className={`w-full p-2 border rounded-lg ${themes[theme].input}`}
                  placeholder={currentLanguage === 'hi' ? 'कार्य का नाम दर्ज करें' : 'Enter task name'}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${themes[theme].text} mb-1`}>
                  {currentLanguage === 'hi' ? 'कार्य का प्रकार' : 'Task Type'}
                </label>
                <select
                  value={manualTask.type}
                  onChange={(e) => setManualTask({ ...manualTask, type: e.target.value as any })}
                  className={`w-full p-2 border rounded-lg ${themes[theme].input}`}
                >
                  <option value="watering">{currentLanguage === 'hi' ? 'सिंचाई' : 'Watering'}</option>
                  <option value="fertilizing">{currentLanguage === 'hi' ? 'खाद डालना' : 'Fertilizing'}</option>
                  <option value="pesticide">{currentLanguage === 'hi' ? 'कीटनाशक' : 'Pesticide'}</option>
                  <option value="harvest">{currentLanguage === 'hi' ? 'कटाई' : 'Harvest'}</option>
                  <option value="other">{currentLanguage === 'hi' ? 'अन्य' : 'Other'}</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${themes[theme].text} mb-1`}>
                  {currentLanguage === 'hi' ? 'विवरण' : 'Description'}
                </label>
                <textarea
                  value={manualTask.description}
                  onChange={(e) => setManualTask({ ...manualTask, description: e.target.value })}
                  className={`w-full p-2 border rounded-lg ${themes[theme].input}`}
                  placeholder={currentLanguage === 'hi' ? 'कार्य का विवरण दर्ज करें' : 'Enter task description'}
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowManualSchedule(false)}
                className={`px-4 py-2 rounded-full ${themes[theme].text} hover:opacity-80 transition-opacity`}
              >
                {currentLanguage === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={handleManualSchedule}
                className={`px-4 py-2 rounded-full ${themes[theme].schedule} flex items-center space-x-2`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{currentLanguage === 'hi' ? 'अनुसूची जोड़ें' : 'Schedule'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`${themes[theme].input} backdrop-blur-sm rounded-2xl shadow-lg p-4 sticky bottom-0 transition-colors duration-500`}>
      {imagePreview && (
          <div className="mb-3 relative inline-block group">
            <img 
              src={imagePreview} 
              alt="Selected" 
              className="h-16 w-auto rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <button 
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs transition-transform duration-300 hover:scale-110 shadow-md"
            >
              ×
            </button>
          </div>
        )}

        {transcription && (
          <div className="mb-3 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 flex items-center space-x-2">
            <Mic className="w-4 h-4 text-green-500 animate-pulse" />
            <span>{transcription}</span>
        </div>
      )}
      
        <div className="flex items-end space-x-3">
          <div className="flex space-x-1">
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                isRecording 
                  ? `${themes[theme].record} animate-pulse` 
                  : `${themes[theme].action}`
              }`}
              title={isRecording ? "Stop Recording" : "Start Recording"}
            >
              {isRecording ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${themes[theme].action}`}
              title="Upload Image"
          >
              <Image className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${themes[theme].action}`}
              title="Add Emoji"
            >
              <Sparkles className="w-5 h-5" />
          </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={currentLanguage === 'hi' ? "कृषि से संबंधित कोई भी प्रश्न पूछें..." : "Ask anything about farming..."}
            className={`flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none max-h-24 text-sm transition-all duration-300 ${themes[theme].input}`}
            rows={1}
          />
          
          <button
            onClick={handleTextSubmit}
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
            className={`p-3 rounded-xl transition-all duration-300 ${
              (!inputText.trim() && !selectedImage) || isLoading
                ? 'bg-gray-300 text-gray-500'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105 shadow-md'
            }`}
            title="Send Message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;