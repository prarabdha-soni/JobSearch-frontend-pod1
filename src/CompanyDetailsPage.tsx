import React, { useState, useEffect } from 'react';
import { Upload, Bot, User, Loader2, Building, X } from 'lucide-react';
import { openai } from './lib/openai';
import c1 from './images/c1.png';
import c2 from './images/c2.png';

interface Company {
  _id: string;
  name: string;
  industry: string;
  location: string;
  description: string;
  website: string;
  employees: string;
  logo: string;
}

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export default function CompanyDetailsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobRequirements, setJobRequirements] = useState({
    title: '',
    company: '',
    experience: '',
    location: '',
    salary: '',
    description: ''
  });

  const dummyCompanies = [
    {
      _id: '1',
      name: 'Tech Innovators Inc.',
      industry: 'Information Technology',
      location: 'San Francisco, CA',
      description: 'Leading provider of AI-powered solutions for enterprises',
      website: 'www.techinnovators.com',
      employees: '5001-10,000',
      logo: c1
    },
    {
      _id: '2',
      name: 'Green Energy Corp',
      industry: 'Renewable Energy',
      location: 'Austin, TX',
      description: 'Pioneering sustainable energy solutions',
      website: 'www.greenenergycorp.com',
      employees: '1001-5000',
      logo: c2
    }
  ];
  
  useEffect(() => {
    setCompanies(dummyCompanies);
  }, []);

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
            content: 'You are a MongoDB query generator for company search. Respond with valid MongoDB query in JSON format. Use "companies" collection. Fields: name, industry, location, description, website, employees.',
          },
          { role: 'user', content: input },
        ],
      });

      const botResponse = completion.choices[0]?.message?.content || 'Unable to generate query';
      const botMessage: Message = { role: 'assistant', content: `Searching companies...` };
      setMessages((prev) => [...prev, botMessage]);

      const query = JSON.parse(botResponse);
      const response = await fetch('http://localhost:5000/execute-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query,
          collectionName: 'companies' 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCompanies(data.results.length > 0 ? data.results : dummyCompanies);
      } else {
        throw new Error(data.error || 'Failed to execute query');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Error processing request. Showing default companies.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
      setCompanies(dummyCompanies);
    } finally {
      setIsLoading(false);
    }
  };

  const JobFormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Post Job Requirements</h2>
          <button 
            onClick={() => setShowJobForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log('Job Requirements:', jobRequirements);
          setShowJobForm(false);
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-md"
              value={jobRequirements.title}
              onChange={(e) => setJobRequirements(prev => ({...prev, title: e.target.value}))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-md"
              value={jobRequirements.company}
              onChange={(e) => setJobRequirements(prev => ({...prev, company: e.target.value}))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Experience</label>
              <select
                required
                className="w-full p-2 border rounded-md"
                value={jobRequirements.experience}
                onChange={(e) => setJobRequirements(prev => ({...prev, experience: e.target.value}))}
              >
                <option value="">Select</option>
                <option value="0-2 years">0-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={jobRequirements.location}
                onChange={(e) => setJobRequirements(prev => ({...prev, location: e.target.value}))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Salary Range</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={jobRequirements.salary}
              onChange={(e) => setJobRequirements(prev => ({...prev, salary: e.target.value}))}
              placeholder="e.g., $80k - $120k"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Job Description</label>
            <textarea
              required
              className="w-full p-2 border rounded-md h-32"
              value={jobRequirements.description}
              onChange={(e) => setJobRequirements(prev => ({...prev, description: e.target.value}))}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );

  const handleUploadClick = () => {
    setShowJobForm(true);
    setJobRequirements({
      title: '',
      company: '',
      experience: '',
      location: '',
      salary: '',
      description: ''
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {showJobForm && <JobFormModal />}

      <div className="flex-[3] flex flex-col border-r">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Building className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h2 className="text-2xl font-semibold mb-2">Find Company Profiles</h2>
                <p>Search for companies by industry, location, or technology</p>
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
                    <div className="prose prose-sm max-w-none">{message.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-500 justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Searching...</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t bg-white p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg flex-1">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                C
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search companies by industry, location, or technology..."
                className="w-full p-2 bg-transparent outline-none"
                disabled={isLoading}
              />
              {/* <button
                type="button"
                onClick={handleUploadClick}
                className="text-gray-500 hover:text-blue-500 transition-colors"
              >
                <Upload className="w-5 h-5" />
              </button> */}
            </div>
          </form>
        </div>
      </div>

      <div className="flex-[7] bg-white p-4 overflow-y-auto">
        <div className="p-8 bg-gray-50 min-h-screen">
          <h1 className="text-2xl font-bold mb-6">Company Profiles</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
  {companies.map((company) => (
    <div key={company._id} className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-start gap-4 mb-4">
        {company.logo && (
          <img src={company.logo} alt={`${company.name} logo`} className="w-12 h-12 object-cover rounded-lg" />
        )}
        <div>
          <h2 className="text-xl font-semibold">{company.name}</h2>
          <p className="text-sm text-gray-600">{company.industry}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <p><strong>Location:</strong> {company.location}</p>
        <p><strong>Employees:</strong> {company.employees}</p>
        <p><strong>Website:</strong> 
          <a href={`https://${company.website}`} className="text-blue-500 hover:underline ml-2">
            {company.website}
          </a>
        </p>
        <p className="text-gray-600 mt-2">{company.description}</p>
      </div>
    </div>
  ))}
</div>

        </div>
      </div>
    </div>
  );
}