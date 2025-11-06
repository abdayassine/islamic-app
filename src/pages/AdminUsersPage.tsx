// Page de gestion des utilisateurs
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminSidebar from '../components/AdminSidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface User {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: 'superadmin' | 'admin' | 'user';
  language_preference: string;
  created_at: string;
  updated_at: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UsersResponse {
  users: User[];
  pagination: PaginationInfo;
}

export default function AdminUsersPage() {
  const { t, i18n } = useTranslation();
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtres et recherche
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Formulaire de création
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user' as 'superadmin' | 'admin' | 'user'
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const limit = 20;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      // Récupérer le token de session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Session expirée');
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(roleFilter && { role: roleFilter }),
        ...(search && { search })
      });

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erreur lors de la récupération des utilisateurs');
      }

      const result: UsersResponse = await response.json();
      setUsers(result.users);
      setPagination(result.pagination);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearch(searchTerm);
    setCurrentPage(1);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Session expirée');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erreur lors de la création de l\'utilisateur');
      }

      setShowCreateModal(false);
      setNewUser({ email: '', password: '', full_name: '', role: 'user' });
      await fetchUsers(); // Recharger la liste
    } catch (error: any) {
      setCreateError(error.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'superadmin' | 'admin' | 'user') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Session expirée');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, role: newRole })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erreur lors de la mise à jour du rôle');
      }

      await fetchUsers(); // Recharger la liste
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-semantic-error text-white';
      case 'admin': return 'bg-primary-700 text-white';
      case 'user': return 'bg-neutral-200 text-neutral-700';
      default: return 'bg-neutral-200 text-neutral-700';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin': return 'Superadmin';
      case 'admin': return 'Admin';
      case 'user': return 'Utilisateur';
      default: return role;
    }
  };

  // Filtrer les rôles selon les permissions
  const availableRoles = userProfile?.role === 'superadmin' 
    ? ['superadmin', 'admin', 'user']
    : ['admin', 'user'];

  if (loading && users.length === 0) {
    return (
      <div className="flex h-screen bg-background-page dark:bg-background-dark-page">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-dark-500">Chargement des utilisateurs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background-page dark:bg-background-dark-page">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary-900 mb-2">
                {t('admin.users.title', 'Gestion des Utilisateurs')}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-dark-500">
                {t('admin.users.subtitle', 'Gérer les comptes utilisateurs et leurs rôles')}
              </p>
            </div>
            
            {userProfile?.role === 'superadmin' && (
              <Button onClick={() => setShowCreateModal(true)}>
                ➕ {t('admin.users.createUser', 'Créer un utilisateur')}
              </Button>
            )}
          </div>

          {/* Filtres et recherche */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t('admin.users.searchPlaceholder', 'Rechercher par nom ou email...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="sm:w-48">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">{t('admin.users.allRoles', 'Tous les rôles')}</option>
                  <option value="superadmin">{t('admin.users.superadmins', 'Superadmins')}</option>
                  <option value="admin">{t('admin.users.admins', 'Admins')}</option>
                  <option value="user">{t('admin.users.users', 'Utilisateurs')}</option>
                </select>
              </div>
              
              <Button onClick={handleSearch} variant="outline">
                🔍 {t('admin.users.search', 'Rechercher')}
              </Button>
            </div>
          </Card>

          {error && (
            <Card className="p-4 mb-6">
              <div className="bg-semantic-error bg-opacity-10 border border-semantic-error text-semantic-error p-4 rounded-md">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Tableau des utilisateurs */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200 dark:border-neutral-dark-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      {t('admin.users.user', 'Utilisateur')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      {t('admin.users.role', 'Rôle')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      {t('admin.users.language', 'Langue')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      {t('admin.users.created', 'Créé le')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      {t('admin.users.actions', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-dark-900">
                            {user.full_name}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-dark-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-dark-500">
                        {user.language_preference?.toUpperCase() || 'FR'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-dark-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-dark-500">
                        {user.user_id !== userProfile?.user_id && (
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateRole(user.user_id, e.target.value as any)}
                            className="px-2 py-1 text-xs border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                            disabled={userProfile?.role === 'admin' && user.role === 'superadmin'}
                          >
                            {availableRoles.map(role => (
                              <option key={role} value={role}>
                                {getRoleLabel(role)}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 dark:border-neutral-dark-300">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-700 dark:text-neutral-dark-700">
                    {t('admin.users.showing', 'Affichage')} {((pagination.page - 1) * limit) + 1}-{Math.min(pagination.page * limit, pagination.total)} {t('admin.users.of', 'sur')} {pagination.total}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, pagination.page - 1))}
                      disabled={pagination.page <= 1}
                    >
                      ← Précédent
                    </Button>
                    
                    <span className="px-3 py-1 text-sm text-neutral-600 dark:text-neutral-dark-500">
                      {pagination.page} / {pagination.totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(pagination.totalPages, pagination.page + 1))}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      Suivant →
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modal de création d'utilisateur */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">
              {t('admin.users.createUserTitle', 'Créer un nouvel utilisateur')}
            </h3>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  {t('admin.users.email', 'Email')}
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  {t('admin.users.password', 'Mot de passe')}
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  {t('admin.users.fullName', 'Nom complet')}
                </label>
                <input
                  type="text"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  {t('admin.users.role', 'Rôle')}
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              
              {createError && (
                <div className="p-3 bg-semantic-error bg-opacity-10 border border-semantic-error text-semantic-error rounded-md text-sm">
                  {createError}
                </div>
              )}
              
              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  {t('admin.users.cancel', 'Annuler')}
                </Button>
                <Button type="submit" loading={createLoading} className="flex-1">
                  {t('admin.users.create', 'Créer')}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}