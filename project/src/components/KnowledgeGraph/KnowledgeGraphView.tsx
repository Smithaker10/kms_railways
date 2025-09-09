import React, { useState, useEffect } from 'react';
import { Search, Layers, Filter, Maximize2 } from 'lucide-react';
import { KnowledgeGraphNode, KnowledgeGraphLink } from '../../types';

const KnowledgeGraphView: React.FC = () => {
  const [nodes, setNodes] = useState<KnowledgeGraphNode[]>([]);
  const [links, setLinks] = useState<KnowledgeGraphLink[]>([]);
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Mock data for knowledge graph
    const mockNodes: KnowledgeGraphNode[] = [
      { id: '1', label: 'Emergency Procedures', type: 'topic', category: 'safety' },
      { id: '2', label: 'Evacuation SOP', type: 'document', category: 'sop' },
      { id: '3', label: 'Fire Safety', type: 'procedure', category: 'safety' },
      { id: '4', label: 'Maintenance Manual', type: 'document', category: 'maintenance' },
      { id: '5', label: 'Daily Inspections', type: 'procedure', category: 'maintenance' },
      { id: '6', label: 'Equipment Checklist', type: 'document', category: 'checklist' },
      { id: '7', label: 'Train Operations', type: 'topic', category: 'operations' },
      { id: '8', label: 'Signal Systems', type: 'procedure', category: 'operations' },
      { id: '9', label: 'ATC Manual', type: 'document', category: 'manual' },
      { id: '10', label: 'CBTC Procedures', type: 'document', category: 'sop' }
    ];

    const mockLinks: KnowledgeGraphLink[] = [
      { source: '1', target: '2', relation: 'includes' },
      { source: '1', target: '3', relation: 'relates_to' },
      { source: '2', target: '3', relation: 'references' },
      { source: '4', target: '5', relation: 'contains' },
      { source: '5', target: '6', relation: 'uses' },
      { source: '7', target: '8', relation: 'includes' },
      { source: '8', target: '9', relation: 'documented_in' },
      { source: '8', target: '10', relation: 'implemented_by' },
      { source: '9', target: '10', relation: 'related_to' }
    ];

    setNodes(mockNodes);
    setLinks(mockLinks);
  }, []);

  const getNodeColor = (type: string) => {
    const colors = {
      document: '#3B82F6',
      topic: '#10B981',
      procedure: '#F59E0B'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const getNodeSize = (type: string) => {
    const sizes = {
      topic: 20,
      document: 15,
      procedure: 12
    };
    return sizes[type as keyof typeof sizes] || 12;
  };

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || node.type === filterType;
    return matchesSearch && matchesType;
  });

  const GraphVisualization = () => {
    return (
      <div className="relative w-full h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 800 400">
          {/* Render links */}
          {links.map((link, index) => {
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);
            if (!sourceNode || !targetNode) return null;

            // Simple positioning for demo (in real app, use D3.js or similar)
            const sourceX = (parseInt(sourceNode.id) % 4) * 200 + 100;
            const sourceY = Math.floor(parseInt(sourceNode.id) / 4) * 100 + 50;
            const targetX = (parseInt(targetNode.id) % 4) * 200 + 100;
            const targetY = Math.floor(parseInt(targetNode.id) / 4) * 100 + 50;

            return (
              <line
                key={index}
                x1={sourceX}
                y1={sourceY}
                x2={targetX}
                y2={targetY}
                stroke="#D1D5DB"
                strokeWidth="2"
              />
            );
          })}

          {/* Render nodes */}
          {filteredNodes.map((node) => {
            const x = (parseInt(node.id) % 4) * 200 + 100;
            const y = Math.floor(parseInt(node.id) / 4) * 100 + 50;
            const size = getNodeSize(node.type);
            const color = getNodeColor(node.type);

            return (
              <g key={node.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={color}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedNode(node)}
                />
                <text
                  x={x}
                  y={y + size + 15}
                  textAnchor="middle"
                  className="text-xs fill-gray-700 cursor-pointer"
                  onClick={() => setSelectedNode(node)}
                >
                  {node.label.length > 15 ? node.label.substring(0, 15) + '...' : node.label}
                </text>
              </g>
            );
          })}
        </svg>
        
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Topics</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Documents</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Procedures</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Graph Explorer</h1>
        <p className="text-gray-600">
          Visualize relationships between documents, topics, and procedures in your knowledge base
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search nodes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="topic">Topics</option>
              <option value="document">Documents</option>
              <option value="procedure">Procedures</option>
            </select>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Maximize2 className="h-4 w-4" />
            Fullscreen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Graph Visualization */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Knowledge Network</h2>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">{filteredNodes.length} nodes</span>
              </div>
            </div>
            
            <GraphVisualization />
          </div>
        </div>

        {/* Node Details Panel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Node Details</h3>
          
          {selectedNode ? (
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getNodeColor(selectedNode.type) }}
                  ></div>
                  <span className="font-medium text-gray-900">{selectedNode.label}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 capitalize">{selectedNode.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 capitalize">{selectedNode.category}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Connected Nodes</h4>
                <div className="space-y-2">
                  {links
                    .filter(link => link.source === selectedNode.id || link.target === selectedNode.id)
                    .map((link, index) => {
                      const connectedNodeId = link.source === selectedNode.id ? link.target : link.source;
                      const connectedNode = nodes.find(n => n.id === connectedNodeId);
                      if (!connectedNode) return null;

                      return (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getNodeColor(connectedNode.type) }}
                          ></div>
                          <span className="text-gray-900">{connectedNode.label}</span>
                          <span className="text-gray-500 text-xs">({link.relation})</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Click on a node to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Graph Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-900">Topics</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{nodes.filter(n => n.type === 'topic').length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-900">Documents</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{nodes.filter(n => n.type === 'document').length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm font-medium text-gray-900">Procedures</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{nodes.filter(n => n.type === 'procedure').length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-sm font-medium text-gray-900">Connections</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{links.length}</p>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphView;