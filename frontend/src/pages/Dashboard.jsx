import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Editor from '@monaco-editor/react';
import { FaClipboard, FaCode, FaRobot } from 'react-icons/fa';
import { apiClient } from '../api/client';
import CodeClipModal from '../components/CodeClipModal';
import Notification from '../components/Notification';
import useNotification from '../hooks/useNotification';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ai-chat');
  const [codeInput, setCodeInput] = useState('');
  const [codeTitle, setCodeTitle] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! How can I help you generate some code today?',
      user_id: user.id
    }
  ]);
  const [aiPrompt, setAiPrompt] = useState('');
  const { notification, showNotification, hideNotification } = useNotification();

  const userId = user.id;

  const handleClipCode = async () => {
    try {
      if (!codeInput.trim()) {
        showNotification({
          message: 'Cannot clip empty code. Please enter some code first.',
          type: 'ERROR'
        });
        return;
      }

      let title = codeTitle.trim();

      if (!title) {
        const aiResponse = await apiClient.post('/ai/chat', {
          messages: [{ 
            role: 'user', 
            content: `CODE_INPUT:\n\n${codeInput}`,
            user_id: userId
          }]
        });
        title = aiResponse.title || 'Untitled Code Snippet';
      }

      const response = await apiClient.post('/clipped-codes/', {
        userId: userId,
        title: title,
        codeContent: codeInput,
        language: 'text',
        isAiGenerated: false
      });

      setCodeInput('');
      setCodeTitle('');
      
      showNotification({
        message: 'Code clipped successfully!',
        type: 'SUCCESS'
      });
    } catch (error) {
      showNotification({
        message: error.detail || 'Failed to save code clip',
        type: 'ERROR'
      });
    }
  };

  const handleSendPrompt = async () => {
    if (!aiPrompt.trim()) return;
    
    const userMessage = { 
      role: 'user', 
      content: aiPrompt,
      user_id: userId
    };
    
    try {
      setAiMessages(prev => [...prev, userMessage]);
      setAiPrompt('');
      
      setAiMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '...',
        isLoading: true,
        user_id: userId
      }]);

      const response = await apiClient.post('/ai/chat', {
        messages: [...aiMessages.filter(msg => !msg.isLoading), userMessage].map(msg => ({
          role: msg.role,
          content: msg.content,
          user_id: userId
        }))
      });

      setAiMessages(prev => [
        ...prev.filter(msg => !msg.isLoading),
        {
          role: 'assistant',
          content: response.content || '',
          code: response.code || '',
          title: response.title || '',
          language: response.language || '',
          notes: response.notes || '',
          timeComplexity: response.timeComplexity || '',
          spaceComplexity: response.spaceComplexity || '',
          user_id: userId
        }
      ]);

    } catch (error) {
      setAiMessages(prev => prev.filter(msg => !msg.isLoading));
      
      showNotification({
        message: 'Failed to get AI response. Please try again.',
        type: 'ERROR'
      });
      console.error('AI chat error:', error);
    }
  };

  const handleClipAiCode = async (code, title, language, notes, timeComplexity, spaceComplexity) => {
    try {
      const response = await apiClient.post('/clipped-codes/', {
        userId: userId,
        title: title || 'Untitled Code Snippet',
        codeContent: code,
        language: language || 'text',
        isAiGenerated: true,
        notes: notes,
        timeComplexity: timeComplexity,
        spaceComplexity: spaceComplexity
      });

      showNotification({
        message: 'AI code clipped successfully!',
        type: 'SUCCESS'
      });
    } catch (error) {
      console.error('Error clipping code:', error);
      showNotification({
        message: error.detail || 'Failed to save AI code clip',
        type: 'ERROR'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {notification && (
        <Notification
          {...notification}
          onClose={hideNotification}
        />
      )}
      <Navbar isLoggedIn={true} />
      
      {/* Tab Navigation - Reorder the TabButtons */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-4 border-b">
          <TabButton 
            active={activeTab === 'ai-chat'}
            onClick={() => setActiveTab('ai-chat')}
            icon={<FaRobot />}
            text="AI Generate"
          />
          <TabButton 
            active={activeTab === 'code-input'}
            onClick={() => setActiveTab('code-input')}
            icon={<FaCode />}
            text="Code Input"
          />
          <TabButton 
            active={activeTab === 'saved-clips'}
            onClick={() => setActiveTab('saved-clips')}
            icon={<FaClipboard />}
            text="My Clipboard"
          />
        </div>

        {/* Tab Content - Reorder the conditions */}
        <div className="py-6">
          {activeTab === 'ai-chat' && (
            <AIChatTab 
              messages={aiMessages} 
              prompt={aiPrompt} 
              setPrompt={setAiPrompt} 
              handleSend={handleSendPrompt} 
              handleClipCode={handleClipAiCode}
            />
          )}
          {activeTab === 'code-input' && (
            <CodeInputTab 
              codeInput={codeInput} 
              setCodeInput={setCodeInput} 
              codeTitle={codeTitle} 
              setCodeTitle={setCodeTitle} 
              handleClipCode={handleClipCode}
            />
          )}
          {activeTab === 'saved-clips' && <SavedClipsTab />}
        </div>
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon, text }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors duration-200
      ${active 
        ? 'text-blue-600 border-b-2 border-blue-600' 
        : 'text-gray-600 hover:text-blue-600'}`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

// Code Input Tab
const CodeInputTab = ({ codeInput, setCodeInput, codeTitle, setCodeTitle, handleClipCode }) => (
  <div className="space-y-4">
    <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
      <Editor
        value={codeInput}
        onChange={setCodeInput}
        defaultLanguage="javascript"
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </div>
    <div className="flex justify-between items-center">
      <input
        type="text"
        value={codeTitle}
        onChange={(e) => setCodeTitle(e.target.value)}
        placeholder="Enter title (optional - AI will generate one)"
        className="flex-1 mr-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
      <button 
        onClick={handleClipCode}
        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg"
      >
        Clip
      </button>
    </div>
  </div>
);

// Updated SavedClipsTab
const SavedClipsTab = () => {
  const [clippedCodes, setClippedCodes] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  const [filters, setFilters] = useState({
    language: 'all',
    isAiGenerated: 'all',
    dateRange: 'all' 
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchClippedCodes = async () => {
      try {
        const response = await apiClient.get(`/clipped-codes/user/${user.id}`);
        setClippedCodes(response);
      } catch (error) {
        console.error('Error fetching clipped codes:', error);
      }
    };

    fetchClippedCodes();
  }, [user.id]);

  const filteredCodes = clippedCodes.filter(clip => {
    const dateCreated = new Date(clip.createdAt);
    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
    const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));

    // Date filter
    if (filters.dateRange !== 'all') {
      switch (filters.dateRange) {
        case 'week':
          if (dateCreated < oneWeekAgo) return false;
          break;
        case 'month':
          if (dateCreated < oneMonthAgo) return false;
          break;
        case 'year':
          if (dateCreated < oneYearAgo) return false;
          break;
      }
    }

    // Language filter
    if (filters.language !== 'all' && clip.language !== filters.language) {
      return false;
    }

    // AI Generated filter
    if (filters.isAiGenerated !== 'all' && 
        clip.isAiGenerated !== (filters.isAiGenerated === 'ai')) {
      return false;
    }

    return true;
  });

  // Get unique languages for the filter dropdown
  const uniqueLanguages = [...new Set(clippedCodes.map(clip => clip.language))];

  return (
    <>
      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* Language Filter */}
        <select
          value={filters.language}
          onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Languages</option>
          {uniqueLanguages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        {/* AI Generated Filter */}
        <select
          value={filters.isAiGenerated}
          onChange={(e) => setFilters(prev => ({ ...prev, isAiGenerated: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Sources</option>
          <option value="ai">AI Generated</option>
          <option value="manual">Manually Added</option>
        </select>

        {/* Date Range Filter */}
        <select
          value={filters.dateRange}
          onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Time</option>
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
          <option value="year">Past Year</option>
        </select>
      </div>

      {/* Display filtered clips */}
      {filteredCodes.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No code clips match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCodes.map((clip) => (
            <div 
              key={clip.id} 
              className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedClip(clip)}
            >
              <h3 className="text-lg font-semibold mb-2">{clip.title}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {clip.language} • {new Date(clip.createdAt).toLocaleDateString()}
                {clip.isAiGenerated && " • AI Generated"}
              </p>
              {clip.timeComplexity && (
                <p className="text-gray-600 text-sm">Time Complexity: {clip.timeComplexity}</p>
              )}
              {clip.spaceComplexity && (
                <p className="text-gray-600 text-sm">Space Complexity: {clip.spaceComplexity}</p>
              )}
              <div className="bg-gray-100 p-4 rounded-lg mt-2">
                <pre className="text-sm line-clamp-3 overflow-hidden">
                  <code>{clip.codeContent}</code>
                </pre>
              </div>
              {clip.notes && (
                <p className="text-gray-600 text-sm mt-2">
                  <span className="font-medium">Notes:</span> {clip.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <CodeClipModal 
        clip={selectedClip}
        isOpen={selectedClip !== null}
        onClose={() => setSelectedClip(null)}
      />
    </>
  );
};

// AI Chat Tab
const AIChatTab = ({ messages, prompt, setPrompt, handleSend, handleClipCode }) => {
  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 border border-gray-200 rounded-lg mb-4 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white">
                  AI
                </div>
              )}
              <div className={`flex-1 ${message.role === 'user' ? 'bg-blue-50' : 'bg-gray-100'} rounded-lg p-4`}>
                {message.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-bounce">●</div>
                    <div className="animate-bounce delay-100">●</div>
                    <div className="animate-bounce delay-200">●</div>
                  </div>
                ) : (
                  message.code ? (
                    <div>
                      <div className="mt-4 bg-gray-800 text-white p-4 rounded-lg relative font-mono">
                        <pre className="overflow-x-auto">
                          <code>{message.code}</code>
                        </pre>
                        <button 
                          onClick={() => handleClipCode(
                            message.code, 
                            message.title, 
                            message.language,
                            message.notes,
                            message.timeComplexity,
                            message.spaceComplexity
                          )}
                          className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                        >
                          Clip
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>{message.content}</div>
                  )
                )}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  You
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI to generate code..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button 
          onClick={handleSend}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Dashboard;