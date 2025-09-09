import React, { useState } from 'react';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';

interface FileUpload {
  id: string;
  file: File;
  title: string;
  category: string;
  tags: string[];
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

const UploadView: React.FC = () => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (fileList: File[]) => {
    const newFiles = fileList.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      category: 'manual',
      tags: [],
      status: 'uploading' as const,
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(fileUpload => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === fileUpload.id) {
            const newProgress = Math.min(f.progress + 10, 100);
            return {
              ...f,
              progress: newProgress,
              status: newProgress === 100 ? 'success' : 'uploading'
            };
          }
          return f;
        }));
      }, 200);

      setTimeout(() => clearInterval(interval), 2000);
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileMetadata = (id: string, updates: Partial<FileUpload>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const addTag = (id: string, tag: string) => {
    if (tag.trim()) {
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, tags: [...f.tags, tag.trim()] } : f
      ));
    }
  };

  const removeTag = (id: string, tagIndex: number) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, tags: f.tags.filter((_, i) => i !== tagIndex) } : f
    ));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h1>
        <p className="text-gray-600">
          Upload new documents to the knowledge management system
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg text-gray-900 mb-2">Drop files here or click to browse</p>
        <p className="text-sm text-gray-500">
          Supported formats: PDF, DOC, DOCX, TXT, XLS, XLSX (max 10MB per file)
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h2>
          <div className="space-y-4">
            {files.map((fileUpload) => (
              <div key={fileUpload.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {fileUpload.status === 'success' ? (
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                    ) : fileUpload.status === 'error' ? (
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <File className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{fileUpload.file.name}</h3>
                        <p className="text-sm text-gray-500">
                          {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(fileUpload.id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Upload Progress */}
                    {fileUpload.status === 'uploading' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Uploading...</span>
                          <span className="text-sm text-gray-600">{fileUpload.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                            style={{ width: `${fileUpload.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Metadata Form */}
                    {fileUpload.status === 'success' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Document Title
                            </label>
                            <input
                              type="text"
                              value={fileUpload.title}
                              onChange={(e) => updateFileMetadata(fileUpload.id, { title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Category
                            </label>
                            <select
                              value={fileUpload.category}
                              onChange={(e) => updateFileMetadata(fileUpload.id, { category: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="manual">Manual</option>
                              <option value="sop">SOP</option>
                              <option value="checklist">Checklist</option>
                              <option value="policy">Policy</option>
                              <option value="incident_report">Incident Report</option>
                            </select>
                          </div>
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {fileUpload.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                              >
                                {tag}
                                <button
                                  onClick={() => removeTag(fileUpload.id, index)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Add tags (press Enter)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addTag(fileUpload.id, e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {files.some(f => f.status === 'success') && (
            <div className="mt-6 flex justify-end">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Save All Documents
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Upload Guidelines</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Ensure documents are properly formatted and readable</li>
          <li>• Use descriptive titles and relevant tags for better searchability</li>
          <li>• Select the appropriate category for proper organization</li>
          <li>• Check for sensitive information before uploading</li>
          <li>• Maximum file size: 10MB per document</li>
          <li>• Supported formats: PDF, DOC, DOCX, TXT, XLS, XLSX</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadView;