import React, { useState } from 'react';
import { Send, Bot, User, ChevronDown, Menu, Settings, LogOut, Loader2 } from 'lucide-react';
import { openai } from './lib/openai';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are Bolt, an expert AI assistant and exceptional senior software developer with vast knowledge across multiple programming languages, frameworks, and best practices.' },
          ...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: input }
        ],
        model: 'gpt-3.5-turbo',
      });

      const botMessage: Message = {
        role: 'assistant',
        content: completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.',
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please make sure your OpenAI API key is set correctly.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-gray-900 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-4">
          <button
            className="w-full bg-white/10 hover:bg-white/20 transition-colors rounded-lg p-3 text-white flex items-center justify-between"
            onClick={() => {
              setMessages([]);
              setIsSidebarOpen(true);
            }}
          >
            <span>New Chat</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2">
            <h2 className="text-xs text-gray-400 font-medium mb-2">Today</h2>
            <div className="space-y-2">
              {['Previous Chat 1', 'Previous Chat 2'].map((chat, index) => (
                <button
                  key={index}
                  className="w-full text-left text-gray-300 hover:bg-white/10 rounded p-2 text-sm transition-colors"
                >
                  {chat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 p-4 space-y-2">
          <button className="w-full text-left text-gray-300 hover:bg-white/10 rounded p-2 text-sm transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button className="w-full text-left text-gray-300 hover:bg-white/10 rounded p-2 text-sm transition-colors flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b flex items-center px-4 bg-white">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
                <p>Ask me anything! I'm here to assist.</p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-8 px-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 mb-8 ${
                    message.role === 'assistant' ? 'bg-gray-50' : ''
                  } py-8 px-4 -mx-4`}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-6 h-6 text-blue-500 mt-1" />
                  ) : (
                    <User className="w-6 h-6 text-gray-600 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="prose prose-sm max-w-none">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-500 justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Thinking...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Bolt..."
              className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="max-w-3xl mx-auto mt-2 text-xs text-center text-gray-500">
            Bolt can make mistakes. Consider checking important information.
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;