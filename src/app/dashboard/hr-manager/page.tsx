'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { interviewService } from '@/services/interviewService';
import { Interview, InterviewStatus } from '@/types';

export default function HRManagerDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = Cookies.get('user');

    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await interviewService.getMyInterviews();
      setInterviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/');
  };

  // 🔥 STATS
  const total = interviews.length;
  const upcoming = interviews.filter(i =>
    new Date(i.scheduledAt) > new Date() &&
    i.status === InterviewStatus.SCHEDULED
  ).length;

  const passed = interviews.filter(i => i.status === InterviewStatus.PASSED).length;

  const today = interviews.filter(i => {
    const d = new Date(i.scheduledAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  // 🔥 prochains entretiens
  const nextInterviews = interviews
    .filter(i => new Date(i.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-600">Dashboard RH</h1>
            <p className="text-gray-500">
              Bienvenue {user?.firstName} {user?.lastName}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* 🔥 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <Card title="Entretiens" value={total} color="purple" />
          <Card title="Aujourd'hui" value={today} color="blue" />
          <Card title="À venir" value={upcoming} color="orange" />
          <Card title="Réussis" value={passed} color="green" />

        </div>

        {/* 🔥 ACTIONS */}
        <div className="grid md:grid-cols-3 gap-6">

          <Link href="/dashboard/hr-manager/interviews"
            className="bg-purple-600 text-white p-6 rounded-xl shadow hover:scale-105 transition">
            📅 Gérer les entretiens
          </Link>

          <Link href="/dashboard/hr-manager/jobs"
            className="bg-blue-600 text-white p-6 rounded-xl shadow hover:scale-105 transition">
            📄 Offres d'emploi
          </Link>

          <Link href="/dashboard/hr-manager/users"
            className="bg-green-600 text-white p-6 rounded-xl shadow hover:scale-105 transition">
            👥 Utilisateurs
          </Link>

        </div>

        {/* 🔥 PROCHAINS ENTRETIENS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Prochains entretiens</h2>

          {nextInterviews.length === 0 ? (
            <p className="text-gray-500">Aucun entretien prévu</p>
          ) : (
            <div className="space-y-3">
              {nextInterviews.map(i => (
                <div key={i.id} className="border p-4 rounded-lg flex justify-between items-center">

                  <div>
                    <p className="font-semibold">
                      {i.application?.candidate?.firstName} {i.application?.candidate?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {i.application?.job?.title}
                    </p>
                  </div>

                  <div className="text-sm text-gray-600">
                    {new Date(i.scheduledAt).toLocaleString()}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

// 🔥 CARD
function Card({ title, value, color }: any) {
  const colors: any = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className={`text-3xl font-bold ${colors[color]}`}>
        {value}
      </h2>
    </div>
  );
}