import { useEffect, useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { PlayCircle, ExternalLink, Eye, ThumbsUp, Clock } from 'lucide-react';

const VideoSolutionModal = ({ isOpen, onClose, videos = [], questionText, loading = false, initialVideo = null }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Preselect initial video or first result when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialVideo) {
        setSelectedVideo(initialVideo);
      } else if (videos && videos.length > 0) {
        setSelectedVideo(videos[0]);
      }
    } else {
      setSelectedVideo(null);
    }
  }, [isOpen, initialVideo, videos]);

  const formatDuration = (isoDuration) => {
    if (!isoDuration) return 'N/A';
    
    // Parse ISO 8601 duration (PT15M30S)
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 'N/A';
    
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    
    return parts.join(' ');
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📺 Video Solutions"
      size="large"
    >
      <div className="space-y-4">
        {/* Question Preview */}
        <div className="bg-gray-50 border-3 border-black p-4 rounded-sm">
          <p className="text-sm font-semibold text-gray-600 mb-2">Question:</p>
          <p className="text-gray-900 line-clamp-3">{questionText}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Searching for video solutions...</p>
          </div>
        ) : videos && videos.length > 0 ? (
          <>
            {/* Video Player */}
            {selectedVideo && (
              <div className="mb-6">
                <div className="aspect-video w-full border-3 border-black rounded-sm overflow-hidden bg-black">
                  <iframe
                    src={selectedVideo.embed_url}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="mt-3 p-3 bg-white border-3 border-black rounded-sm">
                  <h3 className="font-bold text-lg mb-1">{selectedVideo.title}</h3>
                  <p className="text-sm text-gray-600">by {selectedVideo.channel}</p>
                </div>
              </div>
            )}

            {/* Video List */}
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-primary" />
                {selectedVideo ? 'Other Videos' : 'Select a Video'}
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {videos.map((video, index) => (
                  <div
                    key={video.video_id || index}
                    className={`
                      border-3 border-black p-3 rounded-sm cursor-pointer
                      transition-all duration-200
                      ${selectedVideo?.video_id === video.video_id 
                        ? 'bg-primary text-white shadow-brutal-sm' 
                        : 'bg-white hover:bg-gray-50 hover:shadow-brutal-sm'
                      }
                    `}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="flex gap-3">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-32 h-20 object-cover border-2 border-black rounded-sm"
                        />
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold mb-1 line-clamp-2 ${
                          selectedVideo?.video_id === video.video_id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {video.title}
                        </h4>
                        <p className={`text-sm mb-2 ${
                          selectedVideo?.video_id === video.video_id ? 'text-gray-100' : 'text-gray-600'
                        }`}>
                          {video.channel}
                        </p>
                        
                        {/* Video Stats */}
                        <div className={`flex flex-wrap gap-3 text-xs ${
                          selectedVideo?.video_id === video.video_id ? 'text-gray-100' : 'text-gray-500'
                        }`}>
                          {video.views > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {formatViews(video.views)} views
                            </span>
                          )}
                          {video.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(video.duration)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Watch Button */}
                      <div className="flex-shrink-0 flex items-center">
                        {selectedVideo?.video_id === video.video_id ? (
                          <div className="bg-white text-primary px-3 py-1 rounded-sm border-2 border-white font-bold text-sm">
                            Playing
                          </div>
                        ) : (
                          <PlayCircle className="w-8 h-8 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t-3 border-black">
              {selectedVideo && (
                <Button
                  variant="secondary"
                  onClick={() => window.open(selectedVideo.url, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Watch on YouTube
                </Button>
              )}
              <Button variant="outline" onClick={onClose} className="ml-auto">
                Close
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <PlayCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No video solutions found</p>
            <p className="text-sm text-gray-500">Try searching YouTube manually or check back later</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default VideoSolutionModal;
