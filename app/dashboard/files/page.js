'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

export default function Files() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showQR, setShowQR] = useState(false);
  
  useEffect(() => {
    fetchFiles();
  }, []);
  
  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/files');
      
      if (!response.ok) {
        throw new Error('Error al obtener archivos');
      }
      
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteFile = async (fileId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
      return;
    }
    
    try {
      const response = await fetch('/api/files', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar archivo');
      }
      
      toast.success('Archivo eliminado correctamente');
      fetchFiles();  // Recargar lista de archivos
      
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  const handleViewDetails = (file) => {
    setSelectedFile(file);
  };
  
  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Enlace copiado al portapapeles');
  };
  
  const closeDetails = () => {
    setSelectedFile(null);
    setShowQR(false);
  };

  const getFileIcon = (fileType) => {
    const iconBase = "w-10 h-10 rounded-lg p-2 ";
    
    if (fileType.includes('image')) {
      return (
        <div className={iconBase + "bg-blue-100 text-blue-600"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    } else if (fileType.includes('pdf')) {
      return (
        <div className={iconBase + "bg-red-100 text-red-600"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      );
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return (
        <div className={iconBase + "bg-indigo-100 text-indigo-600"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className={iconBase + "bg-gray-100 text-gray-600"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      );
    }
  };
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mis Archivos</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : files.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Archivo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Tamaño
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Descargas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
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
                      {getFileIcon(file.type)}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {file.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-500">{file.type.split('/')[1]}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-500">{file.downloadCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${file.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {file.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(file)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Detalles
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">No tienes archivos subidos aún.</p>
          <button
            onClick={() => router.push('/dashboard/upload')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700"
          >
            Subir primer archivo
          </button>
        </div>
      )}
      
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeDetails}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold mb-6">Detalles del archivo</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                <p className="mt-1 text-base font-semibold">{selectedFile.name}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tamaño</h3>
                  <p className="mt-1">{formatFileSize(selectedFile.size)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                  <p className="mt-1">{selectedFile.type}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Descargas</h3>
                  <p className="mt-1">{selectedFile.downloadCount}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                  <p className="mt-1">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedFile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedFile.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Fecha de creación</h3>
                  <p className="mt-1">{new Date(selectedFile.createdAt).toLocaleString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Expira</h3>
                  <p className="mt-1">{new Date(selectedFile.expiresAt).toLocaleString()}</p>
                </div>
              </div>
              
              {selectedFile.accessCode && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Código de acceso</h3>
                  <p className="mt-1">{selectedFile.accessCode}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Enlace para compartir</h3>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={`${window.location.origin}/share/${selectedFile._id}`}
                    readOnly
                  />
                  <button
                    onClick={() => handleCopyLink(`${window.location.origin}/share/${selectedFile._id}`)}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {showQR ? 'Ocultar QR' : 'Mostrar QR'}
                </button>
                
                {showQR && (
                  <div className="mt-4 flex justify-center">
                    <div className="p-4 bg-white border border-gray-200 rounded-md">
                      <QRCodeSVG value={`${window.location.origin}/share/${selectedFile._id}`} size={200} />
                      <p className="mt-2 text-center text-sm text-gray-500">
                        Escanea este código para acceder al archivo
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
} 