import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/api';
import { Card, Button, Badge } from '../components/ui';
import { Link } from 'react-router-dom';

const SavedItems = () => {
  const [papers, setPapers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [pRes, qRes] = await Promise.all([
          userAPI.getSavedPapers(),
          userAPI.getSavedQuestions(),
        ]);
        setPapers(pRes.data || []);
        setQuestions(qRes.data || []);
      } catch (e) {
        console.error('Failed to load saved items', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen py-10">
      <div className="container-brutal">
        <div className="mb-10">
          <div className="bg-primary text-white border-4 border-black shadow-brutal-lg p-8">
            <h1 className="text-4xl font-bold mb-2">Saved Items</h1>
            <p className="text-lg">Quick access to your favorites</p>
          </div>
        </div>

        {loading ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 font-bold">Loading…</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Saved Papers */}
            <div>
              <h2 className="text-2xl font-bold uppercase mb-4">Papers ({papers.length})</h2>
              {papers.length === 0 ? (
                <Card className="text-center py-10">
                  <p className="font-bold">No saved papers yet</p>
                  <Link to="/papers" className="btn btn-primary mt-4 inline-block">Browse Papers</Link>
                </Card>
              ) : (
                <div className="space-y-4">
                  {papers.map((paper) => (
                    <Card key={paper.id} hover>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="primary">{paper.exam_type || paper.examType}</Badge>
                        <Badge variant="secondary">{paper.year}</Badge>
                      </div>
                      <h3 className="font-bold text-lg mb-1">{paper.subject}</h3>
                      <p className="text-sm text-gray-600 mb-3">{paper.course} • Semester {paper.semester}</p>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="font-bold">📝 {paper.question_count || paper.questionCount || 0} Questions</span>
                        {paper.has_faculty_solution && <span className="text-success font-bold">✓ Verified</span>}
                      </div>
                      <Link to={`/papers/${paper.id}`} className="btn btn-secondary">Open</Link>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Questions */}
            <div>
              <h2 className="text-2xl font-bold uppercase mb-4">Questions ({questions.length})</h2>
              {questions.length === 0 ? (
                <Card className="text-center py-10">
                  <p className="font-bold">No saved questions yet</p>
                  <p className="text-gray-600 mt-2">Save tricky questions to revisit later.</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {questions.map((q) => (
                    <Card key={q.id}>
                      <div className="text-sm text-gray-600 mb-2">Paper: {q.paper_id}</div>
                      <div className="font-bold mb-2">Q{q.question_number}: {q.question_text?.slice(0, 160)}{q.question_text && q.question_text.length > 160 ? '…' : ''}</div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Marks: {q.marks || '-'}</span>
                        <Link to={`/papers/${q.paper_id}`} className="btn btn-outline">View Paper</Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedItems;
