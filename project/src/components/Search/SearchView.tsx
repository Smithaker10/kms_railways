import React, { useState } from 'react';
import { Search, ThumbsUp, ThumbsDown, FileText, Tag, Clock, User } from 'lucide-react';
import { SearchResult } from '../../types';

const SearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    dateRange: 'all',
    department: 'all'
  });

  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Emergency Evacuation Procedures for Metro Stations',
      snippet: 'Standard operating procedure for emergency evacuation including fire, medical emergencies, and security threats. Updated protocols for crowd management and coordination with emergency services.',
      relevanceScore: 0.95,
      document: {
        id: '1',
        title: 'Emergency Evacuation Procedures for Metro Stations',
        content: 'Full document content...',
        category: 'sop',
        tags: ['emergency', 'evacuation', 'safety', 'procedures'],
        uploadedBy: 'Safety Team',
        uploadedAt: '2024-01-15',
        lastModified: '2024-01-15',
        version: '2.1'
      }
    },
    {
      id: '2',
      title: 'Daily Maintenance Checklist for Escalators',
      snippet: 'Comprehensive checklist for daily inspection and maintenance of escalators across all metro stations. Includes safety checks, cleaning procedures, and reporting protocols.',
      relevanceScore: 0.87,
      document: {
        id: '2',
        title: 'Daily Maintenance Checklist for Escalators',
        content: 'Full document content...',
        category: 'checklist',
        tags: ['maintenance', 'escalator', 'daily', 'inspection'],
        uploadedBy: 'Maintenance Team',
        uploadedAt: '2024-01-10',
        lastModified: '2024-01-10',
        version: '1.5'
      }
    },
    {
      id: '3',
      title: 'Train Operations Manual - Section 4: Signal Systems',
      snippet: 'Detailed guide on train signal systems, including automated train control (ATC), communication-based train control (CBTC), and manual override procedures.',
      relevanceScore: 0.82,
      document: {
        id: '3',
        title: 'Train Operations Manual - Section 4: Signal Systems',
        content: 'Full document content...',
        category: 'manual',
        tags: ['operations', 'signals', 'ATC', 'CBTC', 'trains'],
        uploadedBy: 'Operations Team',
        uploadedAt: '2024-01-05',
        lastModified: '2024-01-05',
        version: '3.0'
      }
    }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter mock results based on query
    const filteredResults = mockResults.filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.snippet.toLowerCase().includes(query.toLowerCase()) ||
      result.document.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    setResults(filteredResults);
    setIsLoading(false);
  };

  const handleFeedback = (resultId: string, feedback: 'positive' | 'negative') => {
    setResults(prev => prev.map(result => 
      result.id === resultId ? { ...result, feedback } : result
    ));
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      sop: 'bg-blue-100 text-blue-800',
      manual: 'bg-green-100 text-green-800',
      checklist: 'bg-orange-100 text-orange-800',
      policy: 'bg-purple-100 text-purple-800',
      incident_report: 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryName = (category: string) => {
    const names = {
      sop: 'SOP',
      manual: 'Manual',
      checklist: 'Checklist',
      policy: 'Policy',
      incident_report: 'Incident Report'
    };
    return names[category as keyof typeof names] || category;
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Search</h1>
        <p className="text-gray-600">
          Search through documents, procedures, and knowledge base using AI-powered semantic search
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for procedures, manuals, SOPs, policies..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="sop">SOPs</option>
            <option value="manual">Manuals</option>
            <option value="checklist">Checklists</option>
            <option value="policy">Policies</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Departments</option>
            <option value="operations">Operations</option>
            <option value="maintenance">Maintenance</option>
            <option value="safety">Safety</option>
            <option value="compliance">Compliance</option>
          </select>
        </div>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-600">Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</p>
        </div>
      )}

      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                  {result.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{result.snippet}</p>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-500">Relevance: {Math.round(result.relevanceScore * 100)}%</span>
              </div>
            </div>

            {/* Document metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(result.document.category)}`}>
                {getCategoryName(result.document.category)}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {result.document.uploadedBy}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated {result.document.lastModified}
              </span>
              <span>Version {result.document.version}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {result.document.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                <FileText className="h-4 w-4" />
                View Full Document
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Was this helpful?</span>
                <button
                  onClick={() => handleFeedback(result.id, 'positive')}
                  className={`p-1 rounded transition-colors ${
                    result.feedback === 'positive' 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-gray-400 hover:text-green-600'
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleFeedback(result.id, 'negative')}
                  className={`p-1 rounded transition-colors ${
                    result.feedback === 'negative' 
                      ? 'text-red-600 bg-red-100' 
                      : 'text-gray-400 hover:text-red-600'
                  }`}
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Searching knowledge base...</span>
        </div>
      )}

      {query && results.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No results found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-2">Try different keywords or check the filters</p>
        </div>
      )}
    </div>
  );
};

export default SearchView;