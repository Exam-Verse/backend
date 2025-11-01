import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Calendar, BookOpen, Award, Eye, ChevronLeft, Download, Share2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import QuestionCard from '../components/QuestionCard';
import { paperAPI, questionAPI } from '../services/api';

const PaperViewer = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaperAndQuestions();
  }, [paperId]);

  const fetchPaperAndQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch paper details
      const paperResponse = await paperAPI.getById(paperId);
      if (paperResponse.data.success) {
        setPaper(paperResponse.data.paper);
      }

      // Fetch questions
      const questionsResponse = await questionAPI.getByPaper(paperId);
      if (questionsResponse.data.success) {
        setQuestions(questionsResponse.data.questions || []);
      }
    } catch (err) {
      setError('Failed to load paper. Please try again.');
      console.error('Error fetching paper:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (paper?.pdf_url) {
      window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${paper.pdf_url}`, '_blank');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${paper.subject} - ${paper.year}`,
          text: `Check out this exam paper from ${paper.college}`,
          url: url,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading paper...</p>
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-3 border-black p-8 rounded-sm shadow-brutal text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Paper Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The paper you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/papers')}>
            Browse Papers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-3 border-black">
        <div className="container-width py-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge color="primary">{paper.exam_type}</Badge>
                <Badge color="secondary">{paper.semester} Semester</Badge>
                <Badge color="accent">{paper.year}</Badge>
              </div>

              <h1 className="text-3xl font-display font-bold mb-2">
                {paper.subject}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {paper.college}
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {paper.course}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {paper.views || 0} views
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                Uploaded by <span className="font-semibold text-gray-700">{paper.faculty_name}</span>
                {paper.created_at && (
                  <span> on {new Date(paper.created_at).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleDownloadPDF}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-width py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Questions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Questions ({questions.length})
              </h2>
            </div>

            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    paperSubject={paper.subject}
                  />
                ))}
              </div>
            ) : (
              <div className="card-brutal text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No questions available</p>
                <p className="text-sm text-gray-500">
                  Questions will appear here once they are extracted from the PDF
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Paper Info Card */}
            <div className="card-brutal sticky top-4">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Paper Details
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Subject</p>
                  <p className="font-semibold">{paper.subject}</p>
                </div>

                <div>
                  <p className="text-gray-600 mb-1">College</p>
                  <p className="font-semibold">{paper.college}</p>
                </div>

                <div>
                  <p className="text-gray-600 mb-1">Course</p>
                  <p className="font-semibold">{paper.course}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-600 mb-1">Semester</p>
                    <p className="font-semibold">{paper.semester}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Year</p>
                    <p className="font-semibold">{paper.year}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 mb-1">Exam Type</p>
                  <p className="font-semibold capitalize">{paper.exam_type}</p>
                </div>

                <div>
                  <p className="text-gray-600 mb-1">Total Questions</p>
                  <p className="font-semibold">{paper.question_count || questions.length}</p>
                </div>

                {paper.has_faculty_solution && (
                  <div>
                    <Badge color="accent" className="w-full justify-center">
                      Faculty Solution Available
                    </Badge>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t-3 border-black">
                <Button
                  variant="primary"
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  View PDF
                </Button>
              </div>
            </div>

            {/* Quick Tips Card */}
            <div className="card-brutal bg-blue-50">
              <h3 className="font-bold text-lg mb-3">💡 Quick Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Click "Generate AI Solution" for step-by-step explanations</li>
                <li>• Watch video tutorials for visual learning</li>
                <li>• Report any issues with questions or solutions</li>
                <li>• Vote to help others find quality content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperViewer;
