import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Sun, Moon, Leaf, Bot, Sparkles, Brain, Cpu, Zap, Calendar, Home, DollarSign, MessageSquare } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import Scheduler from './components/Scheduler';
import ExpenseTracker from './components/ExpenseTracker';
import { themes } from './utils/themes';

function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'scheduler'>('chat');
  const [theme, setTheme] = useState<'light' | 'dark' | 'nature'>('nature');

  useEffect(() => {
    document.documentElement.className = theme;
    document.body.className = `${themes[theme].bg} min-h-screen transition-colors duration-500`;
  }, [theme]);

  return (
    <Router>
      <div className={`${themes[theme].bg} min-h-screen transition-colors duration-500`}>
        <Toaster position="top-right" />
        <header className={`${themes[theme].header} backdrop-blur-sm shadow-lg sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="relative">
                  <Bot className="w-10 h-10 text-emerald-400 animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className={`text-2xl font-bold ${themes[theme].text} flex items-center`}>
                  AgriGuard AI Agent
                  <span className={`ml-2 text-sm ${themes[theme].button} px-2 py-1 rounded-full flex items-center`}>
                    <Brain className="w-3 h-3 mr-1" />
                    AI
                  </span>
                </h1>
                <p className={`text-sm ${themes[theme].text} opacity-80`}>
                  Advanced Agricultural Intelligence System
                </p>
              </div>
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
            </div>
          </div>
        </header>

        <nav className={`${themes[theme].header} backdrop-blur-sm shadow-lg`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                      isActive
                        ? `${themes[theme].button} shadow-lg`
                        : `${themes[theme].text} opacity-80 hover:opacity-100`
                    }`
                  }
                >
                  <Bot className="w-4 h-4" />
                  <span>AI Agent</span>
                </NavLink>
                <NavLink
                  to="/scheduler"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                      isActive
                        ? `${themes[theme].button} shadow-lg`
                        : `${themes[theme].text} opacity-80 hover:opacity-100`
                    }`
                  }
                >
                  <Calendar className="w-4 h-4" />
                  <span>Scheduler</span>
                </NavLink>
                <NavLink
                  to="/expenses"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                      isActive
                        ? `${themes[theme].button} shadow-lg`
                        : `${themes[theme].text} opacity-80 hover:opacity-100`
                    }`
                  }
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Expenses</span>
                </NavLink>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full ${themes[theme].button} text-xs flex items-center space-x-1`}>
                  <Cpu className="w-3 h-3" />
                  <span>Powered by Gemini AI</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow flex items-center justify-center p-4">
          <Routes>
            <Route path="/" element={<ChatInterface theme={theme} setTheme={setTheme} />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/expenses" element={<ExpenseTracker />} />
          </Routes>
        </main>

        <footer className={`${themes[theme].header} backdrop-blur-sm shadow-lg mt-8`}>
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <p className={`text-sm ${themes[theme].text}`}>
                © 2024 AgriGuard AI Agent. All rights reserved.
              </p>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full ${themes[theme].button} text-xs flex items-center space-x-1`}>
                  <Zap className="w-3 h-3" />
                  <span>Advanced AI System</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;