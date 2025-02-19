const CodeClipModal = ({ clip, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[80vw] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{clip.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          <div className="mb-4 text-sm text-gray-600">
            {clip.language} • {new Date(clip.createdAt).toLocaleDateString()}
            {clip.isAiGenerated && " • AI Generated"}
          </div>
          {(clip.timeComplexity || clip.spaceComplexity || clip.notes) && (
            <div className="mb-4 text-sm text-gray-600">
              {clip.timeComplexity && (
                <div>Time Complexity: {clip.timeComplexity}</div>
              )}
              {clip.spaceComplexity && (
                <div>Space Complexity: {clip.spaceComplexity}</div>
              )}
              {clip.notes && (
                <div className="mt-4">Notes: {clip.notes}</div>
              )}
            </div>
          )}
          <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm"><code>{clip.codeContent}</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeClipModal; 