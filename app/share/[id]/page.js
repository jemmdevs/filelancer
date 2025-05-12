'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ShareFile() {
  const params = useParams();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessCode, setAccessCode] = useState('');
  const [needsCode, setNeedsCode] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchFileInfo();
  }, []);
  
  const fetchFileInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/download/${params.id}?code=${accessCode}`);
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          setNeedsCode(true);
        } else {
          throw new Error(data.error || 'Error al acceder al archivo');
        }
      } else {
        setFile(data);
        setNeedsCode(false);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitCode = (e) => {
    e.preventDefault();
    fetchFileInfo();
  };
  
  const getFileTypeIcon = (fileType) => {
    if (fileType?.includes('image')) {
      return (
        <svg className="w-24 h-24 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType?.includes('pdf')) {
      return (
        <svg className="w-24 h-24 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (fileType?.includes('video')) {
      return (
        <svg className="w-24 h-24 mx-auto text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType?.includes('audio')) {
      return (
        <svg className="w-24 h-24 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    } else {
      return (
        <svg className="w-24 h-24 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
  };
  
  function formatFileSize(bytes) {
    if (!bytes) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error && !needsCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
          <div className="mb-4 text-red-500">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Error al acceder al archivo</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }
  
  if (needsCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
          <div className="mb-6 text-blue-600">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">Archivo protegido</h2>
          <p className="text-gray-600 mb-6 text-center">
            Este archivo está protegido con un código de acceso. Por favor, introdúcelo para continuar.
          </p>
          
          <form onSubmit={handleSubmitCode} className="space-y-4">
            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
                Código de acceso
              </label>
              <input
                id="accessCode"
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Introduce el código"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Acceder
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow p-8">
        <div className="mb-8">
          {getFileTypeIcon(file?.type)}
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold truncate mb-2">{file?.name}</h1>
          <p className="text-gray-600">{formatFileSize(file?.size)}</p>
        </div>
        
        <div className="flex flex-col space-y-4">
          <a
            href={file?.url}
            download={file?.name}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
            onClick={() => toast.success('Descarga iniciada')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar archivo
          </a>
          
          <Link
            href="/"
            className="text-center text-sm text-blue-600 hover:text-blue-500"
          >
            Volver al inicio
          </Link>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Este archivo es compartido a través de FileLancer. Si no confías en la fuente, ten cuidado al descargar.
          </p>
        </div>
      </div>
    </div>
  );
} 