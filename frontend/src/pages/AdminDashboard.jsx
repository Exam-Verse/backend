import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { adminAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

const AdminDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const [pending, setPending] = useState([]);
  const [analytics, setAnalytics] = useState({ users: 0, papers: 0, questions: 0 });
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pendRes, anaRes] = await Promise.all([
        adminAPI.getPendingFaculty(),
        adminAPI.getAnalytics(),
      ]);
      setPending(pendRes.data || []);
      setAnalytics(anaRes.data || { users: 0, papers: 0, questions: 0 });
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  const act = async (type, id) => {
    try {
      setActionMsg(type === 'approve' ? 'Approving…' : 'Rejecting…');
      if (type === 'approve') await adminAPI.approveFaculty(id);
      else await adminAPI.rejectFaculty(id, 'Not specified');
      await loadData();
      setActionMsg('Done');
      setTimeout(()=>setActionMsg(''), 1200);
    } catch (e) {
      console.error('Action failed', e);
      setActionMsg('Failed');
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container-brutal">
        <div className="mb-10">
          <div className="bg-primary text-white border-4 border-black shadow-brutal-lg p-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-lg">Welcome, {user?.username}. Review faculty, monitor system.</p>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-secondary"><div className="flex items-center justify-between"><div><p className="text-sm font-bold uppercase text-gray-700 mb-1">Users</p><p className="text-4xl font-bold">{analytics.users}</p></div><div className="text-5xl">👥</div></div></Card>
          <Card className="bg-accent"><div className="flex items-center justify-between"><div><p className="text-sm font-bold uppercase text-gray-700 mb-1">Papers</p><p className="text-4xl font-bold">{analytics.papers}</p></div><div className="text-5xl">📄</div></div></Card>
          <Card className="bg-success"><div className="flex items-center justify-between"><div><p className="text-sm font-bold uppercase text-gray-700 mb-1">Questions</p><p className="text-4xl font-bold">{analytics.questions}</p></div><div className="text-5xl">📝</div></div></Card>
        </div>

        {/* Pending Faculty */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold uppercase">Pending Faculty Approvals</h2>
            {actionMsg && <div className="font-bold">{actionMsg}</div>}
          </div>

          {loading ? (
            <Card className="text-center py-12"><p className="text-gray-600 font-bold">Loading…</p></Card>
          ) : pending.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-xl font-bold mb-2">No pending requests</p>
              <p className="text-gray-600">All faculty accounts are reviewed.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pending.map((f) => (
                <Card key={f.id}>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-bold">{f.username}</h3>
                    <Badge variant="secondary">{f.role}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{f.college} • {f.department || f.course}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="success" onClick={()=>act('approve', f.id)}>Approve</Button>
                    <Button variant="danger" onClick={()=>act('reject', f.id)}>Reject</Button>
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

export default AdminDashboard;
