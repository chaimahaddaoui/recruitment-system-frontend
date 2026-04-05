'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  mustChangePassword: boolean;
  createdAt: string;
}

export default function UsersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err: any) {
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, email: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${email} ?`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers(); 
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">Admin</span>;
      case 'HR_MANAGER':
        return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold"> RH Manager</span>;
      case 'RECRUITER':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">Recruteur</span>;
      case 'CANDIDATE':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Candidat</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold"> Actif</span>;
      case 'INACTIVE':
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold"> Inactif</span>;
      case 'SUSPENDED':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold"> Suspendu</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-red-600">
               Gestion des Utilisateurs
            </h1>
            <Link
              href="/dashboard/admin/users/create"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
               Nouvel Utilisateur
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créé le
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.mustChangePassword && (
                        <span className="inline-block mt-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          ⚠️ Doit changer le mot de passe
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleDelete(user.id, user.email)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️ Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}