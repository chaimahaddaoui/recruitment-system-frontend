'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Header() {
  const router = useRouter();
  
  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/auth/login');
  };

  const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              SmartHire
            </h1>
          </div>

          {user && (
            <div className="flex items-center gap-6">
              <div className="text-sm">
                <p className="font-semibold text-gray-800">{user.email}</p>
                <p className="text-gray-500">{user.role}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}