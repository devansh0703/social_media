import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { mockData } from '../data/mockData';
import { BarChart3, Users, Eye, MessageSquare, Video, Image, SlidersHorizontal } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30'); // days
  const [contentType, setContentType] = useState('all');

  const filteredData = mockData
    .filter(item => {
      if (contentType === 'all') return true;
      return item.content.type === contentType;
    })
    .slice(-parseInt(timeRange));

  const contentTypeData = mockData.reduce((acc, curr) => {
    const type = curr.content.type;
    if (!acc[type]) {
      acc[type] = {
        type,
        count: 0,
        avgEngagement: 0,
        totalEngagement: 0
      };
    }
    acc[type].count++;
    const totalEngagement = curr.engagement.likes + curr.engagement.comments + curr.engagement.shares;
    acc[type].totalEngagement += totalEngagement;
    acc[type].avgEngagement = acc[type].totalEngagement / acc[type].count;
    return acc;
  }, {} as Record<string, any>);

  const contentTypeStats = Object.values(contentTypeData);

  const totalEngagement = filteredData.reduce((acc, curr) => 
    acc + curr.engagement.likes + curr.engagement.comments + curr.engagement.shares, 0
  );
  const totalReach = filteredData.reduce((acc, curr) => acc + curr.reach, 0);
  const totalFollowers = filteredData[filteredData.length - 1]?.followers || 0;
  const averageCompletionRate = filteredData
    .filter(item => item.completionRate)
    .reduce((acc, curr) => acc + (curr.completionRate || 0), 0) / 
    filteredData.filter(item => item.completionRate).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4 mb-6">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Content</option>
          <option value="reel">Reels</option>
          <option value="video">Videos</option>
          <option value="photo">Photos</option>
          <option value="carousel">Carousels</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Engagement</p>
              <h3 className="text-2xl font-bold">{totalEngagement.toLocaleString()}</h3>
            </div>
            <BarChart3 className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Reach</p>
              <h3 className="text-2xl font-bold">{totalReach.toLocaleString()}</h3>
            </div>
            <Eye className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Followers</p>
              <h3 className="text-2xl font-bold">{totalFollowers.toLocaleString()}</h3>
            </div>
            <Users className="text-purple-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Avg. Completion Rate</p>
              <h3 className="text-2xl font-bold">
                {averageCompletionRate.toFixed(1)}%
              </h3>
            </div>
            <Video className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Engagement by Content Type</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentTypeStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgEngagement" fill="#8884d8" name="Average Engagement" />
                <Bar dataKey="count" fill="#82ca9d" name="Post Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Engagement Over Time</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="engagement.likes" stroke="#8884d8" name="Likes" />
                <Line type="monotone" dataKey="engagement.comments" stroke="#82ca9d" name="Comments" />
                <Line type="monotone" dataKey="engagement.shares" stroke="#ffc658" name="Shares" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;