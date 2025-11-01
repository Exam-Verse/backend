import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { facultyAPI, paperAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

const FacultyDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState({ totalPapers: 0 });
  const [recentPapers, setRecentPapers] = useState([]);
  const [myPapers, setMyPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload form state
  const [form, setForm] = useState({
    subject: '',
    college: user?.college || '',
    course: user?.course || '',
    semester: user?.semester || 1,
    year: new Date().getFullYear(),
    exam_type: 'Midterm',
    extract_questions: true,
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [dashRes, papersRes] = await Promise.all([
        facultyAPI.getDashboard(),
        facultyAPI.getMyPapers(),
      ]);
      setStats(dashRes.data.stats || { totalPapers: 0 });
      setRecentPapers(dashRes.data.recentPapers || []);
      setMyPapers(papersRes.data || []);
    } catch (e) {
      console.error('Failed to load faculty dashboard', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a PDF file');
    const fd = new FormData();
    fd.append('file', file);
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    try {
      setUploading(true);
      setMessage('Uploading and processing...');
      const res = await paperAPI.uploadPDF(fd);
      if (res.data.success) {
        setMessage('Upload successful. Questions extracted.');
        setFile(null);
        setForm((f) => ({ ...f, subject: '' }));
        await loadDashboard();
      } else {
        setMessage(res.data.message || 'Upload failed');
      }
    } catch (e) {
      console.error('Upload failed', e);
      setMessage(e.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container-brutal">
        <div className="mb-10">
          <div className="bg-primary text-white border-4 border-black shadow-brutal-lg p-8">
            <h1 className="text-4xl font-bold mb-2">Faculty Dashboard</h1>
            <p className="text-lg">Welcome, {user?.username}. Create and manage your papers.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-secondary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-gray-700 mb-1">My Papers</p>
                <p className="text-4xl font-bold">{stats.totalPapers || myPapers.length}</p>
              </div>
              <div className="text-5xl">🧑‍🏫</div>
            </div>
          </Card>
        </div>

        {/* Upload */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold uppercase mb-4">Upload Paper (PDF)</h2>
          <Card className="bg-white">
            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input-brutal" placeholder="Subject" value={form.subject} onChange={(e)=>setForm({...form, subject:e.target.value})} required />
              <input className="input-brutal" placeholder="College" value={form.college} onChange={(e)=>setForm({...form, college:e.target.value})} required />
              <input className="input-brutal" placeholder="Course" value={form.course} onChange={(e)=>setForm({...form, course:e.target.value})} required />
              <input className="input-brutal" type="number" min={1} max={12} placeholder="Semester" value={form.semester} onChange={(e)=>setForm({...form, semester:Number(e.target.value)})} required />
              <input className="input-brutal" type="number" min={1990} max={2100} placeholder="Year" value={form.year} onChange={(e)=>setForm({...form, year:Number(e.target.value)})} required />
              <select className="input-brutal" value={form.exam_type} onChange={(e)=>setForm({...form, exam_type:e.target.value})}>
                <option>Midterm</option>
                <option>Endterm</option>
                <option>Supplementary</option>
              </select>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.extract_questions} onChange={(e)=>setForm({...form, extract_questions:e.target.checked})} />
                <span className="font-bold">Auto-extract questions</span>
              </label>
              <input className="input-brutal" type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files[0] || null)} required />
              <div className="md:col-span-2">
                <Button variant="primary" disabled={uploading}>
                  {uploading ? 'Uploading…' : 'Upload PDF'}
                </Button>
                {message && <span className="ml-4 font-bold text-gray-700">{message}</span>}
              </div>
            </form>
          </Card>
        </div>

        {/* My Papers */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold uppercase">My Papers</h2>
          </div>
          {loading ? (
            <Card className="text-center py-12">
              <p className="text-gray-600 font-bold">Loading…</p>
            </Card>
          ) : myPapers.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-xl font-bold mb-2">No papers yet</p>
              <p className="text-gray-600">Upload your first paper using the form above.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPapers.map((paper) => (
                <Card key={paper.id} hover>
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="primary">{paper.exam_type || paper.examType}</Badge>
                    <Badge variant="secondary">{paper.year}</Badge>
                  </div>
                  <h3 className="text-lg font-bold mb-2 uppercase">{paper.subject}</h3>
                  <p className="text-sm text-gray-600 mb-4">{paper.course} • Semester {paper.semester}</p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="font-bold">📝 {paper.question_count || paper.questionCount || 0} Questions</span>
                    {paper.has_faculty_solution && (
                      <span className="text-success font-bold">✓ Verified</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a className="btn btn-secondary text-center" href={`/papers/${paper.id}`}>View</a>
                    {paper.pdfUrl && (
                      <a className="btn btn-outline text-center" href={paper.pdfUrl} target="_blank" rel="noreferrer">PDF</a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
