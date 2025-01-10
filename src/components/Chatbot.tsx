import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, Bot } from 'lucide-react';
import { mockData } from '../data/mockData';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const analyzeData = (query: string) => {
    // Prepare data insights for the AI
    const dataInsights = {
      totalPosts: mockData.length,
      contentTypes: mockData.reduce((acc, post) => {
        acc[post.content.type] = (acc[post.content.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageEngagement: mockData.reduce((acc, post) => 
        acc + post.engagement.likes + post.engagement.comments + post.engagement.shares, 0
      ) / mockData.length,
      platforms: mockData.reduce((acc, post) => {
        acc[post.platform] = (acc[post.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentTrends: mockData.slice(-30).reduce((acc, post) => {
        acc.totalReach = (acc.totalReach || 0) + post.reach;
        acc.totalEngagement = (acc.totalEngagement || 0) + 
          post.engagement.likes + post.engagement.comments + post.engagement.shares;
        return acc;
      }, {} as Record<string, number>),
    };

    return `Based on our social media data analysis:
    - We have ${dataInsights.totalPosts} total posts
    - Content type distribution: ${JSON.stringify(dataInsights.contentTypes)}
    - Platform distribution: ${JSON.stringify(dataInsights.platforms)}
    - Average engagement per post: ${Math.round(dataInsights.averageEngagement)}
    
    User Query: ${query}
    
    Please analyze this data and provide insights related to the user's question. Keep the response concise and focused on the data.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      // Note: In a real application, you would need to provide your Gemini API key
      const genAI = new GoogleGenerativeAI('AIzaSyCyoasSyFVFvbh_wCZX6U6QAiq57nJqbOA');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = analyzeData(userMessage);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { text, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again later.',
        isUser: false 
      }]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b flex items-center gap-2">
        <Bot className="text-blue-500" />
        <h3 className="font-semibold">Analytics Assistant</h3>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-gray-500 text-sm">
            Try asking questions like:
            <ul className="mt-2 space-y-1">
              <li>• Which content type has the highest engagement?</li>
              <li>• What's our average reach in the last 30 days?</li>
              <li>• How do reels perform compared to regular videos?</li>
              <li>• What's the trend in follower growth?</li>
            </ul>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
              Analyzing data...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your analytics..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;