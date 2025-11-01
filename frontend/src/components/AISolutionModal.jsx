import { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { Sparkles, Copy, ThumbsUp, ThumbsDown, RefreshCw, CheckCircle } from 'lucide-react';

const AISolutionModal = ({ isOpen, onClose, solution, questionText, loading = false, onRegenerate }) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCopy = async () => {
    if (solution?.text) {
      try {
        await navigator.clipboard.writeText(solution.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    // TODO: Send feedback to backend
    console.log(`Feedback: ${type}`);
  };

  const formatSolution = (text) => {
    if (!text) return null;

    // Split by double newlines for paragraphs
    const paragraphs = text.split('\n\n');

    return paragraphs.map((paragraph, index) => {
      // Check if it's a numbered list item
      if (/^\d+\./.test(paragraph.trim())) {
        return (
          <div key={index} className="mb-3 pl-4">
            <p className="text-gray-800">{paragraph}</p>
          </div>
        );
      }

      // Check if it's a heading (all caps or starts with **)
      if (paragraph === paragraph.toUpperCase() || paragraph.startsWith('**')) {
        const cleanText = paragraph.replace(/\*\*/g, '');
        return (
          <h3 key={index} className="font-bold text-lg mb-2 mt-4 text-gray-900">
            {cleanText}
          </h3>
        );
      }

      // Check if it's a bullet point
      if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•')) {
        return (
          <div key={index} className="mb-2 pl-6">
            <p className="text-gray-800">{paragraph.replace(/^[-•]\s*/, '• ')}</p>
          </div>
        );
      }

      // Regular paragraph
      return (
        <p key={index} className="mb-3 text-gray-800 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          AI Solution
        </div>
      }
      size="large"
    >
      <div className="space-y-4">
        {/* Question Preview */}
        <div className="bg-gray-50 border-3 border-black p-4 rounded-sm">
          <p className="text-sm font-semibold text-gray-600 mb-2">Question:</p>
          <p className="text-gray-900">{questionText}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Generating AI solution...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        ) : solution ? (
          <>
            {/* Solution Content */}
            <div className="bg-white border-3 border-black p-6 rounded-sm max-h-96 overflow-y-auto">
              {/* AI Model Badge */}
              <div className="mb-4 flex items-center gap-2">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-white text-xs font-bold rounded-sm border-2 border-black">
                  <Sparkles className="w-3 h-3" />
                  {solution.model || 'AI Generated'}
                </div>
                {solution.cached && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-white text-xs font-bold rounded-sm border-2 border-black">
                    <CheckCircle className="w-3 h-3" />
                    Cached
                  </div>
                )}
              </div>

              {/* Formatted Solution */}
              <div className="prose prose-sm max-w-none">
                {formatSolution(solution.text)}
              </div>

              {/* Generation Time */}
              {solution.generated_at && (
                <div className="mt-4 pt-4 border-t-2 border-gray-200">
                  <p className="text-xs text-gray-500">
                    Generated on {new Date(solution.generated_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Feedback Section */}
            <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 border-3 border-black rounded-sm">
              <p className="text-sm font-semibold text-gray-700">Was this solution helpful?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFeedback('helpful')}
                  className={`
                    p-2 border-2 border-black rounded-sm transition-all
                    ${feedback === 'helpful' 
                      ? 'bg-accent text-white' 
                      : 'bg-white hover:bg-gray-100'
                    }
                  `}
                  title="Helpful"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleFeedback('not-helpful')}
                  className={`
                    p-2 border-2 border-black rounded-sm transition-all
                    ${feedback === 'not-helpful' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white hover:bg-gray-100'
                    }
                  `}
                  title="Not Helpful"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Solution
                  </>
                )}
              </Button>
              
              {onRegenerate && (
                <Button
                  variant="outline"
                  onClick={onRegenerate}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </Button>
              )}
              
              <Button variant="outline" onClick={onClose} className="ml-auto">
                Close
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-gray-500 text-center p-3 bg-yellow-50 border-2 border-yellow-300 rounded-sm">
              ⚠️ AI-generated solutions may contain errors. Please verify with official sources.
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No AI solution available</p>
            <p className="text-sm text-gray-500">Click generate to create a solution</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AISolutionModal;
