import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from '../components/ui';
import VideoSolutionModal from '../components/VideoSolutionModal';
import { videosAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { paperAPI, userAPI } from '../services/api';

export const StudentDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [recentPapers, setRecentPapers] = useState([]);
  const [stats, setStats] = useState({
    totalPapers: 0,
    solved: 0,
    saved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [videoQuery, setVideoQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [showVideosModal, setShowVideosModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      // Fetch recent papers and stats
      const [papersRes, savedPapersRes, savedQuestionsRes] = await Promise.all([
        paperAPI.getAll({ college: user.college, limit: 6 }),
        userAPI.getSavedPapers(),
        userAPI.getSavedQuestions(),
      ]);
      
      setRecentPapers(papersRes.data.papers || []);
      setStats({
        totalPapers: papersRes.data.total || 0,
        solved: 0, // TODO: wire to actual tracking when available
        saved: (savedPapersRes.data?.length || 0) + (savedQuestionsRes.data?.length || 0),
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommended videos for the user on mount
  useEffect(() => {
    const defaultQuery = `${user.course} semester ${user.semester || ''} exam preparation`.trim();
    handleSearchVideos(defaultQuery, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchVideos = async (query, openModal = true) => {
    try {
      setVideosLoading(true);
      const res = await videosAPI.search(query, { max_results: 6, order: 'relevance', duration: 'medium' });
      if (res.data.success) {
        setVideos(res.data.videos || []);
        if (openModal) setShowVideosModal(true);
      }
    } catch (e) {
      console.error('Video search failed:', e);
    } finally {
      setVideosLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen py-10">
      <div className="container-brutal">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="bg-primary text-white border-4 border-black shadow-brutal-lg p-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="text-secondary">{user.username}!</span>
            </h1>
            <p className="text-lg">
              {user.college} • {user.course} • Year {user.year}
            </p>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-secondary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-gray-700 mb-1">Total Papers</p>
                <p className="text-4xl font-bold">{stats.totalPapers}</p>
              </div>
              <div className="text-5xl">📄</div>
            </div>
          </Card>
          
          <Card className="bg-accent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-gray-700 mb-1">Questions Solved</p>
                <p className="text-4xl font-bold">{stats.solved}</p>
              </div>
              <div className="text-5xl">✅</div>
            </div>
          </Card>
          
          <Card className="bg-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-gray-700 mb-1">Saved Items</p>
                <p className="text-4xl font-bold">{stats.saved}</p>
              </div>
              <div className="text-5xl">⭐</div>
            </div>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 uppercase">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/papers">
              <Card hover className="text-center bg-white">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-bold uppercase">Browse Papers</p>
              </Card>
            </Link>
            
            <Link to="/saved">
              <Card hover className="text-center bg-white">
                <div className="text-4xl mb-3">⭐</div>
                <p className="font-bold uppercase">Saved Items</p>
              </Card>
            </Link>
            
            <Link to="/student/progress">
              <Card hover className="text-center bg-white">
                <div className="text-4xl mb-3">📊</div>
                <p className="font-bold uppercase">My Progress</p>
              </Card>
            </Link>
            
            <Link to="/student/profile">
              <Card hover className="text-center bg-white">
                <div className="text-4xl mb-3">⚙️</div>
                <p className="font-bold uppercase">Settings</p>
              </Card>
            </Link>
          </div>
        </div>
        
        {/* Video Hub */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold uppercase">Video Hub</h2>
            <div className="flex gap-2">
              <input
                value={videoQuery}
                onChange={(e) => setVideoQuery(e.target.value)}
                placeholder={`Search videos e.g. ${user.course} ${user.year} algorithms`}
                className="input-brutal w-64"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSearchVideos(videoQuery || `${user.course} exam preparation`)}
                disabled={videosLoading}
              >
                {videosLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          {videosLoading && (
            <Card className="text-center py-10">
              <p className="font-bold text-gray-700">Finding the best videos for you...</p>
            </Card>
          )}

          {!videosLoading && videos.length > 0 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((v) => (
                  <Card key={v.video_id} hover>
                    <div className="mb-3">
                      <img src={v.thumbnail} alt={v.title} className="w-full h-40 object-cover border-3 border-black" />
                    </div>
                    <h3 className="font-bold mb-2 line-clamp-2">{v.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{v.channel}</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedVideo(v);
                        setShowVideosModal(true);
                      }}
                    >
                      Watch
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Papers */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold uppercase">Recent Papers</h2>
            <Link to="/papers">
              <Button variant="outline" size="sm">View All →</Button>
            </Link>
          </div>
          
          {loading ? (
            <Card className="text-center py-12">
              <p className="text-gray-600 font-bold">Loading papers...</p>
            </Card>
          ) : recentPapers.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-xl font-bold mb-2">No papers available yet</p>
              <p className="text-gray-600">Check back soon or ask your faculty to upload papers!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPapers.map((paper) => (
                <Card key={paper.id} hover>
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="primary">{paper.exam_type}</Badge>
                    <Badge variant="secondary">{paper.year}</Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 uppercase">{paper.subject}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {paper.course} • Semester {paper.semester}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="font-bold">📝 {paper.question_count || 0} Questions</span>
                    {paper.has_faculty_solution && (
                      <span className="text-success font-bold">✓ Verified</span>
                    )}
                  </div>
                  
                  <Link to={`/papers/${paper.id}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      View Paper
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Tips Section */}
        <div className="mt-10">
          <Card className="bg-secondary">
            <h3 className="text-xl font-bold mb-4 uppercase">💡 Study Tips</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span>Start with papers from your current semester and work backwards</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span>Save difficult questions for later review</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span>Use video explanations when you're stuck on concepts</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span>Report incorrect AI solutions to help improve the platform</span>
              </li>
            </ul>
          </Card>
        </div>
        {/* Videos Modal */}
        <VideoSolutionModal
          isOpen={showVideosModal}
          onClose={() => setShowVideosModal(false)}
          videos={videos}
          questionText={videoQuery ? `Search: ${videoQuery}` : `${user.course} exam prep`}
          loading={videosLoading}
          initialVideo={selectedVideo}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
 
// Videos modal mounted at root of page
// Place after export to avoid interfering with default export
// (Modal itself is mounted via portal)
/* JSX insertion in component render above: */
/*
  <VideoSolutionModal
    isOpen={showVideosModal}
    onClose={() => setShowVideosModal(false)}
    videos={videos}
    questionText={videoQuery ? `Search: ${videoQuery}` : `${user.course} exam prep`}
    loading={videosLoading}
    initialVideo={selectedVideo}
  />
*/
