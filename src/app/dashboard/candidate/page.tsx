'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CandidateDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);

  // 🔥 Load user + theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setDark(true);

    const userStr = Cookies.get('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }

    setLoading(false);
  }, []);

  // 🔥 Save theme
  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/');
  };

  // 🎨 SAME STYLE AS ADMIN
  const bg = dark ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800';
  const card = dark
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-slate-200';

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bg}`}>
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${bg}`}>

      {/* HEADER */}
      <header className={`${card} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold">Dashboard Candidat</h1>
            <p className="text-sm opacity-70">
              {user?.firstName} {user?.lastName}
            </p>
          </div>

          <div className="flex gap-3 items-center">

            {/* 🌙 DARK MODE */}
            <button
              onClick={() => setDark(!dark)}
              className="px-3 py-2 rounded-lg bg-indigo-500 text-white text-sm"
            >
              {dark ? '☀️ Light' : '🌙 Dark'}
            </button>

            <div className="text-right">
              <p className="font-semibold">{user?.email}</p>
              <p className="text-sm text-blue-400">{user?.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <Card title="Candidatures" value="0" card={card} />
          <Card title="En cours" value="0" card={card} />
          <Card title="Entretiens" value="0" card={card} />
          <Card title="Acceptées" value="0" card={card} />

        </div>

        {/* ACTIONS */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>

          <div className="grid md:grid-cols-3 gap-4">

            <Action href="/dashboard/candidate/jobs" title="Offres d'emploi" card={card} />
            <Action href="/dashboard/candidate/applications" title="Mes candidatures" card={card} />
            <Action href="/dashboard/candidate/profile" title="Mon profil" card={card} />

          </div>
        </div>

        {/* INFO */}
        <div className={`${card} p-6 rounded-xl border`}>
          <h3 className="mb-4 font-semibold">
            Commencez votre recherche
          </h3>

          <ul className="space-y-2 text-sm opacity-80">
            <li>✔ Complétez votre profil</li>
            <li>✔ Explorez les offres</li>
            <li>✔ Postulez facilement</li>
            <li>✔ Suivez vos candidatures</li>
          </ul>
        </div>

      </main>
    </div>
  );
}

/* COMPONENTS */

function Card({ title, value, card }: any) {
  return (
    <div className={`${card} p-6 rounded-xl border shadow-md`}>
      <p className="text-sm opacity-70">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function Action({ href, title, card }: any) {
  return (
    <Link href={href}>
      <div className={`${card} p-5 rounded-xl border shadow-sm hover:scale-105 transition cursor-pointer`}>
        {title}
      </div>
    </Link>
  );
}