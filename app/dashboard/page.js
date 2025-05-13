'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalFiles: 0,
    activeFiles: 0,
    downloadCount: 0,
    recentFiles: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchStats();
    
    // Actualizar estadísticas cada 30 segundos
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stats');
      
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <button 
          onClick={fetchStats}
          className="text-sm text-gray-400 hover:text-pink-500 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar datos
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 rounded-lg border border-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-800 text-pink-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8M10 14v-2m4 2v-2"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-medium text-gray-400">Total de archivos</h2>
              <p className="text-2xl font-semibold text-white">
                {isLoading ? (
                  <span className="inline-block w-12 bg-gray-800 animate-pulse h-8 rounded"></span>
                ) : (
                  stats.totalFiles
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg border border-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-800 text-pink-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-medium text-gray-400">Archivos activos</h2>
              <p className="text-2xl font-semibold text-white">
                {isLoading ? (
                  <span className="inline-block w-12 bg-gray-800 animate-pulse h-8 rounded"></span>
                ) : (
                  stats.activeFiles
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg border border-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-800 text-pink-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-medium text-gray-400">Descargas totales</h2>
              <p className="text-2xl font-semibold text-white">
                {isLoading ? (
                  <span className="inline-block w-12 bg-gray-800 animate-pulse h-8 rounded"></span>
                ) : (
                  stats.downloadCount
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-lg border border-gray-800 shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Archivos recientes</h2>
          <Link href="/dashboard/files" className="text-pink-500 hover:text-pink-400">
            Ver todos
          </Link>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-800 animate-pulse rounded"></div>
            ))}
          </div>
        ) : stats.recentFiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Tamaño
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Descargas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Expira
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {stats.recentFiles.map((file) => (
                  <tr key={file._id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs">
                      <div className="text-sm font-medium text-gray-200">{file.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">{formatFileSize(file.size)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">{file.downloadCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${file.isActive ? 'bg-pink-900 text-pink-200' : 'bg-gray-800 text-gray-400'}`}>
                        {file.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {new Date(file.expiresAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No has subido ningún archivo aún.</p>
            <Link 
              href="/dashboard/upload" 
              className="mt-4 inline-flex items-center px-4 py-2 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700"
            >
              Subir ahora
            </Link>
          </div>
        )}
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