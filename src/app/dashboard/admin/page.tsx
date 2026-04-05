'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dark, setDark] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    recruiters: 0,
    hrManagers: 0,
    candidates: 0,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setDark(true);

    const userStr = Cookies.get('user');
    if (userStr) setUser(JSON.parse(userStr));

    loadStats();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const loadStats = async () => {
    try {
      const res = await api.get('/admin/users');
      const users = res.data;

      setStats({
        totalUsers: users.length,
        recruiters: users.filter((u: any) => u.role === 'RECRUITER').length,
        hrManagers: users.filter((u: any) => u.role === 'HR_MANAGER').length,
        candidates: users.filter((u: any) => u.role === 'CANDIDATE').length,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/');
  };

  const bg = dark ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800';
  const card = dark
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-slate-200';

  return (
    <div className={`min-h-screen transition-all duration-500 ${bg}`}>

      {/* HEADER */}
      <header className={`${card} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm opacity-70">
              {user?.firstName} {user?.lastName}
            </p>
          </div>

          <div className="flex gap-3 items-center">

            {/* DARK MODE TOGGLE */}
            <button
              onClick={() => setDark(!dark)}
              className="px-3 py-2 rounded-lg bg-indigo-500 text-white text-sm"
            >
              {dark ? '☀️ Light' : '🌙 Dark'}
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
            >
              Déconnexion
            </button>

          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <AnimatedCard title="Utilisateurs" value={stats.totalUsers} icon="" card={card} />
          <AnimatedCard title="Recruteurs" value={stats.recruiters} icon="" card={card} />
          <AnimatedCard title="RH" value={stats.hrManagers} icon="" card={card} />
          <AnimatedCard title="Candidats" value={stats.candidates} icon="" card={card} />

        </div>

        {/* ACTIONS */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <Action href="/dashboard/admin/users/create" title="Créer utilisateur" card={card} />
            <Action href="/dashboard/admin/users" title="Gérer utilisateurs" card={card} />
            <Action href="/dashboard/admin/jobs" title="Offres" card={card} />
           
          </div>
        </div>

      

      </main>
    </div>
  );
}

/* COMPONENTS */

function AnimatedCard({ title, value, icon, card }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${card} p-6 rounded-xl border shadow-md`}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm opacity-70">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </motion.div>
  );
}

function Action({ href, title, card }: any) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className={`${card} p-5 rounded-xl border shadow-sm cursor-pointer`}
      >
        {title}
      </motion.div>
    </Link>
  );
}

function Panel({ title, children, card }: any) {
  return (
    <div className={`${card} p-6 rounded-xl border shadow-sm`}>
      <h3 className="mb-4 font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Status({ label }: any) {
  return (
    <div className="flex justify-between text-sm mb-2">
      <span>{label}</span>
      <span className="text-emerald-500"> OK</span>
    </div>
  );
}