import { useState } from 'react';
import { Sparkles, PlayCircle, ChevronDown, ChevronUp, Flag, ThumbsUp, ThumbsDown } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';
import AISolutionModal from './AISolutionModal';
import VideoSolutionModal from './VideoSolutionModal';
import { questionAPI } from '../services/api';

const QuestionCard = ({ question, paperSubject }) => {
  const [expanded, setExpanded] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  const [aiSolution, setAiSolution] = useState(question.ai_solution || null);
  const [videos, setVideos] = useState(question.video_links || []);
  
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);
  
  const [error, setError] = useState(null);

  const handleGenerateAI = async () => {
    if (aiSolution?.text) {
      // Already have solution, just show it
      setShowAIModal(true);
      return;
    }

    setLoadingAI(true);
    setError(null);
    setShowAIModal(true);

    try {
      const response = await questionAPI.generateAISolution(question.id);
      if (response.data.success) {
        setAiSolution(response.data.ai_solution);
      } else {
        setError(response.data.message || 'Failed to generate AI solution');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate AI solution. Please try again.');
      console.error('AI generation error:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleGetVideos = async (refresh = false) => {
    if (videos.length > 0 && !refresh) {
      // Already have videos, just show them
      setShowVideoModal(true);
      return;
    }

    setLoadingVideos(true);
    setError(null);
    setShowVideoModal(true);

    try {
      const response = await questionAPI.getVideoSolutions(question.id, refresh);
      if (response.data.success) {
        setVideos(response.data.video_links || []);
      } else {
        setError(response.data.message || 'Failed to fetch video solutions');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch videos. Please try again.');
      console.error('Video fetch error:', err);
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleReportIssue = async () => {
    // TODO: Implement report issue modal
    console.log('Report issue for question:', question.id);
  };

  return (
    <>
      <div className="card-brutal">
        {/* Question Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge color="primary">Q{question.question_number}</Badge>
              {question.marks && (
                <Badge color="secondary">{question.marks} marks</Badge>
              )}
              {question.has_ai_solution && (
                <Badge color="accent">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI Available
                </Badge>
              )}
              {question.has_video_solution && (
                <Badge color="accent">
                  <PlayCircle className="w-3 h-3 inline mr-1" />
                  Videos
                </Badge>
              )}
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-100 border-2 border-black rounded-sm transition-colors"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {/* Question Text */}
        <div className={`mb-4 ${!expanded ? 'line-clamp-3' : ''}`}>
          <p className="text-gray-800 whitespace-pre-wrap">
            {question.question_text}
          </p>
        </div>

        {/* Actions */}
        {expanded && (
          <div className="space-y-3 pt-3 border-t-3 border-black">
            {/* Main Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerateAI}
                className="flex items-center gap-2"
                disabled={loadingAI}
              >
                <Sparkles className="w-4 h-4" />
                {aiSolution?.text ? 'View AI Solution' : 'Generate AI Solution'}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleGetVideos(false)}
                className="flex items-center gap-2"
                disabled={loadingVideos}
              >
                <PlayCircle className="w-4 h-4" />
                {videos.length > 0 ? `View Videos (${videos.length})` : 'Find Video Solutions'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleReportIssue}
                className="flex items-center gap-2 ml-auto"
              >
                <Flag className="w-4 h-4" />
                Report Issue
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-500 p-3 rounded-sm text-sm text-red-700">
                ⚠️ {error}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {question.views > 0 && (
                <span>{question.views} views</span>
              )}
              {question.upvotes > 0 && (
                <button className="flex items-center gap-1 hover:text-accent transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  {question.upvotes}
                </button>
              )}
              {question.downvotes > 0 && (
                <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                  {question.downvotes}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AISolutionModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        solution={aiSolution}
        questionText={question.question_text}
        loading={loadingAI}
        onRegenerate={() => {
          setAiSolution(null);
          handleGenerateAI();
        }}
      />

      <VideoSolutionModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videos={videos}
        questionText={question.question_text}
        loading={loadingVideos}
      />
    </>
  );
};

export default QuestionCard;
