import React, { useState } from 'react';
import { Bot, User, Loader2 } from 'lucide-react';
import { openai } from './lib/openai';
import JobCard from './JobCard';
import UserCard from './UserCard';

import JuliaImage from './images/a.png';
import BaptisteImage from './images/b.png';
import SteveImage from './images/c.png';
import LunaImage from './images/d.png';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface Job {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  details: {
    address_line_1: string;
    address_line_2: string;
    city: string;
    district: string;
    state: string;
    pincode: number;
  };
}

export default function UserDetailsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [queryOutput, setQueryOutput] = useState<string | null>(null);

  const users = [
    {
      name: 'Julia Byrne',
      location: 'Ireland',
      role: 'Software Engineer',
      employmentType: 'Full-time',
      ranking: 4.8,
      image: JuliaImage,
    },
    {
      name: 'Baptiste Sotho',
      location: 'France',
      role: 'Software Engineer',
      employmentType: 'Full-time',
      ranking: 4.5,
      image: BaptisteImage,
    },
    {
      name: 'Steve Rogers',
      location: 'UK',
      role: 'Software Engineer',
      employmentType: 'Full-time',
      ranking: 4.7,
      image: SteveImage,
    },
    {
      name: 'Luna Hernandez',
      location: 'Spain',
      role: 'Software Engineer',
      employmentType: 'Full-time',
      ranking: 4.9,
      image: LunaImage,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [
          {
            role: 'system',
            content: 'You are a MongoDB query generator. Always respond with a valid MongoDB query in JSON format. Do not include any explanations or additional text.',
          },
          { role: 'user', content: input },
        ],
      });

      let botResponse = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
      console.log('Bot Response:', botResponse);

      const botMessage: Message = {
        role: 'assistant',
        content: `What else can I help you with?`,
      };
      setMessages((prev) => [...prev, botMessage]);

      let query;
      try {
        query = JSON.parse(botResponse);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setQueryOutput('Error parsing query. Please try again.');
        return;
      }

      const collectionName = 'users';

      console.log('Transformed MongoDB Query:', query);

      const response = await fetch('http://localhost:5000/execute-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, collectionName }),
      });

      const data = await response.json();
      if (response.ok) {
        setQueryOutput(JSON.stringify(data.results, null, 2));
      } else {
        throw new Error(data.error || 'Failed to execute query');
      }
    } catch (error) {
      console.error('Error:', error);
      setQueryOutput('Error executing query. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Column: Chat Area */}
      <div className="flex-[3] flex flex-col border-r">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Bot className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h2 className="text-2xl font-semibold mb-2">Find best talents, so easy...?</h2>
                <p>Changing the way you find.</p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-8 px-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 mb-8 ${message.role === 'assistant' ? 'bg-gray-50' : ''} py-8 px-4 -mx-4`}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-6 h-6 text-blue-500 mt-1" />
                  ) : (
                    <User className="w-6 h-6 text-gray-600 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="prose prose-sm max-w-none">{message.content}</div>
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
          <form className="max-w-3xl mx-auto relative flex items-center gap-2" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg flex-1">
              <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                P
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search skills and we will give you the best..."
                className="w-full p-2 bg-transparent outline-none"
                disabled={isLoading}
              />
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Query Output */}
      <div className="flex-[7] bg-white p-4 overflow-y-auto">
        <div className="p-8 bg-gray-50 min-h-screen">
          <h1 className="text-2xl font-bold mb-6">User Profiles</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user, index) => (
              <UserCard
                key={index}
                name={user.name}
                location={user.location}
                role={user.role}
                employmentType={user.employmentType}
                ranking={user.ranking}
                image={user.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
