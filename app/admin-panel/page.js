'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        toast.error('Acceso denegado. Solo administradores.');
        router.push('/dashboard');
      } else {
        fetchUsers();
        fetchFiles();
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session]);
  
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }
      
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoadingUsers(false);
    }
  };
  
  const fetchFiles = async () => {
    try {
      setIsLoadingFiles(true);
      const response = await fetch('/api/admin/files');
      
      if (!response.ok) {
        throw new Error('Error al obtener archivos');
      }
      
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoadingFiles(false);
    }
  };
  
  const toggleUserStatus = async (userId, isActive) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          isActive: !isActive,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar usuario');
      }
      
      toast.success('Usuario actualizado correctamente');
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  const toggleFileStatus = async (fileId, isActive) => {
    try {
      const response = await fetch('/api/admin/files', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId,
          isActive: !isActive,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar archivo');
      }
      
      toast.success('Archivo actualizado correctamente');
      fetchFiles();
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  if (status === 'loading' || (status === 'authenticated' && session?.user?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('users')}
            >
              Usuarios
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'files'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('files')}
            >
              Archivos
            </button>
          </div>
          
          {/* Tabla de usuarios */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <h2 className="text-xl font-bold m-6">Gestión de Usuarios</h2>
              
              {isLoadingUsers ? (
                <div className="flex justify-center items-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de registro
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Activo' : 'Bloqueado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleUserStatus(user._id, user.isActive)}
                            className={`text-sm ${
                              user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                            }`}
                            disabled={user.role === 'admin' && session.user.email === user.email}
                          >
                            {user.isActive ? 'Bloquear' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          
          {/* Tabla de archivos */}
          {activeTab === 'files' && (
            <div className="overflow-x-auto">
              <h2 className="text-xl font-bold m-6">Gestión de Archivos</h2>
              
              {isLoadingFiles ? (
                <div className="flex justify-center items-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Archivo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Propietario
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tamaño
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descargas
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expira
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {files.map((file) => (
                      <tr key={file._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{file.name}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(file.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{file.ownerId?.name || 'Desconocido'}</div>
                          <div className="text-sm text-gray-500">{file.ownerId?.email || 'Email no disponible'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{file.downloadCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            file.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {file.isActive ? 'Activo' : 'Desactivado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(file.expiresAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleFileStatus(file._id, file.isActive)}
                            className={`text-sm ${
                              file.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {file.isActive ? 'Desactivar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
} 