'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface ProfileMenuProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
}

export default function ProfileMenu({ 
  userName = 'User', 
  userEmail = 'user@email.com',
  userRole = 'USER'
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      Cookies.remove('token');
      Cookies.remove('user');
      toast.success(' Déconnexion réussie');
      router.push('/auth/login');
    } catch (error) {
      toast.error('❌ Erreur lors de la déconnexion');
    }
  };

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const getRoleColor = (role: string) => {
    switch(role.toUpperCase()) {
      case 'RECRUITER': return 'bg-blue-500';
      case 'HR_MANAGER': return 'bg-purple-500';
      case 'ADMIN': return 'bg-red-500';
      case 'CANDIDATE': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleLabel = (role: string) => {
    switch(role.toUpperCase()) {
      case 'RECRUITER': return 'Recruteur';
      case 'HR_MANAGER': return 'RH Manager';
      case 'ADMIN': return 'Administrateur';
      case 'CANDIDATE': return 'Candidat';
      default: return 'Utilisateur';
    }
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Icône Profil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
          transition-all duration-200 hover:scale-110 active:scale-95 shadow-md
          ${getRoleColor(userRole)} cursor-pointer
        `}
        title={`${userName} (${getRoleLabel(userRole)})`}
      >
        {initials}
      </button>

      {/* Menu Déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header du menu */}
          <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center font-bold text-white
                ${getRoleColor(userRole)}
              `}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{userName}</h3>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {getRoleLabel(userRole)}
                </span>
              </div>
            </div>
          </div>

          {/* Items du menu */}
          <div className="py-2">
            
            {/* Voir le profil/dashboard */}
            <button
              onClick={() => {
                setIsOpen(false);
                // Redirection selon le rôle
                const dashboardRoutes: { [key: string]: string } = {
                  'ADMIN': '/dashboard/admin',
                  'RECRUITER': '/dashboard/recruiter',
                  'HR_MANAGER': '/dashboard/hr-manager',
                  'CANDIDATE': '/dashboard/candidate',
                };
                const route = dashboardRoutes[userRole.toUpperCase()] || '/dashboard';
                router.push(route);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Voir le profil</p>
                <p className="text-xs text-gray-500">Accédez à votre tableau de bord</p>
              </div>
            </button>

            {/* Modifier le mot de passe */}
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/dashboard/change-password');
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150 text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="font-medium">Modifier le mot de passe</p>
                <p className="text-xs text-gray-500">Sécurisez votre compte</p>
              </div>
            </button>

            <div className="my-2 border-t border-gray-200"></div>

            {/* Déconnexion */}
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors duration-150 text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <div>
                <p className="font-medium">Se déconnecter</p>
                <p className="text-xs text-gray-500">Quitter la plateforme</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}