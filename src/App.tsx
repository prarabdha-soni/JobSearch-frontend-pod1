import React, { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { openai } from './lib/openai';
import JobCard from './JobCard'; // Import JobCard component
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

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [queryOutput, setQueryOutput] = useState<string | null>(null); // State for query output

  // Dummy job data
  const jobs: Job[] = [
    {
      _id: '1',
      name: 'Enterprise software Officer',
      email: 'example@example.com',
      mobile: '2 - 6 years',
      details: {
        address_line_1: 'Reliance House, Unitech Commercial Tower, Tower-A',
        address_line_2: 'Netaji Subhash Marg, Block- B, Greenwood City, Sector-45',
        city: 'New Delhi, Gurugram',
        district: 'Gurugram',
        state: 'Haryana',
        pincode: 122001,
      },
    },
    {
      _id: '2',
      name: 'Solution Architect',
      email: 'example@example.com',
      mobile: '2 - 6 years',
      details: {
        address_line_1: 'Reliance House, Unitech Commercial Tower, Tower-A',
        address_line_2: 'Netaji Subhash Marg, Block- B, Greenwood City, Sector-45',
        city: 'New Delhi, Gurugram',
        district: 'Gurugram',
        state: 'Haryana',
        pincode: 122001,
      },
    },
    {
      _id: '3',
      name: 'Software Engineer',
      email: 'example@example.com',
      mobile: '2 - 6 years',
      details: {
        address_line_1: 'Reliance House, Unitech Commercial Tower, Tower-A',
        address_line_2: 'Netaji Subhash Marg, Block- B, Greenwood City, Sector-45',
        city: 'New Delhi, Gurugram',
        district: 'Gurugram',
        state: 'Haryana',
        pincode: 122001,
      },
    }
    // Add more dummy jobs here...
  ];

  const users = [
    {
      name: 'Julia Byrne',
      location: 'Ireland',
      role: 'software Engineer',
      employmentType: 'Full-time',
      ranking: 4.8,
      image: JuliaImage, // Use imported image
    },
    {
      name: 'Baptiste Sotho',
      location: 'France',
      role: 'software Engineer',
      employmentType: 'Full-time',
      ranking: 4.5,
      image: BaptisteImage, // Use imported image
    },
    {
      name: 'Steve Rogers',
      location: 'UK',
      role: 'software Engineer',
      employmentType: 'Full-time',
      ranking: 4.7,
      image: SteveImage, // Use imported image
    },
    {
      name: 'Luna Hernandez',
      location: 'Spain',
      role: 'software Engineer',
      employmentType: 'Full-time',
      ranking: 4.9,
      image: LunaImage, // Use imported image
    },
    {
      name: 'Julia Byrne',
      location: 'Ireland',
      role: 'software Engineer',
      employmentType: 'Full-time',
      ranking: 4.8,
      image: JuliaImage, // Use imported image
    },
    {
      name: 'Baptiste Sotho',
      location: 'France',
      role: 'software Engineer',
      employmentType: 'Full-time',
      ranking: 4.5,
      image: BaptisteImage, // Use imported image
    },
    {
      name: 'Steve Rogers',
      location: 'UK',
      role: 'software Engineer',
      employmentType: 'Full-time',
      ranking: 4.7,
      image: SteveImage, // Use imported image
    },
    {
      name: 'Luna Hernandez',
      location: 'Spain',
      role: 'software Engineer',
      employmentType: 'Full-time',
      ranking: 4.9,
      image: LunaImage, // Use imported image
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
    temperature: 0, // Ensures consistency
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

      // // Preprocess the response to handle MongoDB regular expressions
      // botResponse = botResponse.replace(/"\$regex":\s*"(.*?)"/g, '"$regex": "$1"');

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

      // if (query.mobile_number) {
      //   query.mobile = query.mobile_number;
      //   delete query.mobile_number;
      // }

      console.log('Transformed MongoDB Query:', query);

      const response = await fetch('http://localhost:5000/execute-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, collectionName }),
      });

      const data = await response.json();
      if (response.ok) {
        setQueryOutput(JSON.stringify(data.results, null, 2)); // Set the query output
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
      <div className="flex-[3] flex flex-col border-r"> {/* 30% width */}
  
        {/* Chat Area */}
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
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg flex-1">
              <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                P
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search skills and will give you the best..."
                className="w-full p-2 bg-transparent outline-none"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="p-2 text-gray-500 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="max-w-3xl mx-auto mt-2 text-xs text-center text-gray-500">
            Bot can make mistakes. Consider checking an important information.
          </div>
        </div>
      </div>
  
      {/* Right Column: Query Output */}
      <div className="flex-[7] bg-white p-4 overflow-y-auto"> {/* 70% width */}
        {/* <h2 className="text-lg font-semibold mb-4">Query Output</h2>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
          {queryOutput || 'No output yet. Submit a query to see the results.'}
        </pre> */}
        {/* Job Listings */}
        {/* <div className="mt-8">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div> */}
        {
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
        }
      </div>
    </div>
  );
}

export default App;
